// Import app modules
import './quizzes/quizzes';
import './auth/auth';
import './common/directives';
import './common/services';

// Register main module
angular.module('app', [
  'ngResource',
  'ngAnimate',
  'ngCookies',
  'angular-loading-bar',
  'angular-data.DSCacheFactory',
  'toastr',
  'ui.router',
  'app.directives',
  'app.services',
  'app.quizzes',
  'app.auth'
])
  .config([
    '$provide',
    '$resourceProvider',
    '$httpProvider',
    '$locationProvider',
    'cfpLoadingBarProvider',
    'settings',
    ($provide, $resourceProvider, $httpProvider, $locationProvider, cfpLoadingBarProvider, settings) => {
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

      cfpLoadingBarProvider.includeSpinner = false;

      $httpProvider.defaults.useXDomain = true;
      $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
      $httpProvider.defaults.xsrfCookieName = 'csrftoken';
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])
  .constant('settings', {
    apiUrl: '/* @echo $workspace.hosts.api.url */',
    socketUrl: '/* @echo $workspace.hosts.socket.url */',
    publicUrl: '/* @echo $workspace.hosts.public.url */'
  })
  .run(['$rootScope', '$state', 'LoggerService', 'UserService', ($rootScope, $state, loggerService, userService) => {
    $rootScope.$watch(() => {
      return userService.authenticated;
    }, (authenticated) => {
      if (authenticated && $state.is('login')) {
         $state.go('quizzes', {}, {notify: true, reload: true, inherit: true});
      }
    });

    $rootScope.$on('$stateChangeStart', (event, toState) => {
      if (!toState.data || !angular.isFunction(toState.data.rule)) {
        return;
      }
      var result = toState.data.rule(userService);
      if (result) {
        event.preventDefault();
        $state.go(result.to || result, result.params || {}, {notify: false});
      }
    });
    $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
      loggerService.log('error', error);
    });
  }]);


// Bootstrap app
angular.element(document).ready(() => {
  if (window.location.hash === '#_=_') {
    window.location.hash = '#!';
  }
  angular.bootstrap(document, ['app']);
});
