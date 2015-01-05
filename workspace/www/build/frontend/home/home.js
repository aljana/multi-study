System.register("frontend/home/home", ["./controllers/index"], function($__export) {
  "use strict";
  var __moduleName = "frontend/home/home";
  function require(path) {
    return $traceurRuntime.require("frontend/home/home", path);
  }
  var IndexController;
  return {
    setters: [function(m) {
      IndexController = m.default;
    }],
    execute: function() {
      angular.module('app.home', []).config(['$stateProvider', (function($stateProvider) {
        $stateProvider.state('home', {
          url: '/',
          templateUrl: '/www/frontend/home/templates/home.html',
          controller: IndexController,
          controllerAs: 'IndexController'
        });
      })]);
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbnRlbmQvaG9tZS9ob21lLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsiZnJvbnRlbmQvaG9tZS9ob21lLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJbmRleENvbnRyb2xsZXIgZnJvbSAnLi9jb250cm9sbGVycy9pbmRleCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAuaG9tZScsIFtdKVxuICAuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAoJHN0YXRlUHJvdmlkZXIpID0+IHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgIHVybDogJy8nLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3RlbXBsYXRlcy9ob21lLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogSW5kZXhDb250cm9sbGVyLFxuICAgICAgY29udHJvbGxlckFzOiAnSW5kZXhDb250cm9sbGVyJ1xuICAgIH0pO1xuICB9XSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=