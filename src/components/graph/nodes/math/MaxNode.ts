import { LGraphNode } from "litegraph.js";

export class MaxNode extends LGraphNode {
  static title = "Max";
  static desc = "Returns the larger of two numbers";

  constructor() {
    super("Max");
    this.addInput("A", "number");
    this.addInput("B", "number");
    this.addOutput("Result", "number");
    this.size = [180, 70];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const a = this.getInputData(0) ?? 0;
    const b = this.getInputData(1) ?? 0;
    const result = Math.max(a, b);
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const a = this.getInputData(0) ?? 0;
    const b = this.getInputData(1) ?? 0;
    const result = Math.max(a, b);
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `max(${a}, ${b}) = ${result}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}
