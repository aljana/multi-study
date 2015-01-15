class QuizService {
  constructor($resource, cacheService) {
    angular.extend(this, $resource('quizzes/:quizId', {
      quizId: '@quizId'
    }, {
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
  }
}

QuizService.$inject = ['$resource', 'CacheService'];

export default QuizService;
