import { LGraphNode } from "litegraph.js";

export class RoundNode extends LGraphNode {
  static title = "Round";
  static desc = "Rounds to nearest integer";

  constructor() {
    super("Round");
    this.addInput("Value", "number");
    this.addOutput("Result", "number");
    this.size = [180, 60];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const value = this.getInputData(0) ?? 0;
    const result = Math.round(value);
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const value = this.getInputData(0) ?? 0;
    const result = Math.round(value);
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `${value} ≈ ${result}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}
