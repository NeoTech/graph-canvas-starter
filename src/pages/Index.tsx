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
  const [hasRenderOutput, setHasRenderOutput] = useState<boolean>(false);
  const [nodeCount, setNodeCount] = useState<number>(0);
  const [connectionCount, setConnectionCount] = useState<number>(0);
  const graphRef = useRef<LGraph | null>(null);
  const runOnceRef = useRef<(() => void) | null>(null);
  const fitViewRef = useRef<(() => void) | null>(null);

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
    
    // Update statistics
    setNodeCount((graph as any)._nodes?.length || 0);
    setConnectionCount(graph.links ? Object.keys(graph.links).length : 0);
    
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
      
      // Update statistics after graph execution
      if (graphRef.current) {
        setNodeCount((graphRef.current as any)._nodes?.length || 0);
        setConnectionCount(graphRef.current.links ? Object.keys(graphRef.current.links).length : 0);
      }
      
      toast.success("Graph updated");
    }
  }, []);

  const handleReset = useCallback(() => {
    window.location.reload();
  }, []);

  const handleFitView = useCallback(() => {
    if (fitViewRef.current) {
      fitViewRef.current();
      toast.success("View fitted to canvas");
    }
  }, []);

  const handleFitViewReady = useCallback((fitViewFn: () => void) => {
    fitViewRef.current = fitViewFn;
  }, []);

  const handleRenderOutputPresent = useCallback((isPresent: boolean) => {
    setHasRenderOutput(isPresent);
  }, []);

  const handleGraphStats = useCallback((nodeCount: number, connectionCount: number) => {
    setNodeCount(nodeCount);
    setConnectionCount(connectionCount);
  }, []);

  const handleAddNode = useCallback((type: string) => {
    if (graphRef.current) {
      const node = LiteGraph.createNode(type);
      if (node) {
        // Position new node in the center-ish area
        node.pos = [300 + Math.random() * 100, 200 + Math.random() * 100];
        graphRef.current.add(node);
        
        // Update statistics
        setNodeCount((graphRef.current as any)._nodes?.length || 0);
        setConnectionCount(graphRef.current.links ? Object.keys(graphRef.current.links).length : 0);
        
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
            {/* Graph Editor - First in DOM, controls resize behavior */}
            <ResizablePanel defaultSize={hasRenderOutput ? 50 : 100} minSize={20}>
              <div className="relative h-full flex flex-col">
                <div className="flex-1 overflow-hidden">
                  <GraphEditor 
                    onGraphChange={handleGraphChange}
                    onGraphReady={handleGraphReady}
                    onRenderOutputPresent={handleRenderOutputPresent}
                    onGraphStats={handleGraphStats}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                  />
                </div>
                
                {/* Status Bar - Bottom */}
                <div className="h-8 border-t border-border bg-card/95 backdrop-blur flex items-center justify-between px-4 text-xs">
                  {/* Left side - Graph statistics */}
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="font-mono">
                        <span className="font-semibold text-foreground">{nodeCount}</span> nodes
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span className="font-mono">
                        <span className="font-semibold text-foreground">{visualizations.length}</span> shapes
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="font-mono">
                        <span className="font-semibold text-foreground">{connectionCount}</span> connections
                      </span>
                    </div>
                  </div>
                  
                  {/* Right side - Messages and status */}
                  <div className="flex items-center gap-3">
                    {!hasRenderOutput ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>Add a <span className="font-semibold text-foreground">Render Output</span> node to see visualization canvas</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-mono text-muted-foreground">Ready to render</span>
                      </div>
                    )}
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                      <span className="font-mono">Manual Update</span>
                    </div>
                  </div>
                </div>
              </div>
            </ResizablePanel>
            
            {/* Visualization Canvas - Second in DOM */}
            {hasRenderOutput && (
              <>
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={50} minSize={20}>
                  <VisualizationCanvas 
                    visualizations={visualizations}
                    onSizeChange={(width, height) => {
                      setCanvasWidth(width);
                      setCanvasHeight(height);
                    }}
                    onFitViewReady={handleFitViewReady}
                    graph={graphRef.current}
                  />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </main>
      </div>
    </div>
  );
};

export default Index;
