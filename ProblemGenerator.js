const Problem = require("./Problem");

class ProblemGenerator {
  constructor(difficulty = 1) {
    this.difficulty = difficulty;
    this.operators = ["+", "-", "*", "/", "^2"];
    this.usedKeys = new Set();
  }

  setDifficulty(level) {
    this.difficulty = level;
  }

  reset() {
    this.usedKeys.clear();
  }

  _randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  _randomDecimal(min, max, decimalPlaces) {
    const factor = Math.pow(10, decimalPlaces);
    return this._randomInt(min * factor, max * factor) / factor;
  }

  _getRange() {
    switch (this.difficulty) {
      case 1:
        return { min: 1, max: 10 };
      case 2:
        return { min: 10, max: 50 };
      case 3:
        return { min: 20, max: 100 };
      default:
        return { min: 1, max: 10 };
    }
  }

  _useDecimals() {
    return this.difficulty >= 2;
  }

  _buildKey(problem) {
    return (
      "num_" +
      problem.a +
      "_" +
      problem.operator +
      "_" +
      (problem.b === null ? "x" : problem.b)
    );
  }

  _generateRaw() {
    const { min, max } = this._getRange();
    const operator =
      this.operators[this._randomInt(0, this.operators.length - 1)];

    if (operator === "^2") {
      const base = this._randomInt(2, Math.min(max, 20));
      return new Problem(base, null, operator);
    }

    const useDecimal = this._useDecimals() && this._randomInt(0, 1) === 1;
    let a, b;

    if (useDecimal) {
      a = this._randomDecimal(min, max, 1);
      b = this._randomDecimal(min, max, 1);
    } else {
      a = this._randomInt(min, max);
      b = this._randomInt(min, max);
    }

    if (operator === "/") {
      if (useDecimal) {
        b = this._randomDecimal(1, Math.max(2, Math.floor(max / 5)), 1);
        const multiplier = this._randomInt(1, Math.floor(max / Math.max(b, 1)));
        a = Math.round(b * multiplier * 10) / 10;
      } else {
        b = this._randomInt(1, Math.max(2, Math.floor(max / 5)));
        a = b * this._randomInt(1, Math.floor(max / b));
      }
    }

    if (operator === "-" && b > a) {
      const tmp = a;
      a = b;
      b = tmp;
    }

    return new Problem(a, b, operator);
  }

  generate() {
    const maxAttempts = 300;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const problem = this._generateRaw();
      const key = this._buildKey(problem);
      if (!this.usedKeys.has(key)) {
        this.usedKeys.add(key);
        return problem;
      }
    }
    this.difficulty = Math.min(this.difficulty + 1, 3);
    return this._generateRaw();
  }
}

module.exports = ProblemGenerator;
