import { LGraphNode } from "litegraph.js";

export class ResultNode extends LGraphNode {
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

    // Format the display value with max 3 decimal places
    let displayText = String(this.displayValue.toFixed(3));
    
    // Remove trailing zeros after decimal point
    if (displayText.includes('.')) {
      displayText = displayText.replace(/\.?0+$/, '');
    }

    // Draw result value
    ctx.fillStyle = "#34d399";
    ctx.font = "bold 24px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Check if text is too wide and adjust font size if needed
    const maxWidth = this.size[0] - 30;
    let fontSize = 24;
    ctx.font = `bold ${fontSize}px JetBrains Mono, monospace`;
    
    while (ctx.measureText(displayText).width > maxWidth && fontSize > 12) {
      fontSize -= 2;
      ctx.font = `bold ${fontSize}px JetBrains Mono, monospace`;
    }
    
    ctx.fillText(
      displayText,
      this.size[0] * 0.5,
      50
    );
  }
}
