class UserService {
  constructor($resource) {
    this.$resource = $resource('users/:userId', {
      userId: '@userId'
    }, {
      login: {
        method: 'POST',
        url: 'users/session-auth/'
      }
    });
    this.authenticated = false;
  }

  login(email, password, rememberMe) {
    var promise = this.$resource.login({
      email: email,
      password: password,
      rememberMe: rememberMe
    }).$promise;

    promise.then((data) => {
      console.log(data);
    }).catch(() => {
      console.log('Invalid login');
    });

    return promise;
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

UserService.$inject = ['$resource'];

export default UserService;
