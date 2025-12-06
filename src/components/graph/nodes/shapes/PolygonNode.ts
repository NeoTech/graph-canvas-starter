import { LGraphNode } from "litegraph.js";
import { ShapeData } from "../utils/visualization";

export class PolygonVisualizerNode extends LGraphNode {
  static title = "Polygon";
  static desc = "Renders a polygon from sides count";

  constructor() {
    super("Polygon");
    this.addInput("Sides", "number");
    this.addInput("Radius", "number");
    this.addInput("Z-Index", "number");
    this.addOutput("Shape", "shape");
    this.addProperty("centerX", 400, "number");
    this.addProperty("centerY", 200, "number");
    this.addProperty("sides", 6, "number");
    this.addProperty("radius", 80, "number");
    this.addProperty("zIndex", 0, "number");
    this.addProperty("fill", "#34d399", "string");
    this.addProperty("stroke", "#059669", "string");
    this.size = [200, 130];
    this.color = "#047857";
    this.bgcolor = "#064e3b";
  }

  onExecute() {
    const sides = Math.max(3, Math.floor(Math.abs(this.getInputData(0) ?? this.properties.sides)));
    const radius = Math.abs(this.getInputData(1) ?? this.properties.radius);
    const cx = this.properties.centerX;
    const cy = this.properties.centerY;

    // Calculate polygon points
    const points: string[] = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * 2 * Math.PI - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }

    const zIndexInput = this.getInputData(2);
    const zIndex = zIndexInput !== undefined && zIndexInput !== null ? zIndexInput : this.properties.zIndex;

    const shapeData: ShapeData = {
      type: "polygon",
      data: {
        points: points.join(" "),
        centerX: cx, // Store center for transformations
        centerY: cy,
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
    const sides = Math.max(3, Math.floor(Math.abs(this.getInputData(0) ?? this.properties.sides)));
    const radius = Math.abs(this.getInputData(1) ?? this.properties.radius);
    
    ctx.fillStyle = "#6ee7b7";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${sides} sides, r=${radius.toFixed(0)}`, this.size[0] * 0.5, this.size[1] * 0.8);
  }
}
