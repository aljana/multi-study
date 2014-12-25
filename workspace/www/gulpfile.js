var
  fs = require('fs'),
  path = require('path'),
  gulp = require('gulp'),
  gulpsync = require('gulp-sync')(gulp),
  scheduler = require('./gulp/scheduler')(gulp).create(),
  error = require('./gulp/error')(scheduler),
  server = require('./gulp/server'),
  _ = require('lodash'),
  settings;

gulp.task('load development settings', function (cb) {
  settings = require('./gulp/settings')('development', './build', require('./package.json').app || {}, '../../');
  cb();
});

gulp.task('load staging settings', function (cb) {
  settings = require('./gulp/settings')('staging', './dist', require('./package.json').app || {}, '../../');
  cb();
});

gulp.task('load production settings', function (cb) {
  settings = require('./gulp/settings')('production', './dist', require('./package.json').app || {}, '../../');
  cb();
});

gulp.task('clean production folders', function (cb) {
  require('del')([
    settings.paths.build,
    settings.paths.dist
  ], {force: true}, cb);
});

gulp.task('clean development folders', function (cb) {
  require('del')([
    settings.paths.build
  ], {force: true}, cb);
});

gulp.task('compile styles', function () {
  scheduler.task('compile styles').lock();

  var sourcemaps = require('gulp-sourcemaps');
  var autoprefix = new (require('less-plugin-autoprefix'))({browsers: ['last 2 versions']});
  var filter = require('gulp-filter');
  var filters = {
    css1: filter('**/*.css'),
    css2: filter('**/*.css'),
    less: filter('**/*.less'),
    output: filter('**/*.{css,map}')
  };

  return require('event-stream').merge(
    gulp.src('./src/*/**/*.{css,less}', {base: path.resolve('./src')})
      .pipe(require('gulp-plumber')({errorHandler: error('compile styles')}))
      .pipe(require('gulp-changed')(settings.paths.build, {extension: '.css'}))
      .pipe(filters.css1)
      .pipe(sourcemaps.init())
      .pipe(require('gulp-autoprefixer')())
      .pipe(sourcemaps.write()) // write inline
      .pipe(filters.css1.restore())
      .pipe(filters.less)
      .pipe(sourcemaps.init())
      .pipe(require('gulp-less')({paths: ['./'], plugins: [autoprefix]}))
      .pipe(sourcemaps.write('./', {
        includeContent: false,
        sourceRoot: '/www'
      }))
      .pipe(filters.less.restore())
      .pipe(filters.css2)
      .pipe(require('gulp-preprocess')({context: settings.flat}))
      .pipe(filters.css2.restore()),
    gulp.src(['./src/*/**/*.*', '!./src/*/**/*.{html,css,less,js,coffee,txt}'], {
      read: false,
      base: path.resolve('./src')
    })
  )
    .pipe(require('gulp-plumber')({errorHandler: error('compile styles')}))
    .pipe(require('gulp-revsolve')({
      regex: /(?:url\(["']?(.*?)['"]?\))/g,
      filterExtensions: ['css'],
      debug: 1,
      base: path.resolve('./src'),
      patterns: ['src'],
      addDestPrefix: settings.workspace['environment'] === 'development' ? '/' + settings.app.name : '/'
    }))
    .pipe(filters.output)
    .pipe(gulp.dest(settings.paths.build))
    .pipe(require('through2').obj(function (chunk, enc, callback) {
      if (path.extname(chunk.path) === '.css') {
        server.livereload(chunk.path);
      }
      callback();
      scheduler.task('compile styles').unlock();
    }));
});

gulp.task('compile javascripts', function () {
  scheduler.task('compile javascripts').lock();

  var sourcemaps = require('gulp-sourcemaps');
  var filter = require('gulp-filter');
  var filters = {
    output: filter('**/*.{js,map}')
  };

  var jshint = require('lazypipe')()
    .pipe(require('gulp-jshint'))
    .pipe(require('gulp-jshint').reporter, 'jshint-stylish');

  var traceur = require('lazypipe')()
    .pipe(sourcemaps.init)
    .pipe(require('gulp-traceur'), {
      modules: 'instantiate',
      moduleName: true
    })
    .pipe(sourcemaps.write);

  return require('event-stream').merge(
    gulp.src('./src/**/*.js', {base: path.resolve('./src')})
      .pipe(require('gulp-plumber')({errorHandler: error('compile javascripts')}))
      .pipe(require('gulp-changed')(settings.paths.build, {extension: '.js'}))
      .pipe(require('gulp-preprocess')({context: settings.flat}))
      .pipe(require('gulp-if')(settings.workspace.environment === 'development', jshint()))
      .pipe(require('gulp-if')(settings.workspace.environment === 'development', traceur())),
    gulp.src(['./src/*/**/*.html', '!./src/*.html'], {
      read: false,
      base: path.resolve('./src')
    })
  )
    .pipe(require('gulp-plumber')({errorHandler: error('compile javascripts')}))
    .pipe(require('gulp-revsolve')({
      regex: /(?:templateUrl:\s*?["'](.*?)['"])/g,
      filterExtensions: ['js'],
      debug: 1,
      base: path.resolve('./src'),
      patterns: ['src'],
      addDestPrefix: settings.workspace['environment'] === 'development' ? '/' + settings.app.name : '/'
    }))
    .pipe(filters.output)
    .pipe(gulp.dest(settings.paths.build))
    .pipe(require('through2').obj(function (chunk, enc, callback) {
      scheduler.task('compile javascripts').unlock();
      if (path.extname(chunk.path) === '.js') {
        server.livereload(chunk.path);
      }
      callback();
    }));
});

var bundles = [];

gulp.task('bundle javascripts', function () {
  var builder = require('systemjs-builder');
  var q = require('q');
  var promises = [];
  var promise;
  var input;
  var output;
  var deferred = [];
  var overrides = {
    config: {
      paths: {
        '*': '*.js',
        'github:*': '../jspm/github/*.js',
        'npm:*': '../jspm/npm/*.js'
      },
      baseURL: settings.paths.rel
    }
  };

  if (!settings.versions) {
    overrides.config.versions = {};
  }

  var bundle = function (deferred, input, output) {
    builder.buildSFX(input, output, overrides)
      .then(function () {
        deferred.resolve();
      })
      .catch(function (err) {
        require('gulp-util').log(err);
        deferred.resolve();
      });
  };

  var next = function (promise, deferred, input, output) {
    promise.then(function () {
      bundle(deferred, input, output);
    });
  };

  for (var i = 0; i < settings.app.modules.length; i++) {
    deferred[i] = q.defer();
    promises.push(deferred[i].promise);
  }

  builder.loadConfig('config.js').then(function () {
    for (var i = 0; i < settings.app.modules.length; i++) {
      input = settings.app.modules[i] + '/app';
      output = path.join(settings.paths.build, settings.app.modules[i], 'build.js');
      if (!fs.existsSync(path.join(settings.paths.build, input + '.js'))) {
        deferred[i].resolve();
        continue;
      }
      if (promise) {
        next(promise, deferred[i], input, output);
      } else {
        bundle(deferred[i], input, output);
      }
      promise = deferred[i].promise;
    }
  });
  return q.allSettled(promises);
});

gulp.task('compile angular templates', function () {
  scheduler.task('compile angular templates').lock();

  var filter = require('gulp-filter');
  var filters = {
    output: filter('**/*.html')
  };

  return require('event-stream').merge(
    require('multipipe')(
      gulp.src('./src/*/**/*.html', {base: path.resolve('./src')}),
      require('gulp-changed')(settings.paths.build, {extension: '.html'})
    ),
    gulp.src(['./src/*/**/*.*', '!./src/*/**/*.html'], {
      read: false,
      base: path.resolve('./src')
    })
  )
    .pipe(require('gulp-plumber')({errorHandler: error('compile angular templates')}))
    .pipe(require('gulp-revsolve')({
      regex: /(?:url\(["']?(.*?)['"]?\)|src=["'](.*?)['"]|src=([^\s>]+)(?:>|\s)|href=["']([^'"]+?)['"]|href=([^\s>]+)(?:>|\s))/g,
      filterExtensions: ['html'],
      debug: 1,
      base: path.resolve('./src'),
      patterns: ['src'],
      addDestPrefix: settings.workspace['environment'] === 'development' ? '/' + settings.app.name : '/'
    }))
    .pipe(filters.output)
    .pipe(require('gulp-preprocess')({context: settings.flat}))
    .pipe(gulp.dest(settings.paths.build))
    .pipe(require('through2').obj(function (chunk, enc, callback) {
      scheduler.task('compile angular templates').unlock();
      if (path.extname(chunk.path) === '.html') {
        server.livereload(chunk.path);
      }
      callback();
    }));
});

gulp.task('compile main html files', function () {
  scheduler.task('compile main html files').lock();

  var jspm = path.resolve('./jspm');
  var base = path.resolve('./');
  var inject = require('gulp-inject');
  var filter = require('gulp-filter');
  var filters = {
    output: filter('**/*.html')
  };

  var passthrough = require('event-stream').merge(
    require('multipipe')(
      gulp.src('./src/*.html', {base: path.resolve('./src')}),
      require('gulp-changed')(settings.paths.build, {extension: '.html'}),
      require('gulp-preprocess')({context: settings.flat})
    ),
    gulp.src(path.join(settings.paths.build, '**/*.{js,css}'), {
      read: false,
      base: settings.paths.build
    }),
    gulp.src(path.join(jspm, '**/*.{js,css}'), {
      read: false,
      base: jspm
    }),
    gulp.src(path.join(base, '*.{js,css}'), {
      read: false,
      base: base
    })
  )
    .pipe(require('gulp-plumber')({errorHandler: error('compile main html files')}))
    .pipe(require('gulp-revsolve')({
      regex: /(?:url\(["']?(.*?)['"]?\)|src=["'](.*?)['"]|src=([^\s>]+)(?:>|\s)|href=["']([^'"]+?)['"]|href=([^\s>]+)(?:>|\s))/g,
      filterExtensions: ['html'],
      debug: 1,
      base: settings.paths.build,
      patterns: [settings.paths.rel],
      addDestPrefix: settings.workspace['environment'] === 'development' ? '/' + settings.app.name : '/'
    }))

    .pipe(filters.output)
    .pipe(inject(gulp.src(require('main-bower-files')(), {
      read: false,
      cwd: '.'
    }), {
      name: 'bower',
      addRootSlash: true,
      relative: false,
      addPrefix: settings.workspace['environment'] === 'development' ? settings.app.name : null
    }));

  for (var i = 0; i < settings.app.modules.length; i++) {
    passthrough = passthrough.pipe(inject(
      gulp.src(path.join(settings.paths.build, settings.app.modules[i] + '/**/*.css'), {
        read: false,
        cwd: settings.paths.build
      }), {
        addRootSlash: true,
        relative: false,
        name: settings.app.modules[i],
        addPrefix: settings.workspace['environment'] === 'development' ? settings.app.name : null
      }
    ));
  }

  return passthrough.pipe(gulp.dest(settings.paths.build))
    .pipe(require('through2').obj(function (chunk, enc, callback) {
      scheduler.task('compile main html files').unlock();
      if (path.extname(chunk.path) === '.html') {
        server.livereload(chunk.path);
      }
      callback();
    }));
});

gulp.task('copy images and fonts into dist folder', function () {
  return gulp.src(['./src/*/**/*.html', './src/*/**/*.{bmp,jpg,jpeg,gif,png,svg,webp,tif}', './src/*/**/*.{otf,eot,svg,ttf,woff}'], {
    base: 'src/',
    dot: true
  })
    .pipe(gulp.dest(settings.paths.dist));
});

gulp.task('copy root module files into dist folder', function () {
  return gulp.src(['./src/*/*.*', '!./src/*/*.{js,css,less,html}'], {
    base: 'src/',
    dot: true
  })
    .pipe(gulp.dest(settings.paths.dist));
});

gulp.task('flatten fonts into dist folder', function () {
  return gulp.src(['./bower/**/*.{otf,eot,svg,ttf,woff}'])
    .pipe(require('gulp-flatten')())
    .pipe(gulp.dest(path.join(settings.paths.dist, 'fonts')));
});

gulp.task('concatenate assets', function () {
  return gulp.src(path.join(settings.paths.build, '*.html'))
    .pipe(require('gulp-usemin')({
      css: ['concat'],
      js: ['concat'],
      options: {
        assetsDir: path.resolve(settings.paths.build)
      }
    }))
    .pipe(gulp.dest(settings.paths.dist));
});

gulp.task('revision assets', function () {
  return require('event-stream').merge(
    gulp
      .src(path.join(settings.paths.dist, '*.html'), {base: settings.paths.dist}),
    gulp
      .src([
        path.join(settings.paths.dist, '**/*.*'),
        path.join('!' + settings.paths.dist, '*.html'),
        path.join('!' + settings.paths.dist, '**/*.{txt,otf,eot,svg,ttf,woff}')
      ], {base: settings.paths.dist})
      .pipe(require('vinyl-paths')(function (files, cb) {
        return require('del')(files, {force: true}, cb);
      }))
      .pipe(require('gulp-rev')())
  )
    .pipe(require('gulp-revsolve')({
      regex: /(?:url\(["']?(.*?)['"]?\)|src=["'](.*?)['"]|src=([^\s>]+)(?:>|\s)|href=["']([^'"]+?)['"]|href=([^\s>]+)(?:>|\s)|templateUrl:\s*?["'](.*?)['"])/g, // jshint ignore:line
      debug: 1,
      cwd: settings.paths.dist,
      base: settings.paths.dist,
      patterns: [path.join(settings.paths.dist, '*/')],
      addDestPrefix: settings.workspace['environment'] === 'development' ? '/' + settings.app.name : '/'
    }))
    .pipe(gulp.dest(settings.paths.dist));
});

gulp.task('minify assets', function () {
  var filter = require('gulp-filter');
  var filters = {
    html: filter('**/*.html'),
    css: filter('**/*.css'),
    js: filter('**/*.js')
  };
  return gulp.src([settings.paths.dist + '/**/*.{html,css,js}'], {base: settings.paths.dist})
    .pipe(filters.html)
    .pipe(require('gulp-minify-html')({empty: true}))
    .pipe(filters.html.restore())
    .pipe(filters.css)
    .pipe(require('gulp-minify-css')({keepSpecialComments: 0}))
    .pipe(filters.css.restore())
    .pipe(filters.js)
    .pipe(require('gulp-ng-annotate')())
    .pipe(require('gulp-uglify')({
      compress: {
        unused: false
      }
    }))
    .pipe(filters.js.restore())
    .pipe(gulp.dest(settings.paths.dist));
});

gulp.task('cdnify assets', function () {
  return gulp.src(path.join(settings.paths.dist, '**/*.{html,js,css}'), {base: settings.paths.dist})
    .pipe(require('gulp-cdnizer')({
      defaultCDNBase: settings.workspace['hosts']['public']['url'].replace(/.*?:\/\//g, '//'),
      defaultCDN: '${ defaultCDNBase }/static/' + settings.app.name + '/${ filepathRel }',
      allowRev: false,
      allowMin: false,
      matchers: [
        /(templateUrl:\s*?["'])(.*?)(['"])/gi
      ],
      files: [
        '/**/*.*'
      ]
    }))
    .pipe(gulp.dest(settings.paths.dist));
});

gulp.task('gzip assets', function () {
  return gulp.src(path.join(settings.paths.dist, '**/*.{html,js,css}'), {base: settings.paths.dist})
    .pipe(require('gulp-gzip')({append: true, gzipOptions: {level: 9}}))
    .pipe(gulp.dest(settings.paths.dist));
});

gulp.task('start development server', function () {
  //noinspection JSUnresolvedVariable
  server(__dirname, settings);
});

gulp.task('watch for file changes', function () {
  var
    chokidar = require('chokidar'),
    watcher = chokidar.watch(['./src'], {
      ignoreInitial: true,
      persistent: true,
      usePolling: true,
      interval: 700,
      binaryInterval: 1400
    });

  watcher.on('all', function (event, fp) {
    var ext, dirname, relpath;

    fp = path.resolve(fp);
    fp = path.relative('.', fp);
    ext = path.extname(fp).substr(1);
    dirname = path.dirname(path.relative('./src', fp));
    relpath = path.join(path.basename(settings.paths.build), path.relative('./src', fp));

    if (ext === 'less') {
      relpath = relpath.replace(/\..+$/, '.css');
    } else if (ext === 'coffee') {
      relpath = relpath.replace(/\..+$/, '.js');
    }

    if (_.contains(['less', 'css'], ext)) {
      if (event === 'add') {
        scheduler.dispatch({sync: ['compile styles', 'compile main html files']});
      } else if (event === 'change') {
        scheduler.dispatch('compile styles');
      }
    }

    if (_.contains(['js', 'coffee'], ext)) {
      if (event === 'add') {
        scheduler.dispatch({sync: ['compile javascripts', 'compile main html files']});
      } else if (event === 'change') {
        scheduler.dispatch('compile javascripts');
      }
    }

    if (dirname !== '.' && _.contains(['html'], ext)) {
      if (event === 'add' || event === 'change') {
        scheduler.dispatch('compile angular templates');
      }
    }

    if (dirname === '.' && _.contains(['html'], ext)) {
      if (event === 'add' || event === 'change') {
        scheduler.dispatch('compile main html files');
      }
    }

    if (event === 'unlink' || event === 'unlinkDir') {
      fs.exists(relpath, function (exists) {
        if (exists) {
          require('del')(relpath, {force: true}, function () {
            if (event === 'unlink' && _.contains(['less', 'coffee', 'css', 'js'], ext)) {
              scheduler.dispatch('compile main html files');
            }
          });
        }
      });
      fs.exists(relpath + '.map', function (exists) {
        if (exists) {
          require('del')(relpath + '.map', {force: true});
        }
      });
    }
  });
});

gulp.task('watch for build changes', function () {
  var
    chokidar = require('chokidar'),
    watcher = chokidar.watch(settings.paths.build, {
      ignoreInitial: true,
      persistent: true,
      usePolling: true,
      interval: 700,
      binaryInterval: 1400
    });

  watcher.on('all', function (event, fp) {
    var ext;
    fp = path.resolve(fp);
    fp = path.relative('.', fp);
    ext = path.extname(fp).substr(1);
    if (_.contains(['js', 'css', 'html'], ext)) {
      server.livereload(fp);
    }
  });
});

gulp.task('build-production', gulpsync.sync([
  'load production settings',
  'clean production folders',
  [
    'compile styles',
    'compile javascripts',
    'compile angular templates',
    'copy images and fonts into dist folder',
    'copy root module files into dist folder',
    'flatten fonts into dist folder'
  ],
  'compile main html files',
  'concatenate assets',
  'revision assets',
  'minify assets',
  'cdnify assets',
  'gzip assets'
], 'sync build-production'));

gulp.task('build-staging', gulpsync.sync([
  'load staging settings',
  'clean production folders',
  [
    'compile styles',
    'compile javascripts',
    'compile angular templates',
    'copy images and fonts into dist folder',
    'copy root module files into dist folder',
    'flatten fonts into dist folder'
  ],
  'bundle javascripts',
  'compile main html files',
  'concatenate assets',
  'revision assets',
  'minify assets',
  'cdnify assets',
  'gzip assets'
], 'sync build-staging'));

gulp.task('build', gulpsync.sync([
  'load development settings',
  'clean development folders',
  [
    'compile styles',
    'compile javascripts',
    'compile angular templates'
  ],
  'compile main html files'
], 'sync build'));

gulp.task('develop', gulpsync.sync([
  'load development settings',
  'start development server',
  'watch for file changes'
], 'sync livereload'));

gulp.task('runserver', gulpsync.sync([
  'load development settings',
  'start development server',
  'watch for build changes'
], 'sync runserver'));
