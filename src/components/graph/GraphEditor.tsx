import { useEffect, useRef, useCallback } from "react";
import { LGraph, LGraphCanvas, LiteGraph } from "litegraph.js";
import "litegraph.js/css/litegraph.css";
import { registerCustomNodes } from "./nodes";

// Type augmentation for litegraph.js
declare module "litegraph.js" {
  interface LGraphCanvas {
    clear_background: boolean;
  }
}

interface GraphEditorProps {
  onGraphChange?: (graph: LGraph) => void;
}

export const GraphEditor = ({ onGraphChange }: GraphEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<LGraph | null>(null);
  const graphCanvasRef = useRef<LGraphCanvas | null>(null);

  const setupDefaultGraph = useCallback((graph: LGraph) => {
    // Create Value A node
    const valueA = LiteGraph.createNode("math/number");
    if (valueA) {
      valueA.pos = [100, 150];
      valueA.properties.value = 5;
      graph.add(valueA);
    }

    // Create Multiplier node
    const multiplier = LiteGraph.createNode("math/number");
    if (multiplier) {
      multiplier.pos = [100, 300];
      multiplier.properties.value = 3;
      graph.add(multiplier);
    }

    // Create Multiply node
    const multiply = LiteGraph.createNode("math/multiply");
    if (multiply) {
      multiply.pos = [350, 220];
      graph.add(multiply);
    }

    // Create Result node
    const result = LiteGraph.createNode("display/result");
    if (result) {
      result.pos = [600, 220];
      graph.add(result);
    }

    // Connect nodes
    if (valueA && multiply) {
      valueA.connect(0, multiply, 0);
    }
    if (multiplier && multiply) {
      multiplier.connect(0, multiply, 1);
    }
    if (multiply && result) {
      multiply.connect(0, result, 0);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Register custom nodes
    registerCustomNodes();

    // Create graph and canvas
    const graph = new LGraph();
    const graphCanvas = new LGraphCanvas(canvasRef.current, graph);

    // Configure canvas appearance
    (graphCanvas as any).background_image = undefined;
    (graphCanvas as any).clear_background_color = "#0a0a12";
    graphCanvas.render_shadows = true;
    graphCanvas.render_connection_arrows = false;
    graphCanvas.render_curved_connections = true;
    graphCanvas.render_connections_border = true;
    graphCanvas.connections_width = 3;

    // Configure default link colors
    LiteGraph.LINK_COLOR = "#22d3ee";
    LiteGraph.EVENT_LINK_COLOR = "#a855f7";
    LiteGraph.CONNECTING_LINK_COLOR = "#22d3ee";

    // Node style configuration
    LiteGraph.NODE_DEFAULT_COLOR = "#1e1e2e";
    LiteGraph.NODE_DEFAULT_BGCOLOR = "#181825";
    LiteGraph.NODE_DEFAULT_BOXCOLOR = "#22d3ee";
    LiteGraph.NODE_DEFAULT_SHAPE = "box";
    LiteGraph.NODE_TITLE_HEIGHT = 24;
    LiteGraph.NODE_SLOT_HEIGHT = 20;
    LiteGraph.NODE_WIDTH = 180;

    // Store refs
    graphRef.current = graph;
    graphCanvasRef.current = graphCanvas;

    // Setup default example graph
    setupDefaultGraph(graph);

    // Handle resize
    const handleResize = () => {
      if (canvasRef.current && graphCanvas) {
        canvasRef.current.width = canvasRef.current.parentElement?.clientWidth || 800;
        canvasRef.current.height = canvasRef.current.parentElement?.clientHeight || 600;
        graphCanvas.setDirty(true, true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Start graph execution
    graph.start();

    // Notify parent of graph changes
    if (onGraphChange) {
      onGraphChange(graph);
    }

    // Redraw on execution
    (graph as any).onAfterExecute = () => {
      graphCanvas.setDirty(true, true);
    };

    return () => {
      window.removeEventListener("resize", handleResize);
      graph.stop();
    };
  }, [setupDefaultGraph, onGraphChange]);

  return (
    <div className="relative w-full h-full bg-graph-bg overflow-hidden graph-editor">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/20 via-transparent to-transparent" />
    </div>
  );
};
