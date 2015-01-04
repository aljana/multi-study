var
  traceur = require('traceur'),
  settings = { workspace: {}, app: {} };

traceur.require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});

settings.app = require('./package.json').app || {};
if (process.env.NODE_ENV === 'production') {
  settings.workspace = require('../_settings/production.json');
} else if (process.env.NODE_ENV === 'staging') {
  settings.workspace = require('../_settings/staging.json');
} else {
  settings.workspace = require('../_settings/development.json');
}

require('./src/app')(settings);
