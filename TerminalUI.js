const blessed = require("blessed");

class TerminalUI {
  constructor() {
    this.screen = blessed.screen({
      smartCSR: true,
      title: "Math Trainer",
    });

    this.screen.key(["C-c"], () => {
      process.exit(0);
    });
  }

  async askSettings() {
    return new Promise((resolve) => {
      const container = blessed.box({
        top: "center",
        left: "center",
        width: 52,
        height: 26,
      });

      const logo = blessed.box({
        parent: container,
        top: 0,
        left: "center",
        width: "100%",
        height: 8,
        tags: true,
        content:
          "{center}{bold}{magenta-fg}" +
          "███╗   ███╗ █████╗ ████████╗██╗  ██╗\n" +
          "████╗ ████║██╔══██╗╚══██╔══╝██║  ██║\n" +
          "██╔████╔██║███████║   ██║   ███████║\n" +
          "██║╚██╔╝██║██╔══██║   ██║   ██╔══██║\n" +
          "██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║\n" +
          "╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝\n" +
          "{/magenta-fg}{/bold}{/center}",
      });

      const wrapper = blessed.box({
        parent: container,
        top: 8,
        left: "center",
        width: 50,
        height: 16,
        border: { type: "line" },
        label: " Trainer settings ",
        tags: true,
        style: {
          border: { fg: "magenta" },
          label: { fg: "magenta", bold: true },
          bg: "black",
        },
      });

      const title = blessed.box({
        parent: wrapper,
        top: 1,
        left: "center",
        width: "90%",
        height: 3,
        tags: true,
        content:
          "{center}{bold}{magenta-fg} Math trainer {/magenta-fg}{/bold}{/center}",
      });

      const difficultyLabel = blessed.box({
        parent: wrapper,
        top: 4,
        left: 2,
        width: "90%",
        height: 1,
        tags: true,
        content: "{magenta-fg}Difficulty(1—easy,2-midle,3—hard):{/magenta-fg}",
      });

      const difficultyInput = blessed.textbox({
        parent: wrapper,
        top: 5,
        left: 2,
        width: "90%",
        height: 3,
        border: { type: "line" },
        inputOnFocus: true,
        style: {
          border: { fg: "magenta" },
          fg: "white",
        },
      });

      const countLabel = blessed.box({
        parent: wrapper,
        top: 8,
        left: 2,
        width: "90%",
        height: 1,
        tags: true,
        content: "{magenta-fg}Number of questions:{/magenta-fg}",
      });

      const countInput = blessed.textbox({
        parent: wrapper,
        top: 9,
        left: 2,
        width: "90%",
        height: 3,
        border: { type: "line" },
        inputOnFocus: true,
        style: {
          border: { fg: "magenta" },
          fg: "white",
        },
      });

      const hint = blessed.box({
        parent: wrapper,
        bottom: 0,
        left: "center",
        width: "90%",
        height: 1,
        tags: true,
        content:
          "{center}{grey-fg}Tab — switching, Enter — confirm{/grey-fg}{/center}",
      });

      this.screen.append(container);

      let difficulty = 2;
      let questionCount = 10;

      const finish = () => {
        const parsedDifficulty = parseInt(difficultyInput.getValue(), 10);
        const parsedCount = parseInt(countInput.getValue(), 10);

        if (
          !Number.isNaN(parsedDifficulty) &&
          parsedDifficulty >= 1 &&
          parsedDifficulty <= 3
        ) {
          difficulty = parsedDifficulty;
        }
        if (!Number.isNaN(parsedCount) && parsedCount > 0) {
          questionCount = parsedCount;
        }

        container.destroy();
        this.screen.render();
        resolve({ difficulty, questionCount });
      };

      difficultyInput.key(["tab", "down"], () => {
        countInput.focus();
      });

      countInput.key(["tab", "down"], () => {
        difficultyInput.focus();
      });

      difficultyInput.on("submit", () => {
        countInput.focus();
        this.screen.render();
      });

      countInput.on("submit", finish);

      difficultyInput.setValue("2");
      countInput.setValue("10");
      difficultyInput.focus();
      difficultyInput.readInput();
      this.screen.render();
    });
  }

  buildGameScreen() {
    this.headerBox = blessed.box({
      top: 0,
      left: 0,
      width: "100%",
      height: 3,
      tags: true,
      content: "{center}{bold} MATH TRAINER {/bold}{/center}",
      style: {
        fg: "white",
        bg: "magenta",
      },
    });

    this.problemBox = blessed.box({
      top: 3,
      left: 0,
      width: "70%",
      height: "60%-3",
      label: " Task ",
      tags: true,
      border: { type: "line" },
      padding: { left: 2, right: 2, top: 1 },
      style: {
        border: { fg: "magenta" },
        label: { fg: "magenta", bold: true },
      },
    });

    this.statsBox = blessed.box({
      top: 3,
      left: "70%",
      width: "30%",
      height: "60%-3",
      label: " Statistics ",
      tags: true,
      border: { type: "line" },
      padding: { left: 1, right: 1, top: 1 },
      style: {
        border: { fg: "magenta" },
        label: { fg: "magenta", bold: true },
      },
    });

    this.logBox = blessed.log({
      top: "60%",
      left: 0,
      width: "100%",
      height: "40%-4",
      label: " History ",
      tags: true,
      border: { type: "line" },
      scrollable: true,
      alwaysScroll: true,
      style: {
        border: { fg: "magenta" },
        label: { fg: "magenta", bold: true },
      },
    });

    this.inputBox = blessed.textbox({
      bottom: 1,
      left: 0,
      width: "100%",
      height: 3,
      label: " Answer (Enter — send) ",
      border: { type: "line" },
      inputOnFocus: true,
      keys: true,
      style: {
        border: { fg: "magenta" },
        label: { fg: "magenta", bold: true },
      },
    });

    this.footerBox = blessed.box({
      bottom: 0,
      left: 0,
      width: "100%",
      height: 1,
      content: " Enter: send answer   |   Ctrl+C: quit",
      style: {
        fg: "white",
        bg: "magenta",
      },
    });

    this.screen.append(this.headerBox);
    this.screen.append(this.problemBox);
    this.screen.append(this.statsBox);
    this.screen.append(this.logBox);
    this.screen.append(this.inputBox);
    this.screen.append(this.footerBox);

    this.screen.render();
  }

  setProblem(text, current, total) {
    this.problemBox.setContent(
      "{bold}Question " +
        current +
        " из " +
        total +
        "{/bold}\n\n" +
        "{bold}{magenta-fg}" +
        text +
        "{/magenta-fg}{/bold}",
    );
    this.screen.render();
  }

  setStats(correct, wrong, accuracy, streak, bestStreak) {
    const content =
      "Correct:    {green-fg}" +
      correct +
      "{/green-fg}\n" +
      "Wrong:  {red-fg}" +
      wrong +
      "{/red-fg}\n" +
      "Accuracy:     {magenta-fg}" +
      accuracy +
      "%{/magenta-fg}\n" +
      "Streak:        " +
      streak +
      "\n" +
      "Best streak: " +
      bestStreak;
    this.statsBox.setContent(content);
    this.screen.render();
  }

  logResult(message, isCorrect) {
    const color = isCorrect ? "green" : "red";
    this.logBox.log("{" + color + "-fg}" + message + "{/" + color + "-fg}");
    this.screen.render();
  }

  askAnswer() {
    return new Promise((resolve) => {
      this.inputBox.setValue("");
      this.screen.render();

      const onSubmit = (value) => {
        this.inputBox.removeListener("submit", onSubmit);
        this.inputBox.clearValue();
        resolve(value || "");
      };

      this.inputBox.once("submit", onSubmit);
      this.inputBox.focus();
      this.inputBox.readInput();
      this.screen.render();
    });
  }

  showSummary(text) {
    this.problemBox.setContent(
      "{bold}{magenta-fg}" + text + "{/magenta-fg}{/bold}",
    );
    this.inputBox.hide();
    this.footerBox.setContent(" Press any key to exit...");
    this.screen.render();
    this.screen.key(["enter", "escape", "space", "q"], () => {
      process.exit(0);
    });
  }
}

module.exports = TerminalUI;
