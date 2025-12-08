import { LGraphNode } from "litegraph.js";
import { ShapeData } from "../utils/visualization";

export class RectangleVisualizerNode extends LGraphNode {
  static title = "Rectangle";
  static desc = "Renders a rectangle";

  constructor() {
    super("Rectangle");
    this.addInput("X", "number");
    this.addInput("Y", "number");
    this.addInput("Width", "number");
    this.addInput("Height", "number");
    this.addInput("Z-Index", "number");
    this.addOutput("Shape", "shape");
    this.addProperty("x", 0, "number");
    this.addProperty("y", 0, "number");
    this.addProperty("width", 100, "number");
    this.addProperty("height", 100, "number");
    this.addProperty("zIndex", 0, "number");
    this.addProperty("fill", "#a855f7", "string");
    this.addProperty("stroke", "#7c3aed", "string");
    this.addWidget("number", "X", 0, (v: number) => {
      this.properties.x = v;
    });
    this.addWidget("number", "Y", 0, (v: number) => {
      this.properties.y = v;
    });
    this.addWidget("number", "Width", 100, (v: number) => {
      this.properties.width = v;
    });
    this.addWidget("number", "Height", 100, (v: number) => {
      this.properties.height = v;
    });
    this.addWidget("number", "Z-Index", 0, (v: number) => {
      this.properties.zIndex = v;
    });
    this.size = [200, 230];
    this.color = "#6d28d9";
    this.bgcolor = "#4c1d95";
  }

  onExecute() {
    const xInput = this.getInputData(0);
    const yInput = this.getInputData(1);
    const widthInput = this.getInputData(2);
    const heightInput = this.getInputData(3);
    const zIndexInput = this.getInputData(4);
    
    // Local coordinates - top-left at (0,0) by default, or centered if X/Y provided
    // X/Y inputs allow local positioning relative to parent group
    const x = xInput !== undefined && xInput !== null ? xInput : 0;
    const y = yInput !== undefined && yInput !== null ? yInput : 0;
    const width = widthInput !== undefined && widthInput !== null ? widthInput : this.properties.width;
    const height = heightInput !== undefined && heightInput !== null ? heightInput : this.properties.height;
    const zIndex = zIndexInput !== undefined && zIndexInput !== null ? zIndexInput : this.properties.zIndex;

    const shapeData: ShapeData = {
      type: "rectangle",
      data: {
        x,
        y,
        width: Math.abs(width),
        height: Math.abs(height),
        fill: this.properties.fill,
        stroke: this.properties.stroke,
        opacity: 0.7,
        strokeWidth: 2,
      },
      zIndex,
    };

    this.setOutputData(0, shapeData);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const wInput = this.getInputData(2);
    const hInput = this.getInputData(3);
    
    const w = Math.abs(wInput !== undefined && wInput !== null ? wInput : this.properties.width);
    const h = Math.abs(hInput !== undefined && hInput !== null ? hInput : this.properties.height);
    
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${w.toFixed(0)}×${h.toFixed(0)}`, this.size[0] * 0.5, this.size[1] * 0.85);
  }
}
