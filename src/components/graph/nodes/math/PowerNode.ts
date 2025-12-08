import { LGraphNode } from "litegraph.js";
import { formatNumber } from "../utils/numberFormat";

export class PowerNode extends LGraphNode {
  static title = "Power";
  static desc = "Raises a number to a power";

  constructor() {
    super("Power");
    this.addInput("Base", "number");
    this.addInput("Exponent", "number");
    this.addOutput("Result", "number");
    this.size = [180, 70];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const base = this.getInputData(0) ?? 0;
    const exp = this.getInputData(1) ?? 2;
    const result = Math.pow(base, exp);
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const base = this.getInputData(0) ?? 0;
    const exp = this.getInputData(1) ?? 2;
    const result = Math.pow(base, exp);
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `${formatNumber(base)}^${formatNumber(exp)} = ${formatNumber(result)}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}
