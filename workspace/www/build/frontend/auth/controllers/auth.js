System.register([], function($__export) {
  "use strict";
  var AuthController;
  return {
    setters: [],
    execute: function() {
      AuthController = (function() {
        var AuthController = function AuthController($scope, $state, loggerService, userService) {
          this.$scope = $scope;
          this.$state = $state;
          this.loggerService = loggerService;
          this.userService = userService;
          this.email = null;
          this.password = null;
          this.passwordr = null;
          this.rememberMe = false;
          this.firstName = null;
          this.lastName = null;
        };
        return ($traceurRuntime.createClass)(AuthController, {
          login: function() {
            var $__0 = this;
            var promise;
            if (!this.$scope.form.$valid) {
              return;
            }
            promise = this.userService.login(this.email, this.password, this.rememberMe);
            promise.then((function() {
              $__0.loggerService.log('success', 'Login successful', 'Success');
            }), (function() {
              $__0.loggerService.log('error', 'Invalid login data', 'Error');
            }));
          },
          register: function() {
            var $__0 = this;
            var promise;
            if (!this.$scope.form.$valid || this.password !== this.passwordr) {
              return;
            }
            promise = this.userService.register(this.email, this.password, this.firstName, this.lastName);
            promise.then((function() {
              $__0.loggerService.log('success', 'Registration successful', 'Success');
              $__0.$state.go('login', {reload: true});
            }), (function() {
              $__0.loggerService.log('error', 'Invalid data', 'Error');
            }));
          }
        }, {});
      }());
      AuthController.$inject = ['$scope', '$state', 'LoggerService', 'UserService'];
      $__export('default', AuthController);
    }
  };
});
//# sourceURL=frontend/auth/controllers/auth.js
//# sourceMappingURL=../../../frontend/auth/controllers/auth.js.map