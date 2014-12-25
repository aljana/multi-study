import IndexController from './controllers/index';

angular.module('app.home', [])
  .config(['$stateProvider', ($stateProvider) => {
    $stateProvider.state('home', {
      url: '/',
      templateUrl: '/frontend/home/templates/home.html',
      controller: IndexController,
      controllerAs: 'IndexController'
    });
  }]);
