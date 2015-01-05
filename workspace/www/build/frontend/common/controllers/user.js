System.register("frontend/common/controllers/user", [], function($__export) {
  "use strict";
  var __moduleName = "frontend/common/controllers/user";
  function require(path) {
    return $traceurRuntime.require("frontend/common/controllers/user", path);
  }
  var UserController;
  return {
    setters: [],
    execute: function() {
      UserController = (function() {
        var UserController = function UserController(userService) {
          this.userService = userService;
        };
        return ($traceurRuntime.createClass)(UserController, {isAuthenticated: function() {
            return this.userService.isAuthenticated();
          }}, {});
      }());
      UserController.$inject = ['UserService'];
      $__export('default', UserController);
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbnRlbmQvY29tbW9uL2NvbnRyb2xsZXJzL3VzZXIuanMiLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmcm9udGVuZC9jb21tb24vY29udHJvbGxlcnMvdXNlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBVc2VyQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKHVzZXJTZXJ2aWNlKSB7XG4gICAgdGhpcy51c2VyU2VydmljZSA9IHVzZXJTZXJ2aWNlO1xuICB9XG5cbiAgaXNBdXRoZW50aWNhdGVkKCkge1xuICAgIHJldHVybiB0aGlzLnVzZXJTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpO1xuICB9XG59XG5cblVzZXJDb250cm9sbGVyLiRpbmplY3QgPSBbJ1VzZXJTZXJ2aWNlJ107XG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJDb250cm9sbGVyO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9