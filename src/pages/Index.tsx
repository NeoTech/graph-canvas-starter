import { useState, useCallback, useRef, useEffect } from "react";
import { LGraph, LiteGraph, LGraphCanvas } from "litegraph.js";
import { GraphEditor } from "@/components/graph/GraphEditor";
import { Sidebar } from "@/components/graph/Sidebar";
import { Header } from "@/components/graph/Header";
import { VisualizationCanvas, VisualizationData } from "@/components/graph/VisualizationCanvas";
import { onVisualizationUpdate, onVisualizationClear } from "@/components/graph/nodes";
import { toast } from "sonner";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const Index = () => {
  const [visualizations, setVisualizations] = useState<VisualizationData[]>([]);
  const [canvasWidth, setCanvasWidth] = useState<number>(800);
  const [canvasHeight, setCanvasHeight] = useState<number>(600);
  const graphRef = useRef<LGraph | null>(null);
  const runOnceRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Subscribe to visualization updates
    const unsubscribe = onVisualizationUpdate((data: VisualizationData) => {
      setVisualizations(prev => {
        // Add new visualization with unique timestamp-based ID
        return [...prev, { ...data, id: `${data.type}_${data.timestamp}_${Math.random()}` }];
      });
    });

    // Subscribe to clear events
    const unsubscribeClear = onVisualizationClear(() => {
      setVisualizations([]);
    });

    return () => {
      unsubscribe();
      unsubscribeClear();
    };
  }, []);

  const handleGraphChange = useCallback((graph: LGraph) => {
    graphRef.current = graph;
    toast.success("Graph initialized", {
      description: "Add visualization nodes to see SVG output!",
    });
  }, []);

  const handleGraphReady = useCallback((runOnce: () => void) => {
    runOnceRef.current = runOnce;
  }, []);

  const handleUpdate = useCallback(() => {
    if (runOnceRef.current) {
      runOnceRef.current();
      toast.success("Graph updated");
    }
  }, []);

  const handleReset = useCallback(() => {
    window.location.reload();
  }, []);

  const handleFitView = useCallback(() => {
    // This would require access to the canvas instance
    toast.info("Use scroll wheel to zoom, drag to pan");
  }, []);

  const handleAddNode = useCallback((type: string) => {
    if (graphRef.current) {
      const node = LiteGraph.createNode(type);
      if (node) {
        // Position new node in the center-ish area
        node.pos = [300 + Math.random() * 100, 200 + Math.random() * 100];
        graphRef.current.add(node);
        toast.success(`Added ${type.split("/")[1]} node`);
      }
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <Header
        onUpdate={handleUpdate}
        onReset={handleReset}
        onFitView={handleFitView}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onAddNode={handleAddNode} />
        
        <main className="flex-1 relative overflow-hidden">
          <ResizablePanelGroup direction="vertical">
            {/* Visualization Canvas - Top */}
            <ResizablePanel defaultSize={50} minSize={20}>
              <VisualizationCanvas 
                visualizations={visualizations}
                onSizeChange={(width, height) => {
                  setCanvasWidth(width);
                  setCanvasHeight(height);
                }}
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Graph Editor - Bottom */}
            <ResizablePanel defaultSize={50} minSize={20}>
              <div className="relative h-full">
                <GraphEditor 
                  onGraphChange={handleGraphChange}
                  onGraphReady={handleGraphReady}
                  canvasWidth={canvasWidth}
                  canvasHeight={canvasHeight}
                />
                
                {/* Status indicator */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-card/80 backdrop-blur border border-border">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  <span className="text-xs font-mono text-muted-foreground">
                    Manual Update
                  </span>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>
    </div>
  );
};

export default Index;
