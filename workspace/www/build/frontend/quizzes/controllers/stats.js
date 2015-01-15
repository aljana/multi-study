System.register([], function($__export) {
  "use strict";
  var StatsController;
  return {
    setters: [],
    execute: function() {
      StatsController = (function() {
        var StatsController = function StatsController(quiz, stats) {
          this.quiz = quiz;
          this.stats = stats;
        };
        return ($traceurRuntime.createClass)(StatsController, {}, {});
      }());
      StatsController.$inject = ['quiz', 'stats'];
      $__export('default', StatsController);
    }
  };
});
//# sourceURL=frontend/quizzes/controllers/stats.js
//# sourceMappingURL=../../../frontend/quizzes/controllers/stats.js.map