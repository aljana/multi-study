System.register([], function($__export) {
  "use strict";
  var QuizController;
  return {
    setters: [],
    execute: function() {
      QuizController = (function() {
        var QuizController = function QuizController($scope, $timeout, $state, quiz, userService, quizService, socketService) {
          var $__0 = this;
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
          setInterval((function() {
            if ($__0.countdown > 0) {
              $__0.countdown--;
            }
            $scope.$apply();
          }), 1000);
          socketService.on('chat', (function(message) {
            if (message.action === 'chat-join') {
              if ($__0.messages.length === 0) {
                Array.prototype.push.apply($__0.messages, message.messages);
              }
            } else if (message.action === 'chat-message') {
              $__0.messages.push(message);
            }
          }));
          socketService.on('quiz:' + this.quiz.pk, (function(message) {
            message = JSON.parse(message);
            if (message.action === 'change-question') {
              $__0.quiz.answered = false;
              $__0.quiz.question = message.question;
              $__0.countdown = Math.round(((new Date(message.timeUpdated) - new Date()) / 1000) + message.question.timeLimit);
              $timeout(function() {
                $scope.$apply();
              }, 0, false);
            } else if (message.action === 'close-quiz') {
              $state.go('quiz-stats', {quizId: $__0.quiz.pk}, {
                reload: true,
                inherit: true,
                notify: true
              });
            }
          }));
        };
        return ($traceurRuntime.createClass)(QuizController, {
          submitTextInput: function() {
            var $__0 = this;
            if (this.quiz.question) {
              this.quizService.submitAnswer({quizId: this.quiz.pk}, {text: this.textInput}, (function() {
                $__0.quiz.answered = true;
              }));
            } else if (this.textInput.length > 0) {
              this.socketService.emit('chat-message', {
                pk: this.quiz.pk,
                email: this.userService.credentials.user.email,
                message: this.textInput
              });
            }
            this.textInput = '';
          },
          submitRadioInput: function() {
            var $__0 = this;
            if (this.radioInput) {
              this.quizService.submitAnswer({quizId: this.quiz.pk}, {text: this.radioInput}, (function() {
                $__0.quiz.answered = true;
              }));
              this.radioInput = null;
            }
          }
        }, {});
      }());
      QuizController.$inject = ['$scope', '$timeout', '$state', 'quiz', 'UserService', 'QuizService', 'SocketService'];
      $__export('default', QuizController);
    }
  };
});
//# sourceURL=frontend/quizzes/controllers/quiz.js
//# sourceMappingURL=../../../frontend/quizzes/controllers/quiz.js.map