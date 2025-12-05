import { LiteGraph, LGraphNode } from "litegraph.js";

// Custom Number Input Node
class NumberNode extends LGraphNode {
  static title = "Number";
  static desc = "Outputs a number value";

  constructor() {
    super("Number");
    this.addOutput("value", "number");
    this.addProperty("value", 1, "number");
    this.size = [180, 60];
    this.color = "#1a365d";
    this.bgcolor = "#0f172a";
  }

  onExecute() {
    this.setOutputData(0, this.properties.value);
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(
      String(this.properties.value),
      this.size[0] * 0.5,
      this.size[1] * 0.65
    );
  }

  onMouseDown(e: MouseEvent, localPos: number[]) {
    if (localPos[1] > 20) {
      const newValue = prompt("Enter number value:", String(this.properties.value));
      if (newValue !== null) {
        const parsed = parseFloat(newValue);
        if (!isNaN(parsed)) {
          this.properties.value = parsed;
          this.setDirtyCanvas(true, true);
        }
      }
    }
    return false;
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

// Register all custom nodes
export function registerCustomNodes() {
  // Register nodes in their categories
  LiteGraph.registerNodeType("math/number", NumberNode);
  LiteGraph.registerNodeType("math/multiply", MultiplyNode);
  LiteGraph.registerNodeType("display/result", ResultNode);

  // Set node colors for categories
  (NumberNode as any).title_color = "#1e40af";
  (MultiplyNode as any).title_color = "#7c3aed";
  (ResultNode as any).title_color = "#059669";
}
