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
  onGraphReady?: (runOnce: () => void) => void;
  onRenderOutputPresent?: (isPresent: boolean) => void;
  onGraphStats?: (nodeCount: number, connectionCount: number) => void;
  canvasWidth?: number;
  canvasHeight?: number;
}

export const GraphEditor = ({ onGraphChange, onGraphReady, onRenderOutputPresent, onGraphStats, canvasWidth, canvasHeight }: GraphEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<LGraph | null>(null);
  const graphCanvasRef = useRef<LGraphCanvas | null>(null);
  const onRenderOutputPresentRef = useRef(onRenderOutputPresent);
  const onGraphStatsRef = useRef(onGraphStats);

  // Update ref when callback changes
  useEffect(() => {
    onRenderOutputPresentRef.current = onRenderOutputPresent;
  }, [onRenderOutputPresent]);

  // Update ref when callback changes
  useEffect(() => {
    onGraphStatsRef.current = onGraphStats;
  }, [onGraphStats]);

  const updateGraphStats = useCallback((graph: LGraph) => {
    if (!onGraphStatsRef.current) return;
    const nodes = (graph as any)._nodes || [];
    const connectionCount = graph.links ? Object.keys(graph.links).length : 0;
    onGraphStatsRef.current(nodes.length, connectionCount);
  }, []);

  const checkRenderOutputNode = useCallback((graph: LGraph) => {
    if (!onRenderOutputPresentRef.current) return;
    const nodes = (graph as any)._nodes || [];
    const hasRenderOutput = nodes.some((node: any) => node.type === "output/render");
    // Use requestAnimationFrame to defer the callback and prevent interference with node operations
    requestAnimationFrame(() => {
      if (onRenderOutputPresentRef.current) {
        onRenderOutputPresentRef.current(hasRenderOutput);
      }
      updateGraphStats(graph);
    });
  }, [updateGraphStats]);

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
    
    // Enable multi-selection drag behavior
    graphCanvas.allow_dragcanvas = true;
    graphCanvas.allow_dragnodes = true;
    (graphCanvas as any).multi_select = false; // Disable multi-select
    (graphCanvas as any).allow_interaction = true;

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
    
    // Store canvas dimensions on the graph for nodes to access
    (graph as any).canvasWidth = canvasWidth || 800;
    (graph as any).canvasHeight = canvasHeight || 600;
    
    // Disable search box (double-click)
    graphCanvas.allow_searchbox = false;
     
    // Disable multi-selection - override selectNodes to always work with single selection
    const originalSelectNodes = graphCanvas.selectNodes.bind(graphCanvas);
    graphCanvas.selectNodes = function(nodes: any) {
      // Only select the first node, ignore the rest
      if (nodes && nodes.length > 0) {
        return originalSelectNodes.call(this, [nodes[0]]);
      }
      return originalSelectNodes.call(this, nodes);
    };
    
    // Override processMouseDown to clear selections and prevent shift-click multi-select
    const originalProcessMouseDown = graphCanvas.processMouseDown.bind(graphCanvas);
    graphCanvas.processMouseDown = function(e: any) {
      // Remove shift key to prevent multi-select
      const modifiedEvent = { ...e, shiftKey: false };
      
      // Clear existing selections before processing
      if (this.selected_nodes && Object.keys(this.selected_nodes).length > 0) {
        for (const nodeId in this.selected_nodes) {
          if (this.selected_nodes[nodeId]) {
            this.selected_nodes[nodeId].is_selected = false;
          }
        }
        this.selected_nodes = {};
      }
      
      return originalProcessMouseDown.call(this, modifiedEvent);
    };
    
    // Handle keyboard events for deselection
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC key to deselect all nodes
      if (e.key === 'Escape') {
        if (graphCanvas.selected_nodes) {
          for (const key in graphCanvas.selected_nodes) {
            graphCanvas.selected_nodes[key].is_selected = false;
          }
          graphCanvas.selected_nodes = {};
        }
        graphCanvas.node_dragged = null;
        graphCanvas.node_over = null;
        graphCanvas.dragging_canvas = false;
        graphCanvas.setDirty(true, true);
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Add event listener to the canvas element to ensure it gets the event
    canvasRef.current.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleKeyDown);

    // Handle resize
    const handleResize = () => {
      if (canvasRef.current && graphCanvas) {
        canvasRef.current.width = canvasRef.current.parentElement?.clientWidth || 800;
        canvasRef.current.height = canvasRef.current.parentElement?.clientHeight || 600;
        graphCanvas.setDirty(true, true);
      }
    };

    handleResize();
    
    // Use ResizeObserver to detect canvas container size changes
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (canvasRef.current?.parentElement) {
      resizeObserver.observe(canvasRef.current.parentElement);
    }
    
    // Fallback for window resize
    window.addEventListener("resize", handleResize);

    // Don't auto-start graph - use manual updates instead
    // graph.start();

    // Create manual run function
    const runOnce = () => {
      if (graphRef.current) {
        graphRef.current.runStep(1);
        graphCanvas.setDirty(true, true);
      }
    };

    // Setup auto-update on graph changes
    const originalOnConnectionChange = (graph as any).onConnectionChange;
    (graph as any).onConnectionChange = function(type: any) {
      if (originalOnConnectionChange) originalOnConnectionChange.call(this, type);
      // Run once when connections change
      setTimeout(runOnce, 10);
    };

    // Hook into node additions to detect property and widget changes
    const originalOnNodeAdded = (graph as any).onNodeAdded;
    (graph as any).onNodeAdded = function(node: any) {
      if (originalOnNodeAdded) originalOnNodeAdded.call(this, node);
      
      // Check for render output node with a slight delay to ensure node is fully added
      setTimeout(() => checkRenderOutputNode(graph), 0);
      
      // Override onPropertyChanged for this node
      const originalOnPropertyChanged = node.onPropertyChanged;
      node.onPropertyChanged = function(name: any, value: any) {
        if (originalOnPropertyChanged) originalOnPropertyChanged.call(this, name, value);
        // Trigger update when property changes
        setTimeout(runOnce, 10);
      };

      // Hook into widgets if they exist
      if (node.widgets) {
        node.widgets.forEach((widget: any) => {
          const originalCallback = widget.callback;
          widget.callback = function(value: any, ...args: any[]) {
            if (originalCallback) originalCallback.call(this, value, ...args);
            // Trigger update when widget value changes
            setTimeout(runOnce, 10);
          };
        });
      }
    };

    // Also hook into existing nodes at initialization using computeExecutionOrder
    const nodes = (graph as any)._nodes || [];
    nodes.forEach((node: any) => {
      // Override onPropertyChanged
      const originalOnPropertyChanged = node.onPropertyChanged;
      node.onPropertyChanged = function(name: any, value: any) {
        if (originalOnPropertyChanged) originalOnPropertyChanged.call(this, name, value);
        setTimeout(runOnce, 10);
      };

      // Hook into widgets
      if (node.widgets) {
        node.widgets.forEach((widget: any) => {
          const originalCallback = widget.callback;
          widget.callback = function(value: any, ...args: any[]) {
            if (originalCallback) originalCallback.call(this, value, ...args);
            setTimeout(runOnce, 10);
          };
        });
      }
    });

    // Hook into node removal to check for render output
    const originalRemove = (graph as any).remove;
    (graph as any).remove = function(node: any) {
      const result = originalRemove.call(this, node);
      setTimeout(() => checkRenderOutputNode(graph), 0);
      return result;
    };

    // Initial check for render output node
    setTimeout(() => checkRenderOutputNode(graph), 0);

    // Notify parent of graph changes
    if (onGraphChange) {
      onGraphChange(graph);
    }

    // Provide runOnce to parent
    if (onGraphReady) {
      onGraphReady(runOnce);
    }

    // Redraw on execution
    (graph as any).onAfterExecute = () => {
      graphCanvas.setDirty(true, true);
    };

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("keydown", handleKeyDown);
      }
      window.removeEventListener("keydown", handleKeyDown);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      // graph.stop(); // Not needed since we're not auto-running
    };
  }, [onGraphChange, onGraphReady]);
  
  // Update canvas dimensions on the graph when they change
  useEffect(() => {
    if (graphRef.current) {
      (graphRef.current as any).canvasWidth = canvasWidth || 800;
      (graphRef.current as any).canvasHeight = canvasHeight || 600;
    }
  }, [canvasWidth, canvasHeight]);

  return (
    <div className="relative w-full h-full bg-graph-bg overflow-hidden graph-editor">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        tabIndex={0}
        style={{ outline: 'none' }}
      />
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/20 via-transparent to-transparent" />
    </div>
  );
};
