System.register([], function($__export) {
  "use strict";
  var UserService;
  return {
    setters: [],
    execute: function() {
      UserService = (function() {
        var UserService = function UserService($resource, cacheService) {
          var $__0 = this;
          this.user = $resource('users/:userId', {userId: '@userId'}, {
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
          this.user.me().$promise.then((function(data) {
            $__0.authenticated = true;
            $__0.credentials = data;
            $__0.cache.put('credentials', data);
          }), (function() {
            $__0.authenticated = false;
            $__0.credentials = null;
            $__0.cache.removeAll();
          }));
        };
        return ($traceurRuntime.createClass)(UserService, {
          login: function(email, password, rememberMe) {
            var $__0 = this;
            var promise = this.user.login({
              email: email,
              password: password,
              rememberMe: rememberMe
            }).$promise;
            promise.then((function(data) {
              $__0.authenticated = true;
              $__0.credentials = data;
              $__0.cache.put('credentials', data);
            }));
            return promise;
          },
          register: function(email, password, firstName, lastName) {
            return this.user.save({
              email: email,
              password: password,
              firstName: firstName,
              lastName: lastName
            }).$promise;
          },
          logout: function() {
            this.cache.removeAll();
            this.authenticated = false;
            this.credentials = null;
            this.user.logout();
          }
        }, {});
      }());
      UserService.$inject = ['$resource', 'CacheService'];
      $__export('default', UserService);
    }
  };
});
//# sourceURL=frontend/common/services/user.js
//# sourceMappingURL=../../../frontend/common/services/user.js.map