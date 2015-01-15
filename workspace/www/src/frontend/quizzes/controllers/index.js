class IndexController {
  constructor($scope, quizPagination, quizService, socketService) {
    this.$scope = $scope;

    this.quizService = quizService;
    this.quizPagination = quizPagination;

    socketService.on('quiz:public', (message) => {
      var i;
      message = JSON.parse(message);
      //console.log(message);
      if (message.action === 'change-state') {
        if (message.state === 'created') {
          quizService.get({ quizId: message.pk }, (data) => {
            this.quizPagination.results.push(data);
          });
        } else {
          for (i = 0; i < this.quizPagination.results.length; i++) {
            if (this.quizPagination.results[i].pk === message.pk) {
              this.quizPagination.results[i].state = message.state;
              if (message.state === 'closed' || message.state === 'deleted') {
                break;
              }
            }
          }
          if (message.state === 'closed' || message.state === 'deleted') {
            this.quizPagination.results.splice(i, 1);
          }
        }
      }
    });
  }

  participate(pk) {
    console.log('tset');
    this.quizService.participate({ quizId: pk });
  }
}

IndexController.$inject = ['$scope', 'quizPagination', 'QuizService', 'SocketService'];

export default IndexController;
