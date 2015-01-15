System.register(["./quizzes/quizzes", "./auth/auth", "./common/directives", "./common/services"], function($__export) {
  "use strict";
  return {
    setters: [function(m) {}, function(m) {}, function(m) {}, function(m) {}],
    execute: function() {
      var $__0 = this;
      angular.module('app', ['ngResource', 'ngAnimate', 'ngCookies', 'angular-loading-bar', 'angular-data.DSCacheFactory', 'toastr', 'ui.router', 'app.directives', 'app.services', 'app.quizzes', 'app.auth']).config(['$provide', '$resourceProvider', '$httpProvider', '$locationProvider', 'cfpLoadingBarProvider', 'settings', (function($provide, $resourceProvider, $httpProvider, $locationProvider, cfpLoadingBarProvider, settings) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        $resourceProvider.defaults.stripTrailingSlashes = false;
        $provide.decorator('$resource', (function($delegate) {
          var url = settings.apiUrl,
              args;
          if (url.substr(-1) === '/') {
            url = url.substr(0, url.length - 1);
          }
          return (function() {
            for (var args = [],
                $__1 = 0; $__1 < arguments.length; $__1++)
              args[$__1] = arguments[$__1];
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
            return $delegate.apply($__0, args);
          });
        }));
        cfpLoadingBarProvider.includeSpinner = false;
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
      })]).constant('settings', {
        apiUrl: 'http://dev.multi-study.local/api',
        socketUrl: 'http://ws.multi-study.local',
        publicUrl: 'http://public.multi-study.local'
      }).run(['$rootScope', '$state', 'LoggerService', 'UserService', (function($rootScope, $state, loggerService, userService) {
        $rootScope.$watch((function() {
          return userService.authenticated;
        }), (function(authenticated) {
          if (authenticated && $state.is('login')) {
            $state.go('quizzes', {}, {
              notify: true,
              reload: true,
              inherit: true
            });
          }
        }));
        $rootScope.$on('$stateChangeStart', (function(event, toState) {
          if (!toState.data || !angular.isFunction(toState.data.rule)) {
            return;
          }
          var result = toState.data.rule(userService);
          if (result) {
            event.preventDefault();
            $state.go(result.to || result, result.params || {}, {notify: false});
          }
        }));
        $rootScope.$on('$stateChangeError', (function(event, toState, toParams, fromState, fromParams, error) {
          loggerService.log('error', error);
        }));
      })]);
      angular.element(document).ready((function() {
        if (window.location.hash === '#_=_') {
          window.location.hash = '#!';
        }
        angular.bootstrap(document, ['app']);
      }));
    }
  };
});
//# sourceURL=frontend/app.js
//# sourceMappingURL=../frontend/app.js.map