export default () => {
  return {
    restrict: 'AE',
    scope: {},
    controller: ['$scope', 'UserService', ($scope, userService) => {
      $scope.userService = userService;
    }],
    templateUrl: './header.html'
  };
};
