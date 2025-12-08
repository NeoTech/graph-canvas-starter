import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Plus, Minus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LGraph } from "litegraph.js";

export interface VisualizationData {
  type: string;
  data?: any;                  // Optional for group types
  timestamp: number;
  id?: string;                 // Add unique ID for tracking
  canvasWidth?: number;        // Render canvas width from Render Output node
  canvasHeight?: number;       // Render canvas height from Render Output node
  backgroundColor?: string;    // Background color from Render Output node
  // Group properties
  isGroup?: boolean;           // True if this is a group container
  children?: any[];            // Child shapes within the group
  transform?: string;          // SVG transform attribute
}

interface VisualizationCanvasProps {
  visualizations: VisualizationData[];
  onSizeChange?: (width: number, height: number) => void;
  onFitViewReady?: (fitViewFn: () => void) => void;
  graph?: LGraph | null; // Graph reference for serialization
}

export const VisualizationCanvas = ({ visualizations, onSizeChange, onFitViewReady, graph }: VisualizationCanvasProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewBox, setViewBox] = useState("0 0 1920 1080");
  const [scale, setScale] = useState(1);
  const [renderDimensions, setRenderDimensions] = useState({ width: 1920, height: 1080 });
  const [backgroundColor, setBackgroundColor] = useState<string>("transparent");
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Extract render dimensions from visualizations
  useEffect(() => {
    if (visualizations.length > 0) {
      const firstViz = visualizations[0];
      if (firstViz.canvasWidth && firstViz.canvasHeight) {
        setRenderDimensions({
          width: firstViz.canvasWidth,
          height: firstViz.canvasHeight
        });
      }
      if (firstViz.backgroundColor !== undefined) {
        setBackgroundColor(firstViz.backgroundColor);
      }
    }
  }, [visualizations]);

  // Update viewBox based on render dimensions
  useEffect(() => {
    const updateViewBox = () => {
      // Use fixed render dimensions with scale and pan
      const width = renderDimensions.width;
      const height = renderDimensions.height;
      
      const scaledWidth = width / scale;
      const scaledHeight = height / scale;
      const offsetX = (width - scaledWidth) / 2 - pan.x / scale;
      const offsetY = (height - scaledHeight) / 2 - pan.y / scale;
      setViewBox(`${offsetX} ${offsetY} ${scaledWidth} ${scaledHeight}`);
      
      // Still notify parent for GraphEditor compatibility
      if (onSizeChange && containerRef.current) {
        onSizeChange(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    };

    updateViewBox();
  }, [scale, pan, renderDimensions, onSizeChange]);

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

  const handleFitView = () => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    // Calculate scale to fit render dimensions into viewport with some padding
    const padding = 50; // pixels of padding around the content
    const availableWidth = containerWidth - padding * 2;
    const availableHeight = containerHeight - padding * 2;
    
    const scaleX = availableWidth / renderDimensions.width;
    const scaleY = availableHeight / renderDimensions.height;
    
    // Use the smaller scale to ensure everything fits
    const newScale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 1x
    
    setScale(newScale);
    setPan({ x: 0, y: 0 }); // Reset pan to center
  };

  // Export SVG as file
  const handleExportSVG = () => {
    if (!svgRef.current) return;

    // Create a clean SVG with only render output content
    const exportSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    exportSvg.setAttribute("width", renderDimensions.width.toString());
    exportSvg.setAttribute("height", renderDimensions.height.toString());
    exportSvg.setAttribute("viewBox", `0 0 ${renderDimensions.width} ${renderDimensions.height}`);
    exportSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    
    // Copy only the render output content (bg-rect and shapes), exclude grid and decorative elements
    Array.from(svgRef.current.children).forEach(child => {
      const element = child as SVGElement;
      // Include bg-rect and all shapes, exclude defs (grid pattern) and grid-rect
      if (element.id === 'bg-rect' || (element.tagName !== 'defs' && element.id !== 'grid-rect')) {
        exportSvg.appendChild(element.cloneNode(true));
      }
    });
    
    // Serialize SVG to string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(exportSvg);
    
    // Create blob and download
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `visualization-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export SVG with embedded metadata (prepared for future graph integration)
  const handleExportSVGWithMetadata = () => {
    if (!svgRef.current) return;

    // Create a clean SVG with only render output content
    const exportSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    exportSvg.setAttribute("width", renderDimensions.width.toString());
    exportSvg.setAttribute("height", renderDimensions.height.toString());
    exportSvg.setAttribute("viewBox", `0 0 ${renderDimensions.width} ${renderDimensions.height}`);
    exportSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    
    // Serialize graph data if available
    let graphData = null;
    if (graph) {
      try {
        graphData = graph.serialize();
      } catch (error) {
        console.error("Failed to serialize graph:", error);
      }
    }
    
    // Create metadata element with graph JSON
    const metadata = document.createElementNS("http://www.w3.org/2000/svg", "metadata");
    const metadataContent = {
      exportDate: new Date().toISOString(),
      renderDimensions: renderDimensions,
      backgroundColor: backgroundColor,
      graphData: graphData, // Serialized graph JSON
      version: "1.0.0"
    };
    metadata.textContent = JSON.stringify(metadataContent, null, 2);
    exportSvg.appendChild(metadata);
    
    // Copy only the render output content (bg-rect and shapes), exclude grid and decorative elements
    Array.from(svgRef.current.children).forEach(child => {
      const element = child as SVGElement;
      // Include bg-rect and all shapes, exclude defs (grid pattern) and grid-rect
      if (element.id === 'bg-rect' || (element.tagName !== 'defs' && element.id !== 'grid-rect')) {
        exportSvg.appendChild(element.cloneNode(true));
      }
    });
    
    // Serialize and download
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(exportSvg);
    
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `visualization-with-metadata-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Expose fit view function to parent
  useEffect(() => {
    if (onFitViewReady) {
      onFitViewReady(handleFitView);
    }
  }, [onFitViewReady, renderDimensions]);

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

    // Clear existing content except the defs, grid, and background
    const children = Array.from(svgRef.current.children);
    children.forEach(child => {
      if (child.tagName !== 'defs' && child.id !== 'grid-rect' && child.id !== 'bg-rect') {
        svgRef.current!.removeChild(child);
      }
    });

    // Render all visualizations
    visualizations.forEach((viz) => {
      renderVisualization(svgRef.current!, viz);
    });
  }, [visualizations, backgroundColor]);

  // Helper function to append SVG elements in the correct order (after background)
  const appendShape = (svg: SVGSVGElement, element: SVGElement) => {
    // Always append at the end - the bg-rect is rendered first in JSX so shapes will be on top
    svg.appendChild(element);
  };

  const renderVisualization = (svg: SVGSVGElement, viz: VisualizationData) => {
    const { type, data } = viz;

    switch (type) {
      case "group":
        renderGroup(svg, viz);
        break;
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

  const renderGroup = (svg: SVGSVGElement, groupData: any) => {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    // Apply transform if provided
    if (groupData.transform) {
      group.setAttribute("transform", groupData.transform);
    }
    
    // Render children shapes within the group
    if (groupData.children && Array.isArray(groupData.children)) {
      groupData.children.forEach((child: any) => {
        renderShapeInGroup(group, child);
      });
    }
    
    appendShape(svg, group);
  };

  const renderShapeInGroup = (group: SVGGElement, shape: any) => {
    // If the shape is itself a group, recursively handle it
    if (shape.isGroup || shape.type === "group") {
      const nestedGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      if (shape.transform) {
        nestedGroup.setAttribute("transform", shape.transform);
      }
      if (shape.children && Array.isArray(shape.children)) {
        shape.children.forEach((child: any) => {
          renderShapeInGroup(nestedGroup, child);
        });
      }
      group.appendChild(nestedGroup);
      return;
    }

    // Render individual shape types
    const { type, data } = shape;
    let element: SVGElement | null = null;

    switch (type) {
      case "circle":
        element = createCircleElement(data);
        break;
      case "rectangle":
        element = createRectangleElement(data);
        break;
      case "polygon":
        element = createPolygonElement(data);
        break;
      case "line":
        element = createLineElement(data);
        break;
      case "path":
        element = createPathElement(data);
        break;
      case "spiral":
        element = createSpiralElement(data);
        break;
      case "wave":
        element = createWaveElement(data);
        break;
      default:
        console.warn(`Unknown shape type in group: ${type}`);
    }

    if (element) {
      group.appendChild(element);
    }
  };

  const createCircleElement = (data: any): SVGCircleElement => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", String(data.x || 0));
    circle.setAttribute("cy", String(data.y || 0));
    circle.setAttribute("r", String(data.radius || 50));
    circle.setAttribute("fill", data.fill || "#22d3ee");
    circle.setAttribute("fill-opacity", String(data.opacity || 0.6));
    circle.setAttribute("stroke", data.stroke || "#0891b2");
    circle.setAttribute("stroke-width", String(data.strokeWidth || 2));
    return circle;
  };

  const createRectangleElement = (data: any): SVGRectElement => {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", String(data.x || 0));
    rect.setAttribute("y", String(data.y || 0));
    rect.setAttribute("width", String(data.width || 100));
    rect.setAttribute("height", String(data.height || 100));
    rect.setAttribute("fill", data.fill || "#a855f7");
    rect.setAttribute("fill-opacity", String(data.opacity || 0.6));
    rect.setAttribute("stroke", data.stroke || "#7c3aed");
    rect.setAttribute("stroke-width", String(data.strokeWidth || 2));
    if (data.rx) rect.setAttribute("rx", String(data.rx));
    return rect;
  };

  const createPolygonElement = (data: any): SVGPolygonElement => {
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", data.points || "0,0");
    polygon.setAttribute("fill", data.fill || "#34d399");
    polygon.setAttribute("fill-opacity", String(data.opacity || 0.6));
    polygon.setAttribute("stroke", data.stroke || "#0891b2");
    polygon.setAttribute("stroke-width", String(data.strokeWidth || 2));
    return polygon;
  };

  const createLineElement = (data: any): SVGLineElement => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(data.x1 || 0));
    line.setAttribute("y1", String(data.y1 || 0));
    line.setAttribute("x2", String(data.x2 || 100));
    line.setAttribute("y2", String(data.y2 || 100));
    line.setAttribute("stroke", data.stroke || "#22d3ee");
    line.setAttribute("stroke-width", String(data.strokeWidth || 2));
    return line;
  };

  const createPathElement = (data: any): SVGPathElement => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", data.d || "M 0 0");
    path.setAttribute("fill", data.fill || "none");
    path.setAttribute("stroke", data.stroke || "#22d3ee");
    path.setAttribute("stroke-width", String(data.strokeWidth || 2));
    return path;
  };

  const createSpiralElement = (data: any): SVGPathElement => {
    const { centerX = 0, centerY = 0, turns = 5, spacing = 10, points = 100 } = data;
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
    return path;
  };

  const createWaveElement = (data: any): SVGPathElement => {
    const { amplitude = 50, frequency = 2, phase = 0, points = 200, startX = 0, width = 400 } = data;
    let pathData = "";

    for (let i = 0; i <= points; i++) {
      const x = startX + (i / points) * width;
      const y = amplitude * Math.sin((i / points) * frequency * 2 * Math.PI + phase);
      pathData += (i === 0 ? "M" : " L") + ` ${x} ${y}`;
    }

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", data.stroke || "#22d3ee");
    path.setAttribute("stroke-width", String(data.strokeWidth || 2));
    return path;
  };

  const renderCircle = (svg: SVGSVGElement, data: any) => {
    appendShape(svg, createCircleElement(data));
  };

  const renderRectangle = (svg: SVGSVGElement, data: any) => {
    appendShape(svg, createRectangleElement(data));
  };

  const renderLine = (svg: SVGSVGElement, data: any) => {
    appendShape(svg, createLineElement(data));
  };

  const renderPath = (svg: SVGSVGElement, data: any) => {
    appendShape(svg, createPathElement(data));
  };

  const renderPolygon = (svg: SVGSVGElement, data: any) => {
    appendShape(svg, createPolygonElement(data));
  };

  const renderSpiral = (svg: SVGSVGElement, data: any) => {
    appendShape(svg, createSpiralElement(data));
  };

  const renderWave = (svg: SVGSVGElement, data: any) => {
    appendShape(svg, createWaveElement(data));
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                title="Export SVG"
              >
                <Download className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportSVG}>
                Export SVG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportSVGWithMetadata}>
                Export with Metadata
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          preserveAspectRatio="xMidYMid meet"
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
          
          {/* Background rectangle for the render canvas - rendered first so shapes are on top */}
          {backgroundColor !== "transparent" && (
            <rect 
              id="bg-rect"
              x="0" 
              y="0" 
              width={renderDimensions.width} 
              height={renderDimensions.height} 
              fill={backgroundColor}
            />
          )}
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
        {renderDimensions.width} × {renderDimensions.height} px • {Math.round(scale * 100)}% zoom
        <div className="text-[10px] opacity-60 mt-0.5">Ctrl+Scroll to zoom • Click & drag to pan</div>
      </div>
    </div>
  );
};
