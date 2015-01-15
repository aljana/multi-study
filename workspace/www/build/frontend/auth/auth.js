System.register(["./controllers/auth"], function($__export) {
  "use strict";
  var AuthController;
  return {
    setters: [function(m) {
      AuthController = m.default;
    }],
    execute: function() {
      angular.module('app.auth', []).config(['$stateProvider', (function($stateProvider) {
        $stateProvider.state('login', {
          url: '/login/',
          templateUrl: '/www/frontend/auth/templates/login.html',
          controller: AuthController,
          controllerAs: 'AuthController',
          data: {rule: function(user) {
              if (user.credentials) {
                return 'home';
              }
            }}
        }).state('register', {
          url: '/register/',
          templateUrl: '/www/frontend/auth/templates/register.html',
          controller: AuthController,
          controllerAs: 'AuthController',
          data: {rule: function(user) {
              if (user.credentials) {
                return 'home';
              }
            }}
        });
      })]);
    }
  };
});
//# sourceURL=frontend/auth/auth.js
//# sourceMappingURL=../../frontend/auth/auth.js.map