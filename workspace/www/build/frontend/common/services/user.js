System.register("frontend/common/services/user", [], function($__export) {
  "use strict";
  var __moduleName = "frontend/common/services/user";
  function require(path) {
    return $traceurRuntime.require("frontend/common/services/user", path);
  }
  var UserService;
  return {
    setters: [],
    execute: function() {
      UserService = (function() {
        var UserService = function UserService($resource) {
          this.$resource = $resource('users/:userId', {userId: '@userId'}, {login: {
              method: 'POST',
              url: 'users/session-auth/'
            }});
          this.authenticated = false;
        };
        return ($traceurRuntime.createClass)(UserService, {
          login: function(email, password, rememberMe) {
            var promise = this.$resource.login({
              email: email,
              password: password,
              rememberMe: rememberMe
            }).$promise;
            promise.then((function(data) {
              console.log(data);
            })).catch((function() {
              console.log('Invalid login');
            }));
            return promise;
          },
          isAuthenticated: function() {
            return this.authenticated;
          }
        }, {});
      }());
      UserService.$inject = ['$resource'];
      $__export('default', UserService);
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbnRlbmQvY29tbW9uL3NlcnZpY2VzL3VzZXIuanMiLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmcm9udGVuZC9jb21tb24vc2VydmljZXMvdXNlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBVc2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCRyZXNvdXJjZSkge1xuICAgIHRoaXMuJHJlc291cmNlID0gJHJlc291cmNlKCd1c2Vycy86dXNlcklkJywge1xuICAgICAgdXNlcklkOiAnQHVzZXJJZCdcbiAgICB9LCB7XG4gICAgICBsb2dpbjoge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgdXJsOiAndXNlcnMvc2Vzc2lvbi1hdXRoLydcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmF1dGhlbnRpY2F0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGxvZ2luKGVtYWlsLCBwYXNzd29yZCwgcmVtZW1iZXJNZSkge1xuICAgIHZhciBwcm9taXNlID0gdGhpcy4kcmVzb3VyY2UubG9naW4oe1xuICAgICAgZW1haWw6IGVtYWlsLFxuICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxuICAgICAgcmVtZW1iZXJNZTogcmVtZW1iZXJNZVxuICAgIH0pLiRwcm9taXNlO1xuXG4gICAgcHJvbWlzZS50aGVuKChkYXRhKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnSW52YWxpZCBsb2dpbicpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBpc0F1dGhlbnRpY2F0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXV0aGVudGljYXRlZDtcbiAgfVxufVxuXG5Vc2VyU2VydmljZS4kaW5qZWN0ID0gWyckcmVzb3VyY2UnXTtcblxuZXhwb3J0IGRlZmF1bHQgVXNlclNlcnZpY2U7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=