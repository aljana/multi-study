System.register([], function($__export) {
  "use strict";
  var IndexController;
  return {
    setters: [],
    execute: function() {
      IndexController = (function() {
        var IndexController = function IndexController($scope, quizPagination, quizService, socketService) {
          var $__0 = this;
          this.$scope = $scope;
          this.quizService = quizService;
          this.quizPagination = quizPagination;
          socketService.on('quiz:public', (function(message) {
            var i;
            message = JSON.parse(message);
            if (message.action === 'change-state') {
              if (message.state === 'created') {
                quizService.get({quizId: message.pk}, (function(data) {
                  $__0.quizPagination.results.push(data);
                }));
              } else {
                for (i = 0; i < $__0.quizPagination.results.length; i++) {
                  if ($__0.quizPagination.results[i].pk === message.pk) {
                    $__0.quizPagination.results[i].state = message.state;
                    if (message.state === 'deleted') {
                      break;
                    }
                  }
                }
                if (message.state === 'deleted') {
                  $__0.quizPagination.results.splice(i, 1);
                }
              }
            }
          }));
        };
        return ($traceurRuntime.createClass)(IndexController, {participate: function(pk) {
            console.log('tset');
            this.quizService.participate({quizId: pk});
          }}, {});
      }());
      IndexController.$inject = ['$scope', 'quizPagination', 'QuizService', 'SocketService'];
      $__export('default', IndexController);
    }
  };
});
//# sourceURL=frontend/quizzes/controllers/index.js
//# sourceMappingURL=../../../frontend/quizzes/controllers/index.js.map