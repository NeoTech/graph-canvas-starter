import { LGraphNode } from "litegraph.js";
import { ShapeData } from "../utils/visualization";

export class MergeArraysNode extends LGraphNode {
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
