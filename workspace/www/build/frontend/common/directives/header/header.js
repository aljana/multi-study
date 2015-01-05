System.register("frontend/common/directives/header/header", ["../../controllers/user"], function($__export) {
  "use strict";
  var __moduleName = "frontend/common/directives/header/header";
  function require(path) {
    return $traceurRuntime.require("frontend/common/directives/header/header", path);
  }
  var UserController;
  return {
    setters: [function(m) {
      UserController = m.default;
    }],
    execute: function() {
      $__export('default', (function() {
        return {
          restrict: 'AE',
          scope: {},
          controller: UserController,
          controllerAs: 'UserController',
          templateUrl: '/www/frontend/common/directives/header/header.html'
        };
      }));
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbnRlbmQvY29tbW9uL2RpcmVjdGl2ZXMvaGVhZGVyL2hlYWRlci5qcyIsIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzIjpbImZyb250ZW5kL2NvbW1vbi9kaXJlY3RpdmVzL2hlYWRlci9oZWFkZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFVzZXJDb250cm9sbGVyIGZyb20gJy4uLy4uL2NvbnRyb2xsZXJzL3VzZXInO1xuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgc2NvcGU6IHt9LFxuICAgIGNvbnRyb2xsZXI6IFVzZXJDb250cm9sbGVyLFxuICAgIGNvbnRyb2xsZXJBczogJ1VzZXJDb250cm9sbGVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vaGVhZGVyLmh0bWwnXG4gIH07XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9