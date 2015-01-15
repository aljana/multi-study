class UserService {
  constructor($resource, cacheService) {
    this.user = $resource('users/:userId', {
      userId: '@userId'
    }, {
      login: {
        method: 'POST',
        url: 'users/session-auth/'
      },
      logout: {
        method: 'DELETE',
        url: 'users/session-auth/'
      },
      me: {
        method: 'GET',
        url: 'users/me/'
      }
    });

    this.authenticated = false;
    this.cache = cacheService.create('user', {});

    if ((this.credentials = this.cache.get('credentials'))) {
      this.authenticated = true;
    }

    this.user.me().$promise.then((data) => {
      this.authenticated = true;
      this.credentials = data;
      this.cache.put('credentials', data);
    }, () => {
      this.authenticated = false;
      this.credentials = null;
      this.cache.removeAll();
    });
  }

  login(email, password, rememberMe) {
    var promise = this.user.login({
      email: email,
      password: password,
      rememberMe: rememberMe
    }).$promise;

    promise.then((data) => {
      this.authenticated = true;
      this.credentials = data;
      this.cache.put('credentials', data);
    });

    return promise;
  }

  register(email, password, firstName, lastName) {
    return this.user.save({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName
    }).$promise;
  }

  logout() {
    this.cache.removeAll();
    this.authenticated = false;
    this.credentials = null;
    this.user.logout();
  }
}

UserService.$inject = ['$resource', 'CacheService'];

export default UserService;
