import { LGraphNode } from "litegraph.js";
import { ShapeData } from "../utils/visualization";

export class GridArrayNode extends LGraphNode {
  static title = "Grid Array";
  static desc = "Arranges shapes in a grid pattern";

  constructor() {
    super("Grid Array");
    this.addInput("Shape", "shape,shape_array");
    this.addInput("Rows", "number");
    this.addInput("Columns", "number");
    this.addInput("Spacing X", "number");
    this.addInput("Spacing Y", "number");
    this.addInput("Start X", "number");
    this.addInput("Start Y", "number");
    this.addOutput("Shapes", "shape_array");
    this.addProperty("startX", 50, "number");
    this.addProperty("startY", 50, "number");
    this.addProperty("rows", 3, "number");
    this.addProperty("columns", 3, "number");
    this.addProperty("spacingX", 50, "number");
    this.addProperty("spacingY", 50, "number");
    this.addProperty("treatAsGroup", true, "boolean");
    this.addWidget("toggle", "Treat As Group", this.properties.treatAsGroup, (v: any) => {
      this.properties.treatAsGroup = v;
    });
    this.size = [220, 210];
    this.color = "#ea580c";
    this.bgcolor = "#9a3412";
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

    const rowsInput = this.getInputData(1);
    const columnsInput = this.getInputData(2);
    const spacingXInput = this.getInputData(3);
    const spacingYInput = this.getInputData(4);
    const startXInput = this.getInputData(5);
    const startYInput = this.getInputData(6);
    
    const rows = Math.max(1, Math.floor(Math.abs(rowsInput !== undefined && rowsInput !== null ? rowsInput : this.properties.rows)));
    const columns = Math.max(1, Math.floor(Math.abs(columnsInput !== undefined && columnsInput !== null ? columnsInput : this.properties.columns)));
    const spacingX = spacingXInput !== undefined && spacingXInput !== null ? spacingXInput : this.properties.spacingX;
    const spacingY = spacingYInput !== undefined && spacingYInput !== null ? spacingYInput : this.properties.spacingY;
    // Get render canvas center from Render Output node
    const renderWidth = (this.graph as any)?.renderWidth || 1920;
    const renderHeight = (this.graph as any)?.renderHeight || 1080;
    
    // Calculate grid dimensions
    const gridWidth = (columns - 1) * spacingX;
    const gridHeight = (rows - 1) * spacingY;
    
    // If Start X/Y inputs are provided, use them directly
    // Otherwise, center the grid on the render canvas
    let startX: number;
    let startY: number;
    
    if (startXInput !== undefined && startXInput !== null) {
      startX = startXInput;
    } else {
      // Center the grid: render canvas center - half of grid width
      startX = (renderWidth / 2) - (gridWidth / 2);
    }
    
    if (startYInput !== undefined && startYInput !== null) {
      startY = startYInput;
    } else {
      // Center the grid: render canvas center - half of grid height
      startY = (renderHeight / 2) - (gridHeight / 2);
    }

    const shapes: ShapeData[] = [];

    // Apply grid array to each input shape (or group)
    inputShapes.forEach((shapeOrGroup: any) => {
      const isGroup = Array.isArray(shapeOrGroup);
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const offsetX = col * spacingX;
          const offsetY = row * spacingY;

          if (isGroup) {
            // Calculate the bounding box center of the group
            const groupCenter = this.calculateGroupCenter(shapeOrGroup);
            
            // Transform entire group relative to its center
            shapeOrGroup.forEach((shape: ShapeData) => {
              const relativeX = this.getShapeX(shape) - groupCenter.x;
              const relativeY = this.getShapeY(shape) - groupCenter.y;
              const transformedShape = this.transformShape(shape, startX + offsetX + relativeX, startY + offsetY + relativeY);
              shapes.push(transformedShape);
            });
          } else {
            // Transform single shape
            const transformedShape = this.transformShape(shapeOrGroup, startX + offsetX, startY + offsetY);
            shapes.push(transformedShape);
          }
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
      // Circle x,y is the center - set it directly to the grid position
      transformed.data.x = newX;
      transformed.data.y = newY;
    } else if (shape.type === "rectangle") {
      // Rectangle x,y is the top-left corner
      // To center the rectangle at the grid position, offset by half dimensions
      transformed.data.x = newX - (shape.data.width / 2);
      transformed.data.y = newY - (shape.data.height / 2);
    } else if (shape.type === "polygon") {
      // For polygons, recalculate all points relative to the new position
      const oldCenterX = shape.data.centerX || 0;
      const oldCenterY = shape.data.centerY || 0;
      const deltaX = newX - oldCenterX;
      const deltaY = newY - oldCenterY;
      
      const points = shape.data.points.split(' ');
      const transformedPoints = points.map((point: string) => {
        const [x, y] = point.split(',').map(Number);
        return `${(x + deltaX).toFixed(2)},${(y + deltaY).toFixed(2)}`;
      });
      transformed.data.points = transformedPoints.join(' ');
      
      // Update center
      transformed.data.centerX = newX;
      transformed.data.centerY = newY;
    } else if (shape.type === "spiral" || shape.type === "wave") {
      // These use x,y as starting position
      transformed.data.x = newX;
      transformed.data.y = newY;
    }

    return transformed;
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const rows = Math.max(1, Math.floor(Math.abs(this.getInputData(1) ?? this.properties.rows)));
    const cols = Math.max(1, Math.floor(Math.abs(this.getInputData(2) ?? this.properties.columns)));
    
    ctx.fillStyle = "#fdba74";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${rows}×${cols} grid`, this.size[0] * 0.5, this.size[1] * 0.9);
  }
}
