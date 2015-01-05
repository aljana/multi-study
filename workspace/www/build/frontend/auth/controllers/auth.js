System.register("frontend/auth/controllers/auth", [], function($__export) {
  "use strict";
  var __moduleName = "frontend/auth/controllers/auth";
  function require(path) {
    return $traceurRuntime.require("frontend/auth/controllers/auth", path);
  }
  var AuthController;
  return {
    setters: [],
    execute: function() {
      AuthController = (function() {
        var AuthController = function AuthController($scope, userService) {
          this.$scope = $scope;
          this.userService = userService;
          this.email = null;
          this.password = null;
          this.rememberMe = false;
        };
        return ($traceurRuntime.createClass)(AuthController, {login: function() {
            var promise;
            if (!this.$scope.form.$valid) {
              return;
            }
            promise = this.userService.login(this.email, this.password, this.rememberMe);
            promise.then((function(data) {
              console.log(data);
            }));
          }}, {});
      }());
      AuthController.$inject = ['$scope', 'UserService'];
      $__export('default', AuthController);
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbnRlbmQvYXV0aC9jb250cm9sbGVycy9hdXRoLmpzIiwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXMiOlsiZnJvbnRlbmQvYXV0aC9jb250cm9sbGVycy9hdXRoLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEF1dGhDb250cm9sbGVyIHtcbiAgY29uc3RydWN0b3IoJHNjb3BlLCB1c2VyU2VydmljZSkge1xuICAgIHRoaXMuJHNjb3BlID0gJHNjb3BlO1xuICAgIHRoaXMudXNlclNlcnZpY2UgPSB1c2VyU2VydmljZTtcbiAgICB0aGlzLmVtYWlsID0gbnVsbDtcbiAgICB0aGlzLnBhc3N3b3JkID0gbnVsbDtcbiAgICB0aGlzLnJlbWVtYmVyTWUgPSBmYWxzZTtcbiAgfVxuXG4gIGxvZ2luKCkge1xuICAgIHZhciBwcm9taXNlO1xuICAgIGlmICghdGhpcy4kc2NvcGUuZm9ybS4kdmFsaWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwcm9taXNlID0gdGhpcy51c2VyU2VydmljZS5sb2dpbih0aGlzLmVtYWlsLCB0aGlzLnBhc3N3b3JkLCB0aGlzLnJlbWVtYmVyTWUpO1xuXG4gICAgcHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICB9KTtcbiAgfVxufVxuXG5BdXRoQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnVXNlclNlcnZpY2UnXTtcblxuZXhwb3J0IGRlZmF1bHQgQXV0aENvbnRyb2xsZXI7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=