import { LGraphNode } from "litegraph.js";
import { ShapeData } from "../utils/visualization";

export class WaveVisualizerNode extends LGraphNode {
  static title = "Wave";
  static desc = "Generates a sine wave";

  constructor() {
    super("Wave");
    this.addInput("X", "number");
    this.addInput("Y", "number");
    this.addInput("Amplitude", "number");
    this.addInput("Frequency", "number");
    this.addInput("Phase", "number");
    this.addInput("Z-Index", "number");
    this.addOutput("Shape", "shape");
    this.addProperty("x", 0, "number");
    this.addProperty("y", 0, "number");
    this.addProperty("amplitude", 50, "number");
    this.addProperty("frequency", 2, "number");
    this.addProperty("phase", 0, "number");
    this.addProperty("zIndex", 0, "number");
    this.addProperty("stroke", "#a855f7", "string");
    this.addWidget("number", "X", 0, (v: number) => {
      this.properties.x = v;
    });
    this.addWidget("number", "Y", 0, (v: number) => {
      this.properties.y = v;
    });
    this.addWidget("number", "Amplitude", 50, (v: number) => {
      this.properties.amplitude = v;
    });
    this.addWidget("number", "Frequency", 2, (v: number) => {
      this.properties.frequency = v;
    });
    this.addWidget("number", "Phase", 0, (v: number) => {
      this.properties.phase = v;
    });
    this.addWidget("number", "Z-Index", 0, (v: number) => {
      this.properties.zIndex = v;
    });
    this.size = [200, 270];
    this.color = "#7c3aed";
    this.bgcolor = "#5b21b6";
  }

  onExecute() {
    const xInput = this.getInputData(0);
    const yInput = this.getInputData(1);
    const amplitudeInput = this.getInputData(2);
    const frequencyInput = this.getInputData(3);
    const phaseInput = this.getInputData(4);
    const zIndexInput = this.getInputData(5);
    
    const x = xInput !== undefined && xInput !== null ? xInput : this.properties.x;
    const y = yInput !== undefined && yInput !== null ? yInput : this.properties.y;
    const amplitude = amplitudeInput !== undefined && amplitudeInput !== null ? amplitudeInput : this.properties.amplitude;
    const frequency = frequencyInput !== undefined && frequencyInput !== null ? frequencyInput : this.properties.frequency;
    const phase = phaseInput !== undefined && phaseInput !== null ? phaseInput : this.properties.phase;
    const zIndex = zIndexInput !== undefined && zIndexInput !== null ? zIndexInput : this.properties.zIndex;

    const shapeData: ShapeData = {
      type: "wave",
      data: {
        x,
        y,
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
    const amplitudeInput = this.getInputData(2);
    const frequencyInput = this.getInputData(3);
    
    const amp = Math.abs(amplitudeInput !== undefined && amplitudeInput !== null ? amplitudeInput : this.properties.amplitude);
    const freq = frequencyInput !== undefined && frequencyInput !== null ? frequencyInput : this.properties.frequency;
    
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`A=${amp.toFixed(0)} f=${freq.toFixed(1)}`, this.size[0] * 0.5, this.size[1] * 0.85);
  }
}
