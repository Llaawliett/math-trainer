class Problem {
  constructor(a, b, operator) {
    this.a = a;
    this.b = b;
    this.operator = operator;
    this.answer = this._calculate();
  }

  _round(value, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  _calculate() {
    switch (this.operator) {
      case "+":
        return this._round(this.a + this.b, 2);
      case "-":
        return this._round(this.a - this.b, 2);
      case "*":
        return this._round(this.a * this.b, 2);
      case "/":
        return this._round(this.a / this.b, 2);
      case "^2":
        return this._round(this.a * this.a, 2);
      default:
        throw new Error("Unkown operator: " + this.operator);
    }
  }

  check(userAnswer) {
    const parsed = parseFloat(String(userAnswer).replace(",", "."));
    if (Number.isNaN(parsed)) return false;
    return Math.abs(parsed - this.answer) < 0.01;
  }

  toString() {
    if (this.operator === "^2") {
      return this.a + "^2 = ?";
    }
    return this.a + " " + this.operator + " " + this.b + " = ?";
  }
}

module.exports = Problem;
