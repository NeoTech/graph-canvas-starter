import { LGraphNode } from "litegraph.js";
import { ShapeData } from "../utils/visualization";

export class SpiralVisualizerNode extends LGraphNode {
  static title = "Spiral";
  static desc = "Generates a spiral pattern";

  constructor() {
    super("Spiral");
    this.addInput("X", "number");
    this.addInput("Y", "number");
    this.addInput("Turns", "number");
    this.addInput("Spacing", "number");
    this.addInput("Z-Index", "number");
    this.addOutput("Shape", "shape");
    this.addProperty("centerX", 0, "number");
    this.addProperty("centerY", 0, "number");
    this.addProperty("turns", 5, "number");
    this.addProperty("spacing", 10, "number");
    this.addProperty("zIndex", 0, "number");
    this.addProperty("stroke", "#22d3ee", "string");
    this.addWidget("number", "X", 0, (v: number) => {
      this.properties.centerX = v;
    });
    this.addWidget("number", "Y", 0, (v: number) => {
      this.properties.centerY = v;
    });
    this.addWidget("number", "Turns", 5, (v: number) => {
      this.properties.turns = v;
    });
    this.addWidget("number", "Spacing", 10, (v: number) => {
      this.properties.spacing = v;
    });
    this.addWidget("number", "Z-Index", 0, (v: number) => {
      this.properties.zIndex = v;
    });
    this.size = [200, 230];
    this.color = "#0e7490";
    this.bgcolor = "#164e63";
  }

  onExecute() {
    const xInput = this.getInputData(0);
    const yInput = this.getInputData(1);
    const turnsInput = this.getInputData(2);
    const spacingInput = this.getInputData(3);
    const zIndexInput = this.getInputData(4);
    
    const centerX = xInput !== undefined && xInput !== null ? xInput : this.properties.centerX;
    const centerY = yInput !== undefined && yInput !== null ? yInput : this.properties.centerY;
    const turns = turnsInput !== undefined && turnsInput !== null ? turnsInput : this.properties.turns;
    const spacing = spacingInput !== undefined && spacingInput !== null ? spacingInput : this.properties.spacing;
    const zIndex = zIndexInput !== undefined && zIndexInput !== null ? zIndexInput : this.properties.zIndex;

    const shapeData: ShapeData = {
      type: "spiral",
      data: {
        centerX,
        centerY,
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
    const turnsInput = this.getInputData(2);
    const spacingInput = this.getInputData(3);
    
    const turns = turnsInput !== undefined && turnsInput !== null ? turnsInput : this.properties.turns;
    const spacing = spacingInput !== undefined && spacingInput !== null ? spacingInput : this.properties.spacing;
    
    ctx.fillStyle = "#67e8f9";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${turns.toFixed(1)} turns, ${Math.abs(spacing).toFixed(0)}px`, this.size[0] * 0.5, this.size[1] * 0.8);
  }
}
