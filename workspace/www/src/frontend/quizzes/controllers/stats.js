class StatsController {
  constructor(quiz, stats) {
    this.quiz = quiz;
    this.stats = stats;
  }
}

StatsController.$inject = ['quiz', 'stats'];

export default StatsController;
