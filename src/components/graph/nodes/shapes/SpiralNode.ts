import { LGraphNode } from "litegraph.js";
import { ShapeData } from "../utils/visualization";

export class SpiralVisualizerNode extends LGraphNode {
  static title = "Spiral";
  static desc = "Generates a spiral pattern";

  constructor() {
    super("Spiral");
    this.addInput("Turns", "number");
    this.addInput("Spacing", "number");
    this.addInput("Z-Index", "number");
    this.addOutput("Shape", "shape");
    this.addProperty("centerX", 400, "number");
    this.addProperty("centerY", 200, "number");
    this.addProperty("turns", 5, "number");
    this.addProperty("spacing", 10, "number");
    this.addProperty("zIndex", 0, "number");
    this.addProperty("stroke", "#22d3ee", "string");
    this.size = [200, 130];
    this.color = "#0e7490";
    this.bgcolor = "#164e63";
  }

  onExecute() {
    const turns = this.getInputData(0) ?? this.properties.turns;
    const spacing = this.getInputData(1) ?? this.properties.spacing;
    const zIndexInput = this.getInputData(2);
    const zIndex = zIndexInput !== undefined && zIndexInput !== null ? zIndexInput : this.properties.zIndex;

    const shapeData: ShapeData = {
      type: "spiral",
      data: {
        centerX: this.properties.centerX,
        centerY: this.properties.centerY,
        turns: Math.max(0.5, Math.abs(turns)),
        spacing: Math.abs(spacing),
        points: 200,
        stroke: this.properties.stroke,
        strokeWidth: 2,
      },
      zIndex,
    };

    this.setOutputData(0, shapeData);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const turns = this.getInputData(0) ?? this.properties.turns;
    const spacing = this.getInputData(1) ?? this.properties.spacing;
    
    ctx.fillStyle = "#67e8f9";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${turns.toFixed(1)} turns, ${Math.abs(spacing).toFixed(0)}px`, this.size[0] * 0.5, this.size[1] * 0.8);
  }
}
