class IndexController {
  constructor($scope, socketService) {
    this.$scope = $scope;

    socketService.on('quiz:0', (message) => {
      console.log(message);
    });
  }
}

IndexController.$inject = ['$scope', 'SocketService'];

export default IndexController;
