const ProblemGenerator = require("./ProblemGenerator");
const ScoreTracker = require("./ScoreTracker");
const TerminalUI = require("./TerminalUI");

class Trainer {
  constructor() {
    this.ui = new TerminalUI();
    this.tracker = new ScoreTracker();
  }

  async start() {
    const settings = await this.ui.askSettings();
    this.generator = new ProblemGenerator(settings.difficulty);
    this.totalQuestions = settings.questionCount;

    this.ui.buildGameScreen();
    this.ui.setStats(0, 0, 0, 0, 0);

    for (let i = 1; i <= this.totalQuestions; i++) {
      const problem = this.generator.generate();
      this.ui.setProblem(problem.toString(), i, this.totalQuestions);

      const userAnswer = await this.ui.askAnswer();

      if (problem.check(userAnswer)) {
        this.tracker.registerCorrect();
        this.ui.logResult(
          "Correct: " + problem.toString() + "  answer: " + problem.answer,
          true,
        );
      } else {
        this.tracker.registerWrong();
        this.ui.logResult(
          "Wrong: " +
            problem.toString() +
            "  your answer: " +
            userAnswer +
            "  correct: " +
            problem.answer,
          false,
        );
      }

      this.ui.setStats(
        this.tracker.correct,
        this.tracker.wrong,
        this.tracker.accuracy,
        this.tracker.currentStreak,
        this.tracker.bestStreak,
      );
    }

    this.ui.showSummary(this.tracker.summary());
  }
}

module.exports = Trainer;
