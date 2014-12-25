var traceur = require('traceur');
traceur.require.makeDefault(function(filename) {
  return filename.indexOf('node_modules') === -1;
});
require('./src/app');
