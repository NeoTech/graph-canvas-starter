import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface VisualizationData {
  type: string;
  data: any;
  timestamp: number;
  id?: string; // Add unique ID for tracking
}

interface VisualizationCanvasProps {
  visualizations: VisualizationData[];
  onSizeChange?: (width: number, height: number) => void;
}

export const VisualizationCanvas = ({ visualizations, onSizeChange }: VisualizationCanvasProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewBox, setViewBox] = useState("0 0 800 400");
  const [scale, setScale] = useState(1);
  const baseViewBoxRef = useRef({ width: 800, height: 400 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Update viewBox based on container size
  useEffect(() => {
    const updateViewBox = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        // Store base dimensions
        baseViewBoxRef.current = { width, height };
        // Apply current scale and pan to viewBox
        const scaledWidth = width / scale;
        const scaledHeight = height / scale;
        const offsetX = (width - scaledWidth) / 2 - pan.x / scale;
        const offsetY = (height - scaledHeight) / 2 - pan.y / scale;
        setViewBox(`${offsetX} ${offsetY} ${scaledWidth} ${scaledHeight}`);
        // Notify parent of size change
        if (onSizeChange) {
          onSizeChange(width, height);
        }
      }
    };

    updateViewBox();
    
    // Use ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(() => {
      updateViewBox();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Fallback for window resize
    window.addEventListener('resize', updateViewBox);
    
    // Also update when expansion state changes
    const timeoutId = setTimeout(updateViewBox, 100);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateViewBox);
      clearTimeout(timeoutId);
    };
  }, [isExpanded, onSizeChange, scale, pan]);

  // Handle mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setScale(prev => Math.max(0.1, Math.min(5, prev + delta)));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const handleZoomIn = () => {
    setScale(prev => Math.min(5, prev + 0.2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(0.1, prev - 0.2));
  };

  const handleResetZoom = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  // Handle pan/drag
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only start dragging if clicking on the background (not on UI elements)
    if (e.target === containerRef.current || (e.target as HTMLElement).closest('svg')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear existing content except the defs and grid
    const children = Array.from(svgRef.current.children);
    children.forEach(child => {
      if (child.tagName !== 'defs' && child.id !== 'grid-rect') {
        svgRef.current!.removeChild(child);
      }
    });

    // Render all visualizations
    visualizations.forEach((viz) => {
      renderVisualization(svgRef.current!, viz);
    });
  }, [visualizations]);

  const renderVisualization = (svg: SVGSVGElement, viz: VisualizationData) => {
    const { type, data } = viz;

    switch (type) {
      case "circle":
        renderCircle(svg, data);
        break;
      case "rectangle":
        renderRectangle(svg, data);
        break;
      case "line":
        renderLine(svg, data);
        break;
      case "path":
        renderPath(svg, data);
        break;
      case "polygon":
        renderPolygon(svg, data);
        break;
      case "spiral":
        renderSpiral(svg, data);
        break;
      case "wave":
        renderWave(svg, data);
        break;
      default:
        console.warn(`Unknown visualization type: ${type}`);
    }
  };

  const renderCircle = (svg: SVGSVGElement, data: any) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", String(data.x || 200));
    circle.setAttribute("cy", String(data.y || 200));
    circle.setAttribute("r", String(data.radius || 50));
    circle.setAttribute("fill", data.fill || "#22d3ee");
    circle.setAttribute("fill-opacity", String(data.opacity || 0.6));
    circle.setAttribute("stroke", data.stroke || "#0891b2");
    circle.setAttribute("stroke-width", String(data.strokeWidth || 2));
    svg.appendChild(circle);
  };

  const renderRectangle = (svg: SVGSVGElement, data: any) => {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", String(data.x || 100));
    rect.setAttribute("y", String(data.y || 100));
    rect.setAttribute("width", String(data.width || 100));
    rect.setAttribute("height", String(data.height || 100));
    rect.setAttribute("fill", data.fill || "#a855f7");
    rect.setAttribute("fill-opacity", String(data.opacity || 0.6));
    rect.setAttribute("stroke", data.stroke || "#7c3aed");
    rect.setAttribute("stroke-width", String(data.strokeWidth || 2));
    if (data.rx) rect.setAttribute("rx", String(data.rx));
    svg.appendChild(rect);
  };

  const renderLine = (svg: SVGSVGElement, data: any) => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(data.x1 || 50));
    line.setAttribute("y1", String(data.y1 || 50));
    line.setAttribute("x2", String(data.x2 || 350));
    line.setAttribute("y2", String(data.y2 || 350));
    line.setAttribute("stroke", data.stroke || "#22d3ee");
    line.setAttribute("stroke-width", String(data.strokeWidth || 2));
    svg.appendChild(line);
  };

  const renderPath = (svg: SVGSVGElement, data: any) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", data.d || "M 0 0");
    path.setAttribute("fill", data.fill || "none");
    path.setAttribute("stroke", data.stroke || "#22d3ee");
    path.setAttribute("stroke-width", String(data.strokeWidth || 2));
    svg.appendChild(path);
  };

  const renderPolygon = (svg: SVGSVGElement, data: any) => {
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", data.points || "200,50 250,150 150,150");
    polygon.setAttribute("fill", data.fill || "#34d399");
    polygon.setAttribute("fill-opacity", String(data.opacity || 0.6));
    polygon.setAttribute("stroke", data.stroke || "#059669");
    polygon.setAttribute("stroke-width", String(data.strokeWidth || 2));
    svg.appendChild(polygon);
  };

  const renderSpiral = (svg: SVGSVGElement, data: any) => {
    const { centerX = 200, centerY = 200, turns = 5, spacing = 10, points = 100 } = data;
    let pathData = `M ${centerX} ${centerY}`;

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * turns * 2 * Math.PI;
      const radius = (i / points) * spacing * turns;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      pathData += ` L ${x} ${y}`;
    }

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", data.stroke || "#22d3ee");
    path.setAttribute("stroke-width", String(data.strokeWidth || 2));
    svg.appendChild(path);
  };

  const renderWave = (svg: SVGSVGElement, data: any) => {
    const { amplitude = 50, frequency = 2, phase = 0, points = 200, startX = 0, width = 400 } = data;
    let pathData = "";

    for (let i = 0; i <= points; i++) {
      const x = startX + (i / points) * width;
      const y = 200 + amplitude * Math.sin((i / points) * frequency * 2 * Math.PI + phase);
      pathData += (i === 0 ? "M" : " L") + ` ${x} ${y}`;
    }

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", data.stroke || "#a855f7");
    path.setAttribute("stroke-width", String(data.strokeWidth || 2));
    svg.appendChild(path);
  };

  return (
    <div
      className={`bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 ${
        isExpanded ? "fixed inset-4 z-50" : "relative h-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-sidebar">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium">SVG Visualization Canvas</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Zoom controls */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-xs font-mono text-muted-foreground min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={handleResetZoom}
            title="Reset Zoom"
          >
            Reset
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div 
        ref={containerRef} 
        className={`bg-slate-950 relative ${isExpanded ? "h-[calc(100%-40px)]" : "h-[calc(100%-40px)]"} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          ref={svgRef}
          viewBox={viewBox}
          className="w-full h-full block"
          style={{ background: "radial-gradient(circle at center, #0f172a 0%, #020617 100%)" }}
          preserveAspectRatio="none"
        >
          {/* Grid pattern for reference */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#1e293b"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect id="grid-rect" width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Info */}
      {visualizations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Connect visualization nodes to see output</p>
            <p className="text-xs mt-1">Available: Circle, Rectangle, Line, Spiral, Wave</p>
          </div>
        </div>
      )}
      
      {/* Canvas dimensions indicator */}
      <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/50 text-xs text-muted-foreground font-mono pointer-events-none">
        {baseViewBoxRef.current.width} × {baseViewBoxRef.current.height} px • {Math.round(scale * 100)}% zoom
        <div className="text-[10px] opacity-60 mt-0.5">Ctrl+Scroll to zoom • Click & drag to pan</div>
      </div>
    </div>
  );
};
