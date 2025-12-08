import { LGraphNode } from "litegraph.js";
import { formatNumber } from "../utils/numberFormat";

export class CosineNode extends LGraphNode {
  static title = "Cosine";
  static desc = "Calculates cosine of angle in degrees";

  constructor() {
    super("Cosine");
    this.addInput("Angle", "number");
    this.addOutput("Result", "number");
    this.size = [180, 60];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const angle = this.getInputData(0) ?? 0;
    const result = Math.cos((angle * Math.PI) / 180);
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const angle = this.getInputData(0) ?? 0;
    const result = Math.cos((angle * Math.PI) / 180);
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `cos(${formatNumber(angle)}°) = ${formatNumber(result)}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}
