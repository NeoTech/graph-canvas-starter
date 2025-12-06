import { LGraphNode } from "litegraph.js";

export class NumberNode extends LGraphNode {
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
