var
  _ = require('lodash'),
  fs = require('fs'),
  path = require('path');

// Merge two objects
function merge(obj1, obj2) {
  _.forOwn(obj1, function (value, key) {
    if (_.isObject(obj2[key])) {
      merge(obj1[key], obj2[key]);
    } else if (obj2[key]) {
      obj1[key] = obj2[key];
    }
  });
  _.forOwn(obj2, function (value, key) {
    if (!obj1[key]) {
      obj1[key] = obj2[key];
    }
  });
  return obj1;
}

function flatten(flat, settings, key) {
  if (!flat) {
    flat = {};
  }
  _.forOwn(settings, function (v, k) {
    if (_.isArray(v)) {
      return;
    }
    if (_.isObject(v)) {
      if (!key) {
        flatten(flat, v, k);
      } else {
        flatten(flat, v, key + '.' + k);
      }
    } else if (key) {
      flat[key + '.' + k] = v;
    } else {
      flat[k] = v;
    }
  });
  return flat;
}

module.exports = function (env, bp, appstg, dir) {
  var settings = {
    workspace: {},
    flat: {
      '$workspace': {},
      '$app': {}
    },
    app: {},
    paths: {},
    versions: false
  };

  // Load workspace settings
  if (env === 'production') {
    settings.workspace = require(path.resolve('../_settings/production.json'));
    settings.flat['$workspace'] = require(path.resolve('../_settings/production.flat.json'));
  } else if (env === 'staging') {
    settings.workspace = require(path.resolve('../_settings/staging.json'));
    settings.flat['$workspace'] = require(path.resolve('../_settings/staging.flat.json'));
  } else if (env === 'development') {
    settings.workspace = require(path.resolve('../_settings/development.json'));
    settings.flat['$workspace'] = require(path.resolve('../_settings/development.flat.json'));
  }

  // Load local settings
  settings.app = appstg || {};

  if (env === 'staging' || env === 'production') {
    var contents = fs.readFileSync(path.resolve('./config.js'), {encoding: 'utf8'});
    var regex = /["']?versions["']?:\s*\{/;
    settings.versions = regex.test(contents);
  }

  settings.app.name = path.basename(process.cwd());
  settings.app.modules = require('globby').sync(['./src/*', '!./src/*.*']);
  for (var i = 0; i < settings.app.modules.length; i++) {
    settings.app.modules[i] = path.basename(settings.app.modules[i]);
  }

  settings.paths.dist = path.resolve(path.resolve(dir), path.join('public/static', settings.app.name));
  settings.paths.build = path.resolve(bp);
  settings.paths.rel = path.basename(settings.paths.build);

  settings.flat['$app'] = flatten(settings.flat['$app'], settings.app);

  return settings;
};
