import { LGraphNode } from "litegraph.js";
import { ShapeData } from "../utils/visualization";

export class WaveVisualizerNode extends LGraphNode {
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
