class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  isAuthenticated() {
    return this.userService.isAuthenticated();
  }
}

UserController.$inject = ['UserService'];

export default UserController;
