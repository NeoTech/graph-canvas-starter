import { LGraphNode } from "litegraph.js";
import { ShapeData } from "../utils/visualization";

export class CircleVisualizerNode extends LGraphNode {
  static title = "Circle";
  static desc = "Renders a circle with configurable properties";

  constructor() {
    super("Circle");
    this.addInput("X", "number");
    this.addInput("Y", "number");
    this.addInput("Radius", "number");
    this.addInput("Z-Index", "number");
    this.addOutput("Shape", "shape");
    this.addProperty("x", 960, "number");
    this.addProperty("y", 540, "number");
    this.addProperty("radius", 50, "number");
    this.addProperty("zIndex", 0, "number");
    this.addProperty("fill", "#22d3ee", "string");
    this.addProperty("stroke", "#0891b2", "string");
    this.size = [200, 140];
    this.color = "#0e7490";
    this.bgcolor = "#164e63";
  }

  onExecute() {
    const xInput = this.getInputData(0);
    const yInput = this.getInputData(1);
    const radiusInput = this.getInputData(2);
    const zIndexInput = this.getInputData(3);
    
    const x = xInput !== undefined && xInput !== null ? xInput : this.properties.x;
    const y = yInput !== undefined && yInput !== null ? yInput : this.properties.y;
    const radius = radiusInput !== undefined && radiusInput !== null ? radiusInput : this.properties.radius;
    const zIndex = zIndexInput !== undefined && zIndexInput !== null ? zIndexInput : this.properties.zIndex;

    const shapeData: ShapeData = {
      type: "circle",
      data: {
        x,
        y,
        radius: Math.abs(radius),
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
    const xInput = this.getInputData(0);
    const yInput = this.getInputData(1);
    const rInput = this.getInputData(2);
    
    const x = xInput !== undefined && xInput !== null ? xInput : this.properties.x;
    const y = yInput !== undefined && yInput !== null ? yInput : this.properties.y;
    const r = rInput !== undefined && rInput !== null ? rInput : this.properties.radius;
    
    ctx.fillStyle = "#64748b";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`(${x.toFixed(0)}, ${y.toFixed(0)}) r=${Math.abs(r).toFixed(0)}`, this.size[0] * 0.5, this.size[1] * 0.8);
  }
}
