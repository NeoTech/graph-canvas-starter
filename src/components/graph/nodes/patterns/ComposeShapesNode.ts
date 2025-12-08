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

    if (!shapeA && !shapeB) {
      this.setOutputData(0, []);
      return;
    }

    const aXInput = this.getInputData(2);
    const aYInput = this.getInputData(3);
    const bXInput = this.getInputData(4);
    const bYInput = this.getInputData(5);
    const composeXInput = this.getInputData(6);
    const composeYInput = this.getInputData(7);

    // Get render canvas dimensions for default center
    const renderWidth = (this.graph as any)?.renderWidth || 1920;
    const renderHeight = (this.graph as any)?.renderHeight || 1080;

    // A X/Y and B X/Y are offsets relative to compose position
    const aX = aXInput !== undefined && aXInput !== null ? aXInput : this.properties.aX;
    const aY = aYInput !== undefined && aYInput !== null ? aYInput : this.properties.aY;
    const bX = bXInput !== undefined && bXInput !== null ? bXInput : this.properties.bX;
    const bY = bYInput !== undefined && bYInput !== null ? bYInput : this.properties.bY;
    
    // Compose X/Y is the base position for the composition
    // If NOT explicitly connected, default to canvas center for global positioning
    // If connected (even to 0), use that value for explicit positioning
    const hasComposeInput = composeXInput !== undefined && composeXInput !== null && 
                           composeYInput !== undefined && composeYInput !== null;
    
    // When compose inputs are connected, use them (allows explicit 0,0 positioning)
    // When not connected, default to canvas center (for standalone rendering)
    const composeX = hasComposeInput ? composeXInput : renderWidth / 2;
    const composeY = hasComposeInput ? composeYInput : renderHeight / 2;

    const composed: ShapeData[] = [];

    // Handle Shape A
    // ComposeShapes ONLY deals with group positioning via wrapper group
    // If input is already groups (from array), wrap all in one parent group with transform
    if (shapeA) {
      const shapesA = Array.isArray(shapeA) ? shapeA : [shapeA];
      
      // Create a wrapper group that applies the compose transform
      // This group contains all input shapes/groups as children
      const groupA: ShapeData = {
        type: "group",
        isGroup: true,
        children: shapesA,
        // Position entire input (whether shapes or groups) at compose position + A offsets
        transform: `translate(${composeX + aX}, ${composeY + aY})`,
        zIndex: 0
      };
      composed.push(groupA);
    }

    // Handle Shape B
    if (shapeB) {
      const shapesB = Array.isArray(shapeB) ? shapeB : [shapeB];
      
      const groupB: ShapeData = {
        type: "group",
        isGroup: true,
        children: shapesB,
        // Position entire input at compose position + B offsets
        transform: `translate(${composeX + bX}, ${composeY + bY})`,
        zIndex: 0
      };
      composed.push(groupB);
    }

    this.setOutputData(0, composed);
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
