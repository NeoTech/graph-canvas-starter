import { LGraphNode } from "litegraph.js";
import { formatNumber } from "../utils/numberFormat";

export class RandomNode extends LGraphNode {
  static title = "Random";
  static desc = "Generates a random number";

  constructor() {
    super("Random");
    this.addInput("Min", "number");
    this.addInput("Max", "number");
    this.addOutput("Value", "number");
    this.addProperty("min", 0, "number");
    this.addProperty("max", 1, "number");
    this.size = [180, 70];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const min = this.getInputData(0) ?? this.properties.min;
    const max = this.getInputData(1) ?? this.properties.max;
    const result = Math.random() * (max - min) + min;
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const min = this.getInputData(0) ?? this.properties.min;
    const max = this.getInputData(1) ?? this.properties.max;
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `[${formatNumber(min)}, ${formatNumber(max)}]`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}
