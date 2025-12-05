import { useState, useCallback, useRef } from "react";
import { LGraph, LiteGraph, LGraphCanvas } from "litegraph.js";
import { GraphEditor } from "@/components/graph/GraphEditor";
import { Sidebar } from "@/components/graph/Sidebar";
import { Header } from "@/components/graph/Header";
import { toast } from "sonner";

const Index = () => {
  const [isRunning, setIsRunning] = useState(true);
  const graphRef = useRef<LGraph | null>(null);

  const handleGraphChange = useCallback((graph: LGraph) => {
    graphRef.current = graph;
    toast.success("Graph initialized", {
      description: "Try clicking on number nodes to change values!",
    });
  }, []);

  const handleToggleRun = useCallback(() => {
    if (graphRef.current) {
      if (isRunning) {
        graphRef.current.stop();
        toast.info("Graph execution stopped");
      } else {
        graphRef.current.start();
        toast.success("Graph running");
      }
      setIsRunning(!isRunning);
    }
  }, [isRunning]);

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
        isRunning={isRunning}
        onToggleRun={handleToggleRun}
        onReset={handleReset}
        onFitView={handleFitView}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onAddNode={handleAddNode} />
        
        <main className="flex-1 relative">
          <GraphEditor onGraphChange={handleGraphChange} />
          
          {/* Status indicator */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-card/80 backdrop-blur border border-border">
            <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
            <span className="text-xs font-mono text-muted-foreground">
              {isRunning ? "Running" : "Stopped"}
            </span>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
