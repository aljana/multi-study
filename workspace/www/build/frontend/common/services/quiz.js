System.register([], function($__export) {
  "use strict";
  var QuizService;
  return {
    setters: [],
    execute: function() {
      QuizService = (function() {
        var QuizService = function QuizService($resource, cacheService) {
          angular.extend(this, $resource('quizzes/:quizId', {quizId: '@quizId'}, {
            query: {
              method: 'GET',
              isArray: false
            },
            participate: {
              method: 'PATCH',
              url: 'quizzes/:quizId/participate'
            },
            submitAnswer: {
              method: 'POST',
              url: 'quizzes/:quizId/submit_answer'
            }
          }));
        };
        return ($traceurRuntime.createClass)(QuizService, {}, {});
      }());
      QuizService.$inject = ['$resource', 'CacheService'];
      $__export('default', QuizService);
    }
  };
});
//# sourceURL=frontend/common/services/quiz.js
//# sourceMappingURL=../../../frontend/common/services/quiz.js.map