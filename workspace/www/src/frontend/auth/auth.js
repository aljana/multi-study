import AuthController from './controllers/auth';

angular.module('app.auth', [])
  .config(['$stateProvider', ($stateProvider) => {
    $stateProvider.state('login', {
      url: '/login/',
      templateUrl: './templates/login.html',
      controller: AuthController,
      controllerAs: 'AuthController'
    });
  }]);
