import { LGraphNode } from "litegraph.js";
import { ShapeData } from "../utils/visualization";

export class PolygonVisualizerNode extends LGraphNode {
  static title = "Polygon";
  static desc = "Renders a polygon from sides count";

  constructor() {
    super("Polygon");
    this.addInput("X", "number");
    this.addInput("Y", "number");
    this.addInput("Sides", "number");
    this.addInput("Radius", "number");
    this.addInput("Z-Index", "number");
    this.addOutput("Shape", "shape");
    this.addProperty("centerX", 0, "number");
    this.addProperty("centerY", 0, "number");
    this.addProperty("sides", 6, "number");
    this.addProperty("radius", 80, "number");
    this.addProperty("zIndex", 0, "number");
    this.addProperty("fill", "#34d399", "string");
    this.addProperty("stroke", "#059669", "string");
    this.addWidget("number", "X", 0, (v: number) => {
      this.properties.centerX = v;
    });
    this.addWidget("number", "Y", 0, (v: number) => {
      this.properties.centerY = v;
    });
    this.addWidget("number", "Sides", 6, (v: number) => {
      this.properties.sides = v;
    });
    this.addWidget("number", "Radius", 80, (v: number) => {
      this.properties.radius = v;
    });
    this.addWidget("number", "Z-Index", 0, (v: number) => {
      this.properties.zIndex = v;
    });
    this.size = [200, 230];
    this.color = "#047857";
    this.bgcolor = "#064e3b";
  }

  onExecute() {
    const xInput = this.getInputData(0);
    const yInput = this.getInputData(1);
    const sidesInput = this.getInputData(2);
    const radiusInput = this.getInputData(3);
    const zIndexInput = this.getInputData(4);
    
    // Local coordinates - center at (0,0) by default
    // X/Y inputs allow local positioning relative to parent group
    const cx = xInput !== undefined && xInput !== null ? xInput : 0;
    const cy = yInput !== undefined && yInput !== null ? yInput : 0;
    const sides = Math.max(3, Math.floor(Math.abs(sidesInput !== undefined && sidesInput !== null ? sidesInput : this.properties.sides)));
    const radius = Math.abs(radiusInput !== undefined && radiusInput !== null ? radiusInput : this.properties.radius);
    const zIndex = zIndexInput !== undefined && zIndexInput !== null ? zIndexInput : this.properties.zIndex;

    // Calculate polygon points relative to local center
    const points: string[] = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * 2 * Math.PI - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }

    const shapeData: ShapeData = {
      type: "polygon",
      data: {
        points: points.join(" "),
        centerX: cx, // Store local center
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
    const sidesInput = this.getInputData(2);
    const radiusInput = this.getInputData(3);
    
    const sides = Math.max(3, Math.floor(Math.abs(sidesInput !== undefined && sidesInput !== null ? sidesInput : this.properties.sides)));
    const radius = Math.abs(radiusInput !== undefined && radiusInput !== null ? radiusInput : this.properties.radius);
    
    ctx.fillStyle = "#6ee7b7";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${sides} sides, r=${radius.toFixed(0)}`, this.size[0] * 0.5, this.size[1] * 0.85);
  }
}
