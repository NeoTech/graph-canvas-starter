import { LGraphNode } from "litegraph.js";
import { ShapeData } from "../utils/visualization";

export class CircularArrayNode extends LGraphNode {
  static title = "Circular Array";
  static desc = "Arranges shapes along a circular path with rotation";

  constructor() {
    super("Circular Array");
    this.addInput("Shape", "shape,shape_array");
    this.addInput("Count", "number");
    this.addInput("Radius", "number");
    this.addInput("Center X", "number");
    this.addInput("Center Y", "number");
    this.addOutput("Shapes", "shape_array");
    this.addProperty("centerX", 400, "number");
    this.addProperty("centerY", 300, "number");
    this.addProperty("count", 12, "number");
    this.addProperty("radius", 100, "number");
    this.addProperty("startAngle", 0, "number");
    this.addProperty("endAngle", 360, "number");
    this.addProperty("treatAsGroup", true, "boolean");
    this.addWidget("number", "Start Angle", this.properties.startAngle, (v: any) => {
      this.properties.startAngle = v;
    }, { min: 0, max: 360, step: 1 });
    this.addWidget("number", "End Angle", this.properties.endAngle, (v: any) => {
      this.properties.endAngle = v;
    }, { min: 0, max: 360, step: 1 });
    this.addWidget("toggle", "Treat As Group", this.properties.treatAsGroup, (v: any) => {
      this.properties.treatAsGroup = v;
    });
    this.size = [220, 230];
    this.color = "#0891b2";
    this.bgcolor = "#164e63";
  }

  onExecute() {
    const input = this.getInputData(0);
    if (!input) {
      this.setOutputData(0, []);
      return;
    }

    // Normalize input to array
    const inputShapes: ShapeData[] = Array.isArray(input) ? input : [input];
    
    const countInput = this.getInputData(1);
    const radiusInput = this.getInputData(2);
    const xInput = this.getInputData(3);
    const yInput = this.getInputData(4);
    
    const count = Math.max(1, Math.floor(Math.abs(countInput !== undefined && countInput !== null ? countInput : this.properties.count)));
    const radius = radiusInput !== undefined && radiusInput !== null ? Math.abs(radiusInput) : this.properties.radius;
    
    // Center X/Y inputs position the entire circular array group
    // Default to local (0,0) - array positions relative to parent group
    // Only use canvas center if explicitly needed for standalone rendering
    const cx = xInput !== undefined && xInput !== null ? xInput : 0;
    const cy = yInput !== undefined && yInput !== null ? yInput : 0;
    
    const startAngle = this.properties.startAngle * (Math.PI / 180);
    const endAngle = this.properties.endAngle * (Math.PI / 180);
    const angleRange = endAngle - startAngle;

    // Check if it's a full circle (avoid overlap at start/end)
    const isFullCircle = Math.abs(angleRange) >= 2 * Math.PI - 0.01;

    // Create groups for each position in the circular array
    const groups: ShapeData[] = [];
    
    for (let i = 0; i < count; i++) {
      let angle;
      if (isFullCircle) {
        // For full circle, divide evenly without overlap
        angle = startAngle + (i / count) * angleRange;
      } else {
        // For arc, include both endpoints
        const t = count === 1 ? 0 : i / (count - 1);
        angle = startAngle + angleRange * t;
      }
      
      const offsetX = radius * Math.cos(angle);
      const offsetY = radius * Math.sin(angle);

      // Create a group with transform for this position
      // Transform positions each copy relative to the array center (cx, cy)
      // Clone inputShapes to ensure each group has independent data
      const group: ShapeData = {
        type: "group",
        isGroup: true,
        children: JSON.parse(JSON.stringify(inputShapes)), // Deep clone
        transform: `translate(${cx + offsetX}, ${cy + offsetY})`,
        zIndex: 0
      };
      
      groups.push(group);
    }

    this.setOutputData(0, groups);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const count = Math.max(1, Math.floor(Math.abs(this.getInputData(1) ?? this.properties.count)));
    const radius = Math.abs(this.getInputData(2) ?? this.properties.radius);
    
    ctx.fillStyle = "#67e8f9";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${count} along circle r=${radius.toFixed(0)}`, this.size[0] * 0.5, this.size[1] * 0.88);
  }
}
