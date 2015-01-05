import UserController from '../../controllers/user';

export default () => {
  return {
    restrict: 'AE',
    scope: {},
    controller: UserController,
    controllerAs: 'UserController',
    templateUrl: './header.html'
  };
};
