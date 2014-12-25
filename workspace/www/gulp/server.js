var
  path = require('path'),
  tinylr,
  dirname;

function livereload(fp) {
  if (!tinylr) {
    return;
  }
  tinylr.changed({
    body: {
      files: [path.relative(dirname, fp)]
    }
  });
}

module.exports = function (dn, settings) {
  var express = require('express');
  var server = express();

  dirname = dn;

  server.use(require('connect-livereload')({port: 35729}));
  server.use('/' + settings.app.name, express.static(settings.paths.build));
  server.use('/' + settings.app.name, express.static(path.resolve('./src')));
  server.use('/' + settings.app.name, express.static(path.resolve('./')));

  var add = function (m) {
    var f = path.resolve(path.join(settings.paths.build, m + '.html'));
    server.get('/' + settings.app.name + '/' + m + '/jspm.js', function (req, res) {
      res.sendFile(path.resolve('./jspm.js'));
    });

    server.get('/' + settings.app.name + '/' + m + '/*', function (req, res) {
      if (path.extname(req.path).length === 0) {
        res.sendFile(f);
      } else {
        res.status(404).send();
      }
    });
  };

  for (var i = 0; i < settings.app.modules.length; i++) {
    add(settings.app.modules[i]);
  }

  server.listen(settings.app['port'] || 8080);

  tinylr = require('tiny-lr')();
  tinylr.listen(35729);
};

module.exports.livereload = livereload;
