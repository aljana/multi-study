System.register(["./controllers/index", "./controllers/quiz", "./controllers/stats"], function($__export) {
  "use strict";
  var IndexController,
      QuizController,
      StatsController;
  return {
    setters: [function(m) {
      IndexController = m.default;
    }, function(m) {
      QuizController = m.default;
    }, function(m) {
      StatsController = m.default;
    }],
    execute: function() {
      angular.module('app.quizzes', []).config(['$stateProvider', (function($stateProvider) {
        $stateProvider.state('quizzes', {
          url: '/',
          templateUrl: '/www/frontend/quizzes/templates/quizzes.html',
          controller: IndexController,
          controllerAs: 'IndexController',
          resolve: {quizPagination: ['QuizService', (function(quizService) {
              return quizService.query().$promise;
            })]}
        }).state('quiz', {
          url: '/quiz/:quizId/',
          templateUrl: '/www/frontend/quizzes/templates/quiz.html',
          controller: QuizController,
          controllerAs: 'QuizController',
          resolve: {quiz: ['$state', '$stateParams', 'QuizService', (function($state, $stateParams, quizService) {
              return quizService.get({quizId: $stateParams.quizId}, function(quiz) {
                if (quiz.state !== 'open' && quiz.state !== 'active') {
                  $state.go('quizzes');
                } else if (quiz.state === 'open') {
                  quizService.participate({quizId: $stateParams.quizId});
                }
              }).$promise;
            })]},
          data: {rule: function(user) {
              if (!user.credentials) {
                return 'home';
              }
            }}
        }).state('quiz-stats', {
          url: '/quiz/:quizId/stats/',
          templateUrl: '/www/frontend/quizzes/templates/stats.html',
          controller: StatsController,
          controllerAs: 'StatsController',
          resolve: {stats: ['$state', '$stateParams', 'QuizService', (function($state, $stateParams, quizService) {
              return quizService.get({quizId: $stateParams.quizId}, function(quiz) {
                if (quiz.state !== 'open' && quiz.state !== 'active') {
                  $state.go('quizzes');
                } else if (quiz.state === 'open') {
                  quizService.participate({quizId: $stateParams.quizId});
                }
              }).$promise;
            })]},
          data: {rule: function(user) {
              if (!user.credentials) {
                return 'home';
              }
            }}
        });
      })]);
    }
  };
});
//# sourceURL=frontend/quizzes/quizzes.js
//# sourceMappingURL=../../frontend/quizzes/quizzes.js.map