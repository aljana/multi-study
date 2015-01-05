System.register("frontend/auth/auth", ["./controllers/auth"], function($__export) {
  "use strict";
  var __moduleName = "frontend/auth/auth";
  function require(path) {
    return $traceurRuntime.require("frontend/auth/auth", path);
  }
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
          controllerAs: 'AuthController'
        });
      })]);
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbnRlbmQvYXV0aC9hdXRoLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsiZnJvbnRlbmQvYXV0aC9hdXRoLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBdXRoQ29udHJvbGxlciBmcm9tICcuL2NvbnRyb2xsZXJzL2F1dGgnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXBwLmF1dGgnLCBbXSlcbiAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgKCRzdGF0ZVByb3ZpZGVyKSA9PiB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgdXJsOiAnL2xvZ2luLycsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vdGVtcGxhdGVzL2xvZ2luLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogQXV0aENvbnRyb2xsZXIsXG4gICAgICBjb250cm9sbGVyQXM6ICdBdXRoQ29udHJvbGxlcidcbiAgICB9KTtcbiAgfV0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9