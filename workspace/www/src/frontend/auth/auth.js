import AuthController from './controllers/auth';

angular.module('app.auth', [])
  .config(['$stateProvider', ($stateProvider) => {
    $stateProvider
      .state('login', {
        url: '/login/',
        templateUrl: './templates/login.html',
        controller: AuthController,
        controllerAs: 'AuthController',
        data: {
          rule: function (user) {
            if (user.credentials) {
              return 'home';
            }
          }
        }
      })
      .state('register', {
        url: '/register/',
        templateUrl: './templates/register.html',
        controller: AuthController,
        controllerAs: 'AuthController',
        data: {
          rule: function (user) {
            if (user.credentials) {
              return 'home';
            }
          }
        }
      });
  }]);
