class ScoreTracker {
  constructor() {
    this.correct = 0;
    this.wrong = 0;
    this.currentStreak = 0;
    this.bestStreak = 0;
  }

  registerCorrect() {
    this.correct++;
    this.currentStreak++;
    if (this.currentStreak > this.bestStreak) {
      this.bestStreak = this.currentStreak;
    }
  }

  registerWrong() {
    this.wrong++;
    this.currentStreak = 0;
  }

  get total() {
    return this.correct + this.wrong;
  }

  get accuracy() {
    if (this.total === 0) return 0;
    return Math.round((this.correct / this.total) * 100);
  }

  summary() {
    return (
      "\nResults:\n" +
      "  Correct: " +
      this.correct +
      "\n" +
      "  Wrong: " +
      this.wrong +
      "\n" +
      "  Accuracy: " +
      this.accuracy +
      "%\n" +
      "  Best streak: " +
      this.bestStreak +
      "\n"
    );
  }
}

module.exports = ScoreTracker;
