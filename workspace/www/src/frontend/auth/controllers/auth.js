class AuthController {
  constructor($scope, $state, loggerService, userService) {
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
  }

  login() {
    var promise;
    if (!this.$scope.form.$valid) {
      return;
    }

    // Login
    promise = this.userService.login(this.email, this.password, this.rememberMe);
    promise.then(() => {
      this.loggerService.log('success', 'Login successful', 'Success');

    }, () => {
      this.loggerService.log('error', 'Invalid login data', 'Error');
    });
  }

  register() {
    var promise;
    if (!this.$scope.form.$valid || this.password !== this.passwordr) {
      return;
    }
    promise = this.userService.register(this.email, this.password, this.firstName, this.lastName);
    promise.then(() => {
      this.loggerService.log('success', 'Registration successful', 'Success');
      this.$state.go('login', {reload: true});
    }, () => {
      this.loggerService.log('error', 'Invalid data', 'Error');
    });
  }
}

AuthController.$inject = ['$scope', '$state', 'LoggerService', 'UserService'];

export default AuthController;
