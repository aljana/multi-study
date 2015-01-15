class QuizController {
  constructor($scope, $timeout, $state, quiz, userService, quizService, socketService) {
    this.$scope = $scope;
    this.quiz = quiz;
    this.userService = userService;
    this.quizService = quizService;
    this.socketService = socketService;
    this.textInput = '';
    this.radioInput = null;
    this.messages = [];

    socketService.emit('chat-join', {
      email: userService.credentials.user.email,
      quizPk: this.quiz.pk
    });

    var start;
    var segments = this.quiz.start.split(':');

    if (this.quiz.state === 'active') {
      start = new Date(this.quiz.timeUpdated);
      this.countdown = Math.round((start - new Date()) / 1000) + this.quiz.question.timeLimit;
    } else {
      start = new Date();
      start.setHours(segments[0]);
      start.setMinutes(segments[1]);
      start.setSeconds(segments[2]);
      this.countdown = Math.round((start - new Date()) / 1000);
    }

    setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      }
      $scope.$apply();
    }, 1000);

    socketService.on('chat', (message) => {
      if (message.action === 'chat-join') {
        if (this.messages.length === 0) {
          Array.prototype.push.apply(this.messages, message.messages);
        }
      }
      else if (message.action === 'chat-message') {
        this.messages.push(message);
      }
    });

    socketService.on('quiz:' + this.quiz.pk, (message) => {
      message = JSON.parse(message);
      //console.log(message);
      if (message.action === 'change-question') {
        this.quiz.answered = false;
        this.quiz.question = message.question;
        this.countdown = Math.round(((new Date(message.timeUpdated) - new Date()) / 1000) + message.question.timeLimit);
        $timeout(function () {
          $scope.$apply();
        }, 0, false);
      } else if (message.action === 'close-quiz') {
        $state.go('quiz-stats', {quizId: this.quiz.pk}, {
          reload: true,
          inherit: true,
          notify: true
        });
      }
    });
  }

  submitTextInput() {
    if (this.quiz.question) {
      this.quizService.submitAnswer({quizId: this.quiz.pk}, {
        text: this.textInput
      }, () => {
        this.quiz.answered = true;
      });
    } else if (this.textInput.length > 0) {
      this.socketService.emit('chat-message', {
        pk: this.quiz.pk,
        email: this.userService.credentials.user.email,
        message: this.textInput
      });
    }


    this.textInput = '';
  }

  submitRadioInput() {
    if (this.radioInput) {
      this.quizService.submitAnswer({quizId: this.quiz.pk}, {
        text: this.radioInput
      }, () => {
        this.quiz.answered = true;
      });

      this.radioInput = null;
    }
  }
}

QuizController.$inject = ['$scope', '$timeout', '$state', 'quiz', 'UserService', 'QuizService', 'SocketService'];

export default QuizController;
