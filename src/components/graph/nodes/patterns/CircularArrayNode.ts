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

    // Determine how to handle input based on treatAsGroup property
    const treatAsGroup = this.properties.treatAsGroup;
    let inputShapes: (ShapeData | ShapeData[])[];
    
    if (Array.isArray(input) && treatAsGroup) {
      // Treat entire array as one group - wrap it
      inputShapes = [input];
    } else if (Array.isArray(input)) {
      // Treat each shape individually
      inputShapes = input;
    } else {
      // Single shape
      inputShapes = [input];
    }

    const countInput = this.getInputData(1);
    const radiusInput = this.getInputData(2);
    const xInput = this.getInputData(3);
    const yInput = this.getInputData(4);
    
    const count = Math.max(1, Math.floor(Math.abs(countInput !== undefined && countInput !== null ? countInput : this.properties.count)));
    const radius = radiusInput !== undefined && radiusInput !== null ? Math.abs(radiusInput) : this.properties.radius;
    // Get render canvas center from Render Output node
    const renderWidth = (this.graph as any)?.renderWidth || 1920;
    const renderHeight = (this.graph as any)?.renderHeight || 1080;
    // Use render canvas center by default, or input value if provided
    const cx = xInput !== undefined && xInput !== null ? xInput : renderWidth / 2;
    const cy = yInput !== undefined && yInput !== null ? yInput : renderHeight / 2;
    const startAngle = this.properties.startAngle * (Math.PI / 180);
    const endAngle = this.properties.endAngle * (Math.PI / 180);
    const angleRange = endAngle - startAngle;

    const shapes: ShapeData[] = [];

    // Check if it's a full circle (avoid overlap at start/end)
    const isFullCircle = Math.abs(angleRange) >= 2 * Math.PI - 0.01;

    // Apply circular array to each input shape (or group)
    inputShapes.forEach((shapeOrGroup: any) => {
      const isGroup = Array.isArray(shapeOrGroup);
      
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

        if (isGroup) {
          // Calculate the bounding box center of the group
          const groupCenter = this.calculateGroupCenter(shapeOrGroup);
          
          // Transform entire group relative to its center
          shapeOrGroup.forEach((shape: ShapeData) => {
            const relativeX = this.getShapeX(shape) - groupCenter.x;
            const relativeY = this.getShapeY(shape) - groupCenter.y;
            const transformedShape = this.transformShape(shape, cx + offsetX + relativeX, cy + offsetY + relativeY);
            shapes.push(transformedShape);
          });
        } else {
          // Transform single shape
          const transformedShape = this.transformShape(shapeOrGroup, cx + offsetX, cy + offsetY);
          shapes.push(transformedShape);
        }
      }
    });

    this.setOutputData(0, shapes);
  }

  calculateGroupCenter(shapes: ShapeData[]): { x: number; y: number } {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    shapes.forEach(shape => {
      if (shape.type === "circle") {
        const r = shape.data.radius || 0;
        minX = Math.min(minX, shape.data.x - r);
        minY = Math.min(minY, shape.data.y - r);
        maxX = Math.max(maxX, shape.data.x + r);
        maxY = Math.max(maxY, shape.data.y + r);
      } else if (shape.type === "rectangle") {
        minX = Math.min(minX, shape.data.x);
        minY = Math.min(minY, shape.data.y);
        maxX = Math.max(maxX, shape.data.x + shape.data.width);
        maxY = Math.max(maxY, shape.data.y + shape.data.height);
      } else if (shape.type === "polygon" && shape.data.points) {
        const points = shape.data.points.split(' ');
        points.forEach((point: string) => {
          const [x, y] = point.split(',').map(Number);
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        });
      }
    });

    return {
      x: minX + (maxX - minX) / 2,
      y: minY + (maxY - minY) / 2
    };
  }

  getShapeX(shape: ShapeData): number {
    if (shape.type === "circle") return shape.data.x;
    if (shape.type === "rectangle") return shape.data.x + shape.data.width / 2;
    if (shape.type === "polygon") return shape.data.centerX || 0;
    return 0;
  }

  getShapeY(shape: ShapeData): number {
    if (shape.type === "circle") return shape.data.y;
    if (shape.type === "rectangle") return shape.data.y + shape.data.height / 2;
    if (shape.type === "polygon") return shape.data.centerY || 0;
    return 0;
  }

  transformShape(shape: ShapeData, newX: number, newY: number): ShapeData {
    const transformed = JSON.parse(JSON.stringify(shape));
    
    if (shape.type === "circle") {
      transformed.data.x = newX;
      transformed.data.y = newY;
    } else if (shape.type === "rectangle") {
      transformed.data.x = newX - shape.data.width / 2;
      transformed.data.y = newY - shape.data.height / 2;
    } else if (shape.type === "polygon" && shape.data.points) {
      // Get original center
      const originalCenterX = shape.data.centerX || 0;
      const originalCenterY = shape.data.centerY || 0;
      
      // Transform each point
      const points = shape.data.points.split(' ');
      const transformedPoints = points.map((point: string) => {
        const [x, y] = point.split(',').map(Number);
        // Calculate offset from original center
        const dx = x - originalCenterX;
        const dy = y - originalCenterY;
        // Apply offset to new center
        return `${(newX + dx).toFixed(2)},${(newY + dy).toFixed(2)}`;
      });
      
      transformed.data.points = transformedPoints.join(' ');
      transformed.data.centerX = newX;
      transformed.data.centerY = newY;
    }

    return transformed;
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
