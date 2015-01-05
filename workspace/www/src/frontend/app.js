// Import app modules
import './home/home';
import './auth/auth';
import './common/directives';
import './common/services';


// Register main module
angular.module('app', [
  'ngResource',
  'ui.router',
  'app.directives',
  'app.services',
  'app.home',
  'app.auth'
])
  .config([
    '$provide',
    '$resourceProvider',
    '$httpProvider',
    '$locationProvider',
    'app.settings',
    ($provide, $resourceProvider, $httpProvider, $locationProvider, settings) => {
      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');

      $resourceProvider.defaults.stripTrailingSlashes = false;

      $provide.decorator('$resource', ($delegate) => {
        var url = settings.apiUrl, args;

        if (url.substr(-1) === '/') {
          url = url.substr(0, url.length - 1);
        }

        return (...args) => {
          if (args[0].substr(-1) === '/') {
            args[0] = url + '/' + args[0];
          } else {
            args[0] = url + '/' + args[0] + '/';
          }
          if (args[2]) {
            for (var method in args[2]) {
              if (args[2].hasOwnProperty(method) && args[2][method].url) {
                if (args[2][method].url.substr(-1) === '/') {
                  args[2][method].url = url + '/' + args[2][method].url;
                } else {
                  args[2][method].url = url + '/' + args[2][method].url + '/';
                }
              }
            }
          }
          return $delegate.apply(this, args);
        };
      });

      $httpProvider.defaults.useXDomain = true;
      $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
      $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])
  .constant('app.settings', {
    apiUrl: '/* @echo $workspace.hosts.api.url */',
    publicUrl: '/* @echo $workspace.hosts.public.url */'
  });


// Bootstrap app
angular.element(document).ready(() => {
  if (window.location.hash === '#_=_') {
    window.location.hash = '#!';
  }
  angular.bootstrap(document, ['app']);
});
