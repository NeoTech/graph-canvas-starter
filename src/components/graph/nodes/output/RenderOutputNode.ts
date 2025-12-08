import { LGraphNode } from "litegraph.js";
import { emitVisualization, clearVisualizations, ShapeData } from "../utils/visualization";

export class RenderOutputNode extends LGraphNode {
  static title = "Render Output";
  static desc = "Outputs shapes to the SVG canvas";
  private hasCleared: boolean = false;

  constructor() {
    super("Render Output");
    this.addInput("Shape/Array", "shape,shape_array");
    this.addProperty("width", 1920, "number");
    this.addProperty("height", 1080, "number");
    this.addProperty("backgroundColor", "transparent", "string");
    
    // Initialize graph dimensions immediately
    if (this.graph) {
      (this.graph as any).renderWidth = this.properties.width;
      (this.graph as any).renderHeight = this.properties.height;
    }
    
    this.addWidget("number", "Width", 1920, (v: number) => {
      this.properties.width = Math.max(100, v);
      // Update graph dimensions immediately when widget changes
      if (this.graph) {
        (this.graph as any).renderWidth = this.properties.width;
      }
    }, { min: 100, max: 7680, step: 10 });
    this.addWidget("number", "Height", 1080, (v: number) => {
      this.properties.height = Math.max(100, v);
      // Update graph dimensions immediately when widget changes
      if (this.graph) {
        (this.graph as any).renderHeight = this.properties.height;
      }
    }, { min: 100, max: 4320, step: 10 });
    this.addWidget("text", "BG Color", "transparent", (v: string) => {
      this.properties.backgroundColor = v;
    });
    this.size = [200, 130];
    this.color = "#dc2626";
    this.bgcolor = "#7f1d1d";
  }

  onAdded() {
    // Ensure dimensions are set when node is added to graph
    if (this.graph) {
      (this.graph as any).renderWidth = this.properties.width;
      (this.graph as any).renderHeight = this.properties.height;
    }
  }

  onExecute() {
    // Store render dimensions on graph for nodes to access
    (this.graph as any).renderWidth = this.properties.width;
    (this.graph as any).renderHeight = this.properties.height;

    // Clear visualizations once at the start of execution cycle
    if (!this.hasCleared) {
      clearVisualizations();
      this.hasCleared = true;
      // Reset flag after a short delay for next cycle
      setTimeout(() => { this.hasCleared = false; }, 10);
    }

    const input = this.getInputData(0);
    if (!input) return;

    // Handle both single shapes and arrays
    const shapes = Array.isArray(input) ? input : [input];

    // Sort shapes by zIndex (lower values render first, higher values on top)
    const sortedShapes = [...shapes].sort((a: ShapeData, b: ShapeData) => {
      const aZ = a.zIndex ?? 0;
      const bZ = b.zIndex ?? 0;
      return aZ - bZ;
    });

    sortedShapes.forEach((shape: ShapeData, index: number) => {
      emitVisualization({
        type: shape.type,
        data: shape.data,
        // Include group properties for SVG group rendering
        isGroup: shape.isGroup,
        children: shape.children,
        transform: shape.transform,
        timestamp: Date.now() + index, // Add index to ensure unique timestamps
        canvasWidth: this.properties.width,
        canvasHeight: this.properties.height,
        backgroundColor: this.properties.backgroundColor,
      });
    });
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const input = this.getInputData(0);
    const count = input ? (Array.isArray(input) ? input.length : 1) : 0;
    
    ctx.fillStyle = "#fca5a5";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`Rendering ${count} shape${count !== 1 ? 's' : ''}`, this.size[0] * 0.5, this.size[1] * 0.65);
    ctx.fillText(`${this.properties.width}×${this.properties.height}`, this.size[0] * 0.5, this.size[1] * 0.85);
  }
}
