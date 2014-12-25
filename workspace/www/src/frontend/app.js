// Import app modules
import './home/home';
import './common/services';


// Register main module
angular.module('app', [
  'ngResource',
  'ui.router',
  'app.services',
  'app.home'
])
  .config(['$locationProvider', ($locationProvider) => {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  }]);

// Bootstrap app
angular.element(document).ready(() => {
  if (window.location.hash === '#_=_') {
    window.location.hash = '#!';
  }
  angular.bootstrap(document, ['app']);
});
