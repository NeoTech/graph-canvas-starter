import { LiteGraph } from "litegraph.js";

// Export visualization utilities
export { onVisualizationUpdate, onVisualizationClear } from "./utils/visualization";
export type { ShapeData } from "./utils/visualization";

// Import Math Nodes
import { NumberNode } from "./math/NumberNode";
import { AddNode } from "./math/AddNode";
import { SubtractNode } from "./math/SubtractNode";
import { MultiplyNode } from "./math/MultiplyNode";
import { DivideNode } from "./math/DivideNode";
import { ModuloNode } from "./math/ModuloNode";
import { PowerNode } from "./math/PowerNode";
import { AbsNode } from "./math/AbsNode";
import { FloorNode } from "./math/FloorNode";
import { CeilNode } from "./math/CeilNode";
import { RoundNode } from "./math/RoundNode";
import { RandomNode } from "./math/RandomNode";
import { MinNode } from "./math/MinNode";
import { MaxNode } from "./math/MaxNode";
import { SineNode } from "./math/SineNode";
import { CosineNode } from "./math/CosineNode";

// Import Shape Nodes
import { CircleVisualizerNode } from "./shapes/CircleNode";
import { RectangleVisualizerNode } from "./shapes/RectangleNode";
import { SpiralVisualizerNode } from "./shapes/SpiralNode";
import { WaveVisualizerNode } from "./shapes/WaveNode";
import { PolygonVisualizerNode } from "./shapes/PolygonNode";

// Import Pattern Nodes
import { PolarArrayNode } from "./patterns/PolarArrayNode";
import { GridArrayNode } from "./patterns/GridArrayNode";
import { CircularArrayNode } from "./patterns/CircularArrayNode";
import { MergeArraysNode } from "./patterns/MergeArraysNode";
import { ComposeShapesNode } from "./patterns/ComposeShapesNode";

// Import Output Nodes
import { ResultNode } from "./output/ResultNode";
import { RenderOutputNode } from "./output/RenderOutputNode";

/**
 * Register all custom nodes with LiteGraph
 * This function should be called once during application initialization
 */
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
  
  // Register shape nodes
  LiteGraph.registerNodeType("shapes/circle", CircleVisualizerNode);
  LiteGraph.registerNodeType("shapes/rectangle", RectangleVisualizerNode);
  LiteGraph.registerNodeType("shapes/spiral", SpiralVisualizerNode);
  LiteGraph.registerNodeType("shapes/wave", WaveVisualizerNode);
  LiteGraph.registerNodeType("shapes/polygon", PolygonVisualizerNode);
  
  // Register pattern nodes
  LiteGraph.registerNodeType("pattern/polar_array", PolarArrayNode);
  LiteGraph.registerNodeType("pattern/grid_array", GridArrayNode);
  LiteGraph.registerNodeType("pattern/circular_array", CircularArrayNode);
  LiteGraph.registerNodeType("pattern/merge_arrays", MergeArraysNode);
  LiteGraph.registerNodeType("pattern/compose_shapes", ComposeShapesNode);
  
  // Register output node
  LiteGraph.registerNodeType("output/render", RenderOutputNode);

  // Set node title colors for categories
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
