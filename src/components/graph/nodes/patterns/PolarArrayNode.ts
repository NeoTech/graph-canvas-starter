import { LGraphNode } from "litegraph.js";
import { ShapeData } from "../utils/visualization";

export class PolarArrayNode extends LGraphNode {
  static title = "Polar Array";
  static desc = "Arranges shapes in a circular pattern";

  constructor() {
    super("Polar Array");
    this.addInput("Shape", "shape,shape_array");
    this.addInput("Count", "number");
    this.addInput("Radius", "number");
    this.addInput("Center X", "number");
    this.addInput("Center Y", "number");
    this.addOutput("Shapes", "shape_array");
    this.addProperty("centerX", 0, "number");
    this.addProperty("centerY", 0, "number");
    this.addProperty("count", 8, "number");
    this.addProperty("radius", 120, "number");
    this.addProperty("rotation", 0, "number");
    this.addProperty("treatAsGroup", true, "boolean");
    this.addWidget("number", "Center X", 0, (v: number) => {
      this.properties.centerX = v;
    });
    this.addWidget("number", "Center Y", 0, (v: number) => {
      this.properties.centerY = v;
    });
    this.addWidget("number", "Count", 8, (v: number) => {
      this.properties.count = v;
    });
    this.addWidget("number", "Radius", 120, (v: number) => {
      this.properties.radius = v;
    });
    this.addWidget("toggle", "Treat As Group", this.properties.treatAsGroup, (v: any) => {
      this.properties.treatAsGroup = v;
    });
    this.size = [220, 250];
    this.color = "#c026d3";
    this.bgcolor = "#86198f";
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
    const radius = Math.abs(radiusInput !== undefined && radiusInput !== null ? radiusInput : this.properties.radius);
    
    // CRITICAL: Default to local (0,0), NOT canvas center
    // Only ComposeShapes should default to canvas center
    const cx = xInput !== undefined && xInput !== null ? xInput : this.properties.centerX;
    const cy = yInput !== undefined && yInput !== null ? yInput : this.properties.centerY;
    const rotation = this.properties.rotation * (Math.PI / 180);

    const shapes: ShapeData[] = [];

    // Apply polar array to each input shape (or group)
    inputShapes.forEach((shapeOrGroup: any) => {
      const isGroup = Array.isArray(shapeOrGroup);
      
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI + rotation;
        const offsetX = radius * Math.cos(angle);
        const offsetY = radius * Math.sin(angle);

        if (isGroup) {
          // Calculate the bounding box center of the group
          const groupCenter = this.calculateGroupCenter(shapeOrGroup);
          
          // Transform entire group relative to its center
          shapeOrGroup.forEach((shape: ShapeData) => {
            const relativeX = this.getShapeX(shape) - groupCenter.x;
            const relativeY = this.getShapeY(shape) - groupCenter.y;
            const transformedShape = this.transformShape(shape, cx + offsetX + relativeX, cy + offsetY + relativeY, angle);
            shapes.push(transformedShape);
          });
        } else {
          // Transform single shape
          const transformedShape = this.transformShape(shapeOrGroup, cx + offsetX, cy + offsetY, angle);
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

  transformShape(shape: ShapeData, newX: number, newY: number, rotation: number): ShapeData {
    const transformed = JSON.parse(JSON.stringify(shape));
    
    if (shape.type === "circle") {
      transformed.data.x = newX;
      transformed.data.y = newY;
    } else if (shape.type === "rectangle") {
      transformed.data.x = newX - shape.data.width / 2;
      transformed.data.y = newY - shape.data.height / 2;
    } else if (shape.type === "polygon") {
      // Recalculate polygon points around new center
      const originalPoints = shape.data.points.split(' ');
      if (originalPoints.length > 0) {
        // Get original center from first shape or use stored center
        const centerX = shape.data.centerX || 200;
        const centerY = shape.data.centerY || 200;
        
        // Transform each point
        const transformedPoints = originalPoints.map((point: string) => {
          const [x, y] = point.split(',').map(Number);
          // Translate relative to new center
          const dx = x - centerX;
          const dy = y - centerY;
          const newPx = newX + dx;
          const newPy = newY + dy;
          return `${newPx.toFixed(2)},${newPy.toFixed(2)}`;
        });
        
        transformed.data.points = transformedPoints.join(' ');
        transformed.data.centerX = newX;
        transformed.data.centerY = newY;
      }
    } else if (shape.type === "spiral") {
      transformed.data.centerX = newX;
      transformed.data.centerY = newY;
    } else if (shape.type === "wave") {
      // Offset the wave's start position
      transformed.data.startX = (shape.data.startX || 0) + (newX - 200);
    }

    return transformed;
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const count = Math.max(1, Math.floor(Math.abs(this.getInputData(1) ?? this.properties.count)));
    const radius = Math.abs(this.getInputData(2) ?? this.properties.radius);
    
    ctx.fillStyle = "#e879f9";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${count} copies @ r=${radius.toFixed(0)}`, this.size[0] * 0.5, this.size[1] * 0.85);
  }
}
