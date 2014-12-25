import IndexController from './controllers/index';

angular.module('app.home', [])
  .config(['$stateProvider', ($stateProvider) => {
    $stateProvider.state('home', {
      url: '/',
      templateUrl: './templates/home.html',
      controller: IndexController,
      controllerAs: 'IndexController'
    });
  }]);
