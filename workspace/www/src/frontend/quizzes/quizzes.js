import IndexController from './controllers/index';
import QuizController from './controllers/quiz';
import StatsController from './controllers/stats';

angular.module('app.quizzes', [])
  .config(['$stateProvider', ($stateProvider) => {
    $stateProvider
      .state('quizzes', {
        url: '/',
        templateUrl: './templates/quizzes.html',
        controller: IndexController,
        controllerAs: 'IndexController',
        resolve: {
          quizPagination: ['QuizService', (quizService) => {
            return quizService.query().$promise;
          }]
        }
      })
      .state('quiz', {
        url: '/quiz/:quizId/',
        templateUrl: './templates/quiz.html',
        controller: QuizController,
        controllerAs: 'QuizController',
        resolve: {
          quiz: ['$state', '$stateParams', 'QuizService', ($state, $stateParams, quizService) => {
            return quizService.get({quizId: $stateParams.quizId}, function (quiz) {
              if (quiz.state !== 'open' && quiz.state !== 'active') {
                $state.go('quizzes');
              } else if (quiz.state === 'open') {
                quizService.participate({quizId: $stateParams.quizId});
              }
            }).$promise;
          }]
        },
        data: {
          rule: function (user) {
            if (!user.credentials) {
              return 'home';
            }
          }
        }
      })
      .state('quiz-stats', {
        url: '/quiz/:quizId/stats/',
        templateUrl: './templates/stats.html',
        controller: StatsController,
        controllerAs: 'StatsController',
        resolve: {
          stats: ['$state', '$stateParams', 'QuizService', ($state, $stateParams, quizService) => {
            return quizService.get({quizId: $stateParams.quizId}, function (quiz) {
              if (quiz.state !== 'open' && quiz.state !== 'active') {
                $state.go('quizzes');
              } else if (quiz.state === 'open') {
                quizService.participate({quizId: $stateParams.quizId});
              }
            }).$promise;
          }]
        },
        data: {
          rule: function (user) {
            if (!user.credentials) {
              return 'home';
            }
          }
        }
      });
  }]);
