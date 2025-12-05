import { LiteGraph, LGraphNode } from "litegraph.js";

// Custom Number Input Node
class NumberNode extends LGraphNode {
  static title = "Number";
  static desc = "Outputs a number value";

  constructor() {
    super("Number");
    this.addOutput("value", "number");
    this.addProperty("value", 1, "number");
    this.addWidget("number", "value", 1, (v: number) => {
      this.properties.value = v;
    }, { min: -Infinity, max: Infinity, step: 1 });
    this.size = [180, 60];
    this.color = "#1a365d";
    this.bgcolor = "#0f172a";
  }

  onExecute() {
    this.setOutputData(0, this.properties.value);
  }
}

// Custom Multiply Node
class MultiplyNode extends LGraphNode {
  static title = "Multiply";
  static desc = "Multiplies two numbers";

  constructor() {
    super("Multiply");
    this.addInput("A", "number");
    this.addInput("B", "number");
    this.addOutput("Result", "number");
    this.size = [180, 70];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const a = this.getInputData(0) ?? 0;
    const b = this.getInputData(1) ?? 0;
    const result = a * b;
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const a = this.getInputData(0) ?? 0;
    const b = this.getInputData(1) ?? 0;
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `${a} × ${b} = ${a * b}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}

// Add Node
class AddNode extends LGraphNode {
  static title = "Add";
  static desc = "Adds two numbers";

  constructor() {
    super("Add");
    this.addInput("A", "number");
    this.addInput("B", "number");
    this.addOutput("Result", "number");
    this.size = [180, 70];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const a = this.getInputData(0) ?? 0;
    const b = this.getInputData(1) ?? 0;
    const result = a + b;
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const a = this.getInputData(0) ?? 0;
    const b = this.getInputData(1) ?? 0;
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `${a} + ${b} = ${a + b}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}

// Subtract Node
class SubtractNode extends LGraphNode {
  static title = "Subtract";
  static desc = "Subtracts two numbers";

  constructor() {
    super("Subtract");
    this.addInput("A", "number");
    this.addInput("B", "number");
    this.addOutput("Result", "number");
    this.size = [180, 70];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const a = this.getInputData(0) ?? 0;
    const b = this.getInputData(1) ?? 0;
    const result = a - b;
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const a = this.getInputData(0) ?? 0;
    const b = this.getInputData(1) ?? 0;
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `${a} - ${b} = ${a - b}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}

// Divide Node
class DivideNode extends LGraphNode {
  static title = "Divide";
  static desc = "Divides two numbers";

  constructor() {
    super("Divide");
    this.addInput("A", "number");
    this.addInput("B", "number");
    this.addOutput("Result", "number");
    this.size = [180, 70];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const a = this.getInputData(0) ?? 0;
    const b = this.getInputData(1) ?? 1;
    const result = b !== 0 ? a / b : 0;
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const a = this.getInputData(0) ?? 0;
    const b = this.getInputData(1) ?? 1;
    const result = b !== 0 ? a / b : 0;
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `${a} ÷ ${b} = ${result.toFixed(2)}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}

// Modulo Node
class ModuloNode extends LGraphNode {
  static title = "Modulo";
  static desc = "Calculates the remainder of division";

  constructor() {
    super("Modulo");
    this.addInput("A", "number");
    this.addInput("B", "number");
    this.addOutput("Result", "number");
    this.size = [180, 70];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const a = this.getInputData(0) ?? 0;
    const b = this.getInputData(1) ?? 1;
    const result = b !== 0 ? a % b : 0;
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const a = this.getInputData(0) ?? 0;
    const b = this.getInputData(1) ?? 1;
    const result = b !== 0 ? a % b : 0;
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `${a} % ${b} = ${result}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}

// Power Node
class PowerNode extends LGraphNode {
  static title = "Power";
  static desc = "Raises a number to a power";

  constructor() {
    super("Power");
    this.addInput("Base", "number");
    this.addInput("Exponent", "number");
    this.addOutput("Result", "number");
    this.size = [180, 70];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const base = this.getInputData(0) ?? 0;
    const exp = this.getInputData(1) ?? 2;
    const result = Math.pow(base, exp);
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const base = this.getInputData(0) ?? 0;
    const exp = this.getInputData(1) ?? 2;
    const result = Math.pow(base, exp);
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `${base}^${exp} = ${result.toFixed(2)}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}

// Absolute Value Node
class AbsNode extends LGraphNode {
  static title = "Absolute";
  static desc = "Returns the absolute value";

  constructor() {
    super("Absolute");
    this.addInput("Value", "number");
    this.addOutput("Result", "number");
    this.size = [180, 60];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const value = this.getInputData(0) ?? 0;
    const result = Math.abs(value);
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const value = this.getInputData(0) ?? 0;
    const result = Math.abs(value);
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `|${value}| = ${result}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}

// Floor Node
class FloorNode extends LGraphNode {
  static title = "Floor";
  static desc = "Rounds down to nearest integer";

  constructor() {
    super("Floor");
    this.addInput("Value", "number");
    this.addOutput("Result", "number");
    this.size = [180, 60];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const value = this.getInputData(0) ?? 0;
    const result = Math.floor(value);
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const value = this.getInputData(0) ?? 0;
    const result = Math.floor(value);
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `⌊${value}⌋ = ${result}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}

// Ceiling Node
class CeilNode extends LGraphNode {
  static title = "Ceiling";
  static desc = "Rounds up to nearest integer";

  constructor() {
    super("Ceiling");
    this.addInput("Value", "number");
    this.addOutput("Result", "number");
    this.size = [180, 60];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const value = this.getInputData(0) ?? 0;
    const result = Math.ceil(value);
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const value = this.getInputData(0) ?? 0;
    const result = Math.ceil(value);
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `⌈${value}⌉ = ${result}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}

// Round Node
class RoundNode extends LGraphNode {
  static title = "Round";
  static desc = "Rounds to nearest integer";

  constructor() {
    super("Round");
    this.addInput("Value", "number");
    this.addOutput("Result", "number");
    this.size = [180, 60];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const value = this.getInputData(0) ?? 0;
    const result = Math.round(value);
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const value = this.getInputData(0) ?? 0;
    const result = Math.round(value);
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `${value} ≈ ${result}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}

// Random Node
class RandomNode extends LGraphNode {
  static title = "Random";
  static desc = "Generates a random number";

  constructor() {
    super("Random");
    this.addInput("Min", "number");
    this.addInput("Max", "number");
    this.addOutput("Value", "number");
    this.addProperty("min", 0, "number");
    this.addProperty("max", 1, "number");
    this.size = [180, 70];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const min = this.getInputData(0) ?? this.properties.min;
    const max = this.getInputData(1) ?? this.properties.max;
    const result = Math.random() * (max - min) + min;
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const min = this.getInputData(0) ?? this.properties.min;
    const max = this.getInputData(1) ?? this.properties.max;
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `[${min}, ${max}]`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}

// Min Node
class MinNode extends LGraphNode {
  static title = "Min";
  static desc = "Returns the smaller of two numbers";

  constructor() {
    super("Min");
    this.addInput("A", "number");
    this.addInput("B", "number");
    this.addOutput("Result", "number");
    this.size = [180, 70];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const a = this.getInputData(0) ?? 0;
    const b = this.getInputData(1) ?? 0;
    const result = Math.min(a, b);
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const a = this.getInputData(0) ?? 0;
    const b = this.getInputData(1) ?? 0;
    const result = Math.min(a, b);
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `min(${a}, ${b}) = ${result}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}

// Max Node
class MaxNode extends LGraphNode {
  static title = "Max";
  static desc = "Returns the larger of two numbers";

  constructor() {
    super("Max");
    this.addInput("A", "number");
    this.addInput("B", "number");
    this.addOutput("Result", "number");
    this.size = [180, 70];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const a = this.getInputData(0) ?? 0;
    const b = this.getInputData(1) ?? 0;
    const result = Math.max(a, b);
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const a = this.getInputData(0) ?? 0;
    const b = this.getInputData(1) ?? 0;
    const result = Math.max(a, b);
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `max(${a}, ${b}) = ${result}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}

// Sine Node
class SineNode extends LGraphNode {
  static title = "Sine";
  static desc = "Calculates sine of angle in degrees";

  constructor() {
    super("Sine");
    this.addInput("Angle", "number");
    this.addOutput("Result", "number");
    this.size = [180, 60];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const angle = this.getInputData(0) ?? 0;
    const result = Math.sin((angle * Math.PI) / 180);
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const angle = this.getInputData(0) ?? 0;
    const result = Math.sin((angle * Math.PI) / 180);
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `sin(${angle}°) = ${result.toFixed(3)}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}

// Cosine Node
class CosineNode extends LGraphNode {
  static title = "Cosine";
  static desc = "Calculates cosine of angle in degrees";

  constructor() {
    super("Cosine");
    this.addInput("Angle", "number");
    this.addOutput("Result", "number");
    this.size = [180, 60];
    this.color = "#4c1d95";
    this.bgcolor = "#1e1b4b";
  }

  onExecute() {
    const angle = this.getInputData(0) ?? 0;
    const result = Math.cos((angle * Math.PI) / 180);
    this.setOutputData(0, result);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const angle = this.getInputData(0) ?? 0;
    const result = Math.cos((angle * Math.PI) / 180);
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      `cos(${angle}°) = ${result.toFixed(3)}`,
      this.size[0] * 0.5,
      this.size[1] * 0.75
    );
  }
}

// Custom Result Display Node
class ResultNode extends LGraphNode {
  static title = "Result";
  static desc = "Displays the result value";

  private displayValue: number = 0;

  constructor() {
    super("Result");
    this.addInput("value", "number");
    this.size = [200, 80];
    this.color = "#065f46";
    this.bgcolor = "#022c22";
  }

  onExecute() {
    const value = this.getInputData(0);
    if (value !== undefined) {
      this.displayValue = value;
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    // Draw result background
    ctx.fillStyle = "#0d3d30";
    ctx.roundRect(10, 30, this.size[0] - 20, 40, 6);
    ctx.fill();

    // Draw result value
    ctx.fillStyle = "#34d399";
    ctx.font = "bold 24px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      String(this.displayValue.toFixed(2)),
      this.size[0] * 0.5,
      50
    );
  }
}

// Visualization Event System
let visualizationCallbacks: ((data: any) => void)[] = [];
let clearCallbacks: (() => void)[] = [];

export function onVisualizationUpdate(callback: (data: any) => void) {
  visualizationCallbacks.push(callback);
  return () => {
    visualizationCallbacks = visualizationCallbacks.filter(cb => cb !== callback);
  };
}

export function onVisualizationClear(callback: () => void) {
  clearCallbacks.push(callback);
  return () => {
    clearCallbacks = clearCallbacks.filter(cb => cb !== callback);
  };
}

function emitVisualization(data: any) {
  visualizationCallbacks.forEach(cb => cb(data));
}

function clearVisualizations() {
  clearCallbacks.forEach(cb => cb());
}

// Shape data type for passing between nodes
interface ShapeData {
  type: string;
  data: any;
  zIndex?: number;
}

// Circle Visualization Node
class CircleVisualizerNode extends LGraphNode {
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

// Rectangle Visualization Node
class RectangleVisualizerNode extends LGraphNode {
  static title = "Rectangle";
  static desc = "Renders a rectangle";

  constructor() {
    super("Rectangle");
    this.addInput("X", "number");
    this.addInput("Y", "number");
    this.addInput("Width", "number");
    this.addInput("Height", "number");
    this.addInput("Z-Index", "number");
    this.addOutput("Shape", "shape");
    this.addProperty("x", 960, "number");
    this.addProperty("y", 540, "number");
    this.addProperty("width", 100, "number");
    this.addProperty("height", 100, "number");
    this.addProperty("zIndex", 0, "number");
    this.addProperty("fill", "#a855f7", "string");
    this.addProperty("stroke", "#7c3aed", "string");
    this.size = [200, 160];
    this.color = "#6d28d9";
    this.bgcolor = "#4c1d95";
  }

  onExecute() {
    const xInput = this.getInputData(0);
    const yInput = this.getInputData(1);
    const widthInput = this.getInputData(2);
    const heightInput = this.getInputData(3);
    const zIndexInput = this.getInputData(4);
    
    const x = xInput !== undefined && xInput !== null ? xInput : this.properties.x;
    const y = yInput !== undefined && yInput !== null ? yInput : this.properties.y;
    const width = widthInput !== undefined && widthInput !== null ? widthInput : this.properties.width;
    const height = heightInput !== undefined && heightInput !== null ? heightInput : this.properties.height;
    const zIndex = zIndexInput !== undefined && zIndexInput !== null ? zIndexInput : this.properties.zIndex;

    const shapeData: ShapeData = {
      type: "rectangle",
      data: {
        x,
        y,
        width: Math.abs(width),
        height: Math.abs(height),
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
    const wInput = this.getInputData(2);
    const hInput = this.getInputData(3);
    
    const w = Math.abs(wInput !== undefined && wInput !== null ? wInput : this.properties.width);
    const h = Math.abs(hInput !== undefined && hInput !== null ? hInput : this.properties.height);
    
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${w.toFixed(0)}×${h.toFixed(0)}`, this.size[0] * 0.5, this.size[1] * 0.85);
  }
}

// Spiral Visualization Node
class SpiralVisualizerNode extends LGraphNode {
  static title = "Spiral";
  static desc = "Generates a spiral pattern";

  constructor() {
    super("Spiral");
    this.addInput("Turns", "number");
    this.addInput("Spacing", "number");
    this.addInput("Z-Index", "number");
    this.addOutput("Shape", "shape");
    this.addProperty("centerX", 400, "number");
    this.addProperty("centerY", 200, "number");
    this.addProperty("turns", 5, "number");
    this.addProperty("spacing", 10, "number");
    this.addProperty("zIndex", 0, "number");
    this.addProperty("stroke", "#22d3ee", "string");
    this.size = [200, 130];
    this.color = "#0e7490";
    this.bgcolor = "#164e63";
  }

  onExecute() {
    const turns = this.getInputData(0) ?? this.properties.turns;
    const spacing = this.getInputData(1) ?? this.properties.spacing;
    const zIndexInput = this.getInputData(2);
    const zIndex = zIndexInput !== undefined && zIndexInput !== null ? zIndexInput : this.properties.zIndex;

    const shapeData: ShapeData = {
      type: "spiral",
      data: {
        centerX: this.properties.centerX,
        centerY: this.properties.centerY,
        turns: Math.max(0.5, Math.abs(turns)),
        spacing: Math.abs(spacing),
        points: 200,
        stroke: this.properties.stroke,
        strokeWidth: 2,
      },
      zIndex,
    };

    this.setOutputData(0, shapeData);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const turns = this.getInputData(0) ?? this.properties.turns;
    const spacing = this.getInputData(1) ?? this.properties.spacing;
    
    ctx.fillStyle = "#67e8f9";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${turns.toFixed(1)} turns, ${Math.abs(spacing).toFixed(0)}px`, this.size[0] * 0.5, this.size[1] * 0.8);
  }
}

// Wave Visualization Node
class WaveVisualizerNode extends LGraphNode {
  static title = "Wave";
  static desc = "Generates a sine wave";

  constructor() {
    super("Wave");
    this.addInput("Amplitude", "number");
    this.addInput("Frequency", "number");
    this.addInput("Phase", "number");
    this.addInput("Z-Index", "number");
    this.addOutput("Shape", "shape");
    this.addProperty("amplitude", 50, "number");
    this.addProperty("frequency", 2, "number");
    this.addProperty("phase", 0, "number");
    this.addProperty("zIndex", 0, "number");
    this.addProperty("stroke", "#a855f7", "string");
    this.size = [200, 150];
    this.color = "#7c3aed";
    this.bgcolor = "#5b21b6";
  }

  onExecute() {
    const amplitude = this.getInputData(0) ?? this.properties.amplitude;
    const frequency = this.getInputData(1) ?? this.properties.frequency;
    const phase = this.getInputData(2) ?? this.properties.phase;
    const zIndexInput = this.getInputData(3);
    const zIndex = zIndexInput !== undefined && zIndexInput !== null ? zIndexInput : this.properties.zIndex;

    const shapeData: ShapeData = {
      type: "wave",
      data: {
        amplitude: Math.abs(amplitude),
        frequency: Math.max(0.1, Math.abs(frequency)),
        phase,
        points: 200,
        startX: 0,
        width: 400,
        stroke: this.properties.stroke,
        strokeWidth: 2,
      },
      zIndex,
    };

    this.setOutputData(0, shapeData);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const amp = Math.abs(this.getInputData(0) ?? this.properties.amplitude);
    const freq = this.getInputData(1) ?? this.properties.frequency;
    
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`A=${amp.toFixed(0)} f=${freq.toFixed(1)}`, this.size[0] * 0.5, this.size[1] * 0.85);
  }
}

// Polygon Visualization Node
class PolygonVisualizerNode extends LGraphNode {
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

// Polar Array Pattern Node
class PolarArrayNode extends LGraphNode {
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
    this.addProperty("centerX", 400, "number");
    this.addProperty("centerY", 300, "number");
    this.addProperty("count", 8, "number");
    this.addProperty("radius", 120, "number");
    this.addProperty("rotation", 0, "number");
    this.addProperty("treatAsGroup", true, "boolean");
    this.addWidget("toggle", "Treat As Group", this.properties.treatAsGroup, (v: any) => {
      this.properties.treatAsGroup = v;
    });
    this.size = [220, 180];
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
    // Get render canvas center from Render Output node
    const renderWidth = (this.graph as any)?.renderWidth || 1920;
    const renderHeight = (this.graph as any)?.renderHeight || 1080;
    // Use render canvas center by default, or input value if provided
    const cx = xInput !== undefined && xInput !== null ? xInput : renderWidth / 2;
    const cy = yInput !== undefined && yInput !== null ? yInput : renderHeight / 2;
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

// Grid Array Pattern Node
class GridArrayNode extends LGraphNode {
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

// Circular Array Pattern Node
class CircularArrayNode extends LGraphNode {
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

// Merge Arrays Node - Combines multiple shape arrays into one
class MergeArraysNode extends LGraphNode {
  static title = "Merge Arrays";
  static desc = "Combines multiple shape arrays";

  constructor() {
    super("Merge Arrays");
    this.addInput("Array 1", "shape,shape_array");
    this.addInput("Array 2", "shape,shape_array");
    this.addInput("Array 3", "shape,shape_array");
    this.addOutput("Combined", "shape_array");
    this.size = [200, 100];
    this.color = "#7c3aed";
    this.bgcolor = "#5b21b6";
  }

  onExecute() {
    const input1 = this.getInputData(0);
    const input2 = this.getInputData(1);
    const input3 = this.getInputData(2);

    const combined: ShapeData[] = [];

    // Add all inputs to combined array
    if (input1) {
      const shapes1 = Array.isArray(input1) ? input1 : [input1];
      combined.push(...shapes1);
    }
    if (input2) {
      const shapes2 = Array.isArray(input2) ? input2 : [input2];
      combined.push(...shapes2);
    }
    if (input3) {
      const shapes3 = Array.isArray(input3) ? input3 : [input3];
      combined.push(...shapes3);
    }

    this.setOutputData(0, combined);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const input1 = this.getInputData(0);
    const input2 = this.getInputData(1);
    const input3 = this.getInputData(2);

    const count1 = input1 ? (Array.isArray(input1) ? input1.length : 1) : 0;
    const count2 = input2 ? (Array.isArray(input2) ? input2.length : 1) : 0;
    const count3 = input3 ? (Array.isArray(input3) ? input3.length : 1) : 0;
    const total = count1 + count2 + count3;

    ctx.fillStyle = "#c4b5fd";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${total} shapes combined`, this.size[0] * 0.5, this.size[1] * 0.85);
  }
}

// Compose Shapes Node - Positions two shapes relative to their combined bounding box
class ComposeShapesNode extends LGraphNode {
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

// Render Output Node - Final node that sends shapes to canvas
class RenderOutputNode extends LGraphNode {
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

// Register all custom nodes
export function registerCustomNodes() {
  // Register math nodes
  LiteGraph.registerNodeType("math/number", NumberNode);
  LiteGraph.registerNodeType("math/add", AddNode);
  LiteGraph.registerNodeType("math/subtract", SubtractNode);
  LiteGraph.registerNodeType("math/multiply", MultiplyNode);
  LiteGraph.registerNodeType("math/divide", DivideNode);
  LiteGraph.registerNodeType("math/modulo", ModuloNode);
  LiteGraph.registerNodeType("math/power", PowerNode);
  LiteGraph.registerNodeType("math/abs", AbsNode);
  LiteGraph.registerNodeType("math/floor", FloorNode);
  LiteGraph.registerNodeType("math/ceil", CeilNode);
  LiteGraph.registerNodeType("math/round", RoundNode);
  LiteGraph.registerNodeType("math/random", RandomNode);
  LiteGraph.registerNodeType("math/min", MinNode);
  LiteGraph.registerNodeType("math/max", MaxNode);
  LiteGraph.registerNodeType("math/sin", SineNode);
  LiteGraph.registerNodeType("math/cos", CosineNode);

  // Register display nodes
  LiteGraph.registerNodeType("display/result", ResultNode);
  
  // Register visualization nodes
  LiteGraph.registerNodeType("visualization/circle", CircleVisualizerNode);
  LiteGraph.registerNodeType("visualization/rectangle", RectangleVisualizerNode);
  LiteGraph.registerNodeType("visualization/spiral", SpiralVisualizerNode);
  LiteGraph.registerNodeType("visualization/wave", WaveVisualizerNode);
  LiteGraph.registerNodeType("visualization/polygon", PolygonVisualizerNode);
  
  // Register pattern/array nodes
  LiteGraph.registerNodeType("pattern/polar_array", PolarArrayNode);
  LiteGraph.registerNodeType("pattern/grid_array", GridArrayNode);
  LiteGraph.registerNodeType("pattern/circular_array", CircularArrayNode);
  LiteGraph.registerNodeType("pattern/merge_arrays", MergeArraysNode);
  LiteGraph.registerNodeType("pattern/compose_shapes", ComposeShapesNode);
  
  // Register output node
  LiteGraph.registerNodeType("output/render", RenderOutputNode);

  // Set node colors for categories
  (NumberNode as any).title_color = "#1e40af";
  (AddNode as any).title_color = "#7c3aed";
  (SubtractNode as any).title_color = "#7c3aed";
  (MultiplyNode as any).title_color = "#7c3aed";
  (DivideNode as any).title_color = "#7c3aed";
  (ModuloNode as any).title_color = "#7c3aed";
  (PowerNode as any).title_color = "#7c3aed";
  (AbsNode as any).title_color = "#7c3aed";
  (FloorNode as any).title_color = "#7c3aed";
  (CeilNode as any).title_color = "#7c3aed";
  (RoundNode as any).title_color = "#7c3aed";
  (RandomNode as any).title_color = "#7c3aed";
  (MinNode as any).title_color = "#7c3aed";
  (MaxNode as any).title_color = "#7c3aed";
  (SineNode as any).title_color = "#7c3aed";
  (CosineNode as any).title_color = "#7c3aed";
  (ResultNode as any).title_color = "#059669";
  (CircleVisualizerNode as any).title_color = "#0891b2";
  (RectangleVisualizerNode as any).title_color = "#7c3aed";
  (SpiralVisualizerNode as any).title_color = "#0891b2";
  (WaveVisualizerNode as any).title_color = "#7c3aed";
  (PolygonVisualizerNode as any).title_color = "#059669";
  (PolarArrayNode as any).title_color = "#c026d3";
  (GridArrayNode as any).title_color = "#ea580c";
  (CircularArrayNode as any).title_color = "#0891b2";
  (ComposeShapesNode as any).title_color = "#d946ef";
  (MergeArraysNode as any).title_color = "#7c3aed";
  (RenderOutputNode as any).title_color = "#dc2626";
}
