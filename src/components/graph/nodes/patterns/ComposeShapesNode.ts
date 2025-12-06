import { LGraphNode } from "litegraph.js";
import { ShapeData } from "../utils/visualization";

export class ComposeShapesNode extends LGraphNode {
  static title = "Compose Shapes";
  static desc = "Merge two shapes with relative positioning";

  constructor() {
    super("Compose Shapes");
    this.addInput("Shape A", "shape,shape_array");
    this.addInput("Shape B", "shape,shape_array");
    this.addInput("A X", "number");
    this.addInput("A Y", "number");
    this.addInput("B X", "number");
    this.addInput("B Y", "number");
    this.addInput("Compose X", "number");
    this.addInput("Compose Y", "number");
    this.addOutput("Composed", "shape_array");
    this.addProperty("aX", 0, "number");
    this.addProperty("aY", 0, "number");
    this.addProperty("bX", 100, "number");
    this.addProperty("bY", 0, "number");
    this.addProperty("composeX", 960, "number");
    this.addProperty("composeY", 540, "number");
    this.size = [220, 200];
    this.color = "#d946ef";
    this.bgcolor = "#a21caf";
  }

  onExecute() {
    const shapeA = this.getInputData(0);
    const shapeB = this.getInputData(1);

    if (!shapeA || !shapeB) {
      this.setOutputData(0, []);
      return;
    }

    const aXInput = this.getInputData(2);
    const aYInput = this.getInputData(3);
    const bXInput = this.getInputData(4);
    const bYInput = this.getInputData(5);
    const composeXInput = this.getInputData(6);
    const composeYInput = this.getInputData(7);

    const aX = aXInput !== undefined && aXInput !== null ? aXInput : this.properties.aX;
    const aY = aYInput !== undefined && aYInput !== null ? aYInput : this.properties.aY;
    const bX = bXInput !== undefined && bXInput !== null ? bXInput : this.properties.bX;
    const bY = bYInput !== undefined && bYInput !== null ? bYInput : this.properties.bY;
    const composeX = composeXInput !== undefined && composeXInput !== null ? composeXInput : this.properties.composeX;
    const composeY = composeYInput !== undefined && composeYInput !== null ? composeYInput : this.properties.composeY;

    // Convert single shapes to arrays
    const shapesA = Array.isArray(shapeA) ? shapeA : [shapeA];
    const shapesB = Array.isArray(shapeB) ? shapeB : [shapeB];

    // Calculate bounding box for all input shapes to find their center
    const boundsA = this.calculateBounds(shapesA);
    const boundsB = this.calculateBounds(shapesB);

    // Calculate centers of each shape group
    const centerA = {
      x: boundsA.minX + (boundsA.maxX - boundsA.minX) / 2,
      y: boundsA.minY + (boundsA.maxY - boundsA.minY) / 2
    };
    const centerB = {
      x: boundsB.minX + (boundsB.maxX - boundsB.minX) / 2,
      y: boundsB.minY + (boundsB.maxY - boundsB.minY) / 2
    };

    // Create composed array with offset shapes
    const composed: ShapeData[] = [];

    // Add shapes A with offset relative to their center, then offset by compose position
    shapesA.forEach((shape: ShapeData) => {
      const offsetShape = this.offsetShape(shape, composeX + aX - centerA.x, composeY + aY - centerA.y);
      composed.push(offsetShape);
    });

    // Add shapes B with offset relative to their center, then offset by compose position
    shapesB.forEach((shape: ShapeData) => {
      const offsetShape = this.offsetShape(shape, composeX + bX - centerB.x, composeY + bY - centerB.y);
      composed.push(offsetShape);
    });

    this.setOutputData(0, composed);
  }

  calculateBounds(shapes: ShapeData[]): { minX: number; minY: number; maxX: number; maxY: number } {
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

    return { minX, minY, maxX, maxY };
  }

  offsetShape(shape: ShapeData, offsetX: number, offsetY: number): ShapeData {
    const transformed = JSON.parse(JSON.stringify(shape));

    if (shape.type === "circle") {
      transformed.data.x = shape.data.x + offsetX;
      transformed.data.y = shape.data.y + offsetY;
    } else if (shape.type === "rectangle") {
      transformed.data.x = shape.data.x + offsetX;
      transformed.data.y = shape.data.y + offsetY;
    } else if (shape.type === "polygon" && shape.data.points) {
      const points = shape.data.points.split(' ');
      const transformedPoints = points.map((point: string) => {
        const [x, y] = point.split(',').map(Number);
        return `${(x + offsetX).toFixed(2)},${(y + offsetY).toFixed(2)}`;
      });
      transformed.data.points = transformedPoints.join(' ');
      
      if (shape.data.centerX !== undefined) {
        transformed.data.centerX = shape.data.centerX + offsetX;
        transformed.data.centerY = shape.data.centerY + offsetY;
      }
    } else if (shape.type === "spiral" || shape.type === "wave") {
      transformed.data.x = shape.data.x + offsetX;
      transformed.data.y = shape.data.y + offsetY;
    }

    return transformed;
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const aX = this.getInputData(2) ?? this.properties.aX;
    const aY = this.getInputData(3) ?? this.properties.aY;
    const bX = this.getInputData(4) ?? this.properties.bX;
    const bY = this.getInputData(5) ?? this.properties.bY;
    const composeX = this.getInputData(6) ?? this.properties.composeX;
    const composeY = this.getInputData(7) ?? this.properties.composeY;

    ctx.fillStyle = "#f0abfc";
    ctx.font = "9px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`@(${composeX.toFixed(0)},${composeY.toFixed(0)})`, this.size[0] * 0.5, this.size[1] * 0.88);
    ctx.fillText(`A:(${aX.toFixed(0)},${aY.toFixed(0)}) B:(${bX.toFixed(0)},${bY.toFixed(0)})`, this.size[0] * 0.5, this.size[1] * 0.96);
  }
}
