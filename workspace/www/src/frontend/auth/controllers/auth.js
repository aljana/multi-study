class AuthController {
  constructor($scope, userService) {
    this.$scope = $scope;
    this.userService = userService;
    this.email = null;
    this.password = null;
    this.rememberMe = false;
  }

  login() {
    var promise;
    if (!this.$scope.form.$valid) {
      return;
    }

    promise = this.userService.login(this.email, this.password, this.rememberMe);

    promise.then((data) => {
      console.log(data);
    });
  }
}

AuthController.$inject = ['$scope', 'UserService'];

export default AuthController;
