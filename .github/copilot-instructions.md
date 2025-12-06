# Copilot Instructions for Graph Canvas Visualization System

## Project Overview
A computational visualization system built with React + TypeScript + Vite that uses **LiteGraph.js** to create node-based graph editors for generating SVG visualizations. Users build computational graphs with math/shape nodes, then render them via a fixed-coordinate SVG canvas.

## Architecture: Two-Canvas System

### 1. Graph Editor Canvas (LiteGraph)
- **Location**: `src/components/graph/GraphEditor.tsx`
- **Purpose**: Interactive node graph editor using LiteGraph.js canvas
- **Key Pattern**: Manual execution model - graph only runs when "Update" button clicked
- Nodes communicate via data flow (inputs/outputs), not direct rendering

### 2. Visualization Canvas (SVG)
- **Location**: `src/components/graph/VisualizationCanvas.tsx`
- **Purpose**: Displays SVG output from graph execution
- **Critical Pattern**: Uses **fixed coordinate system** (not viewport-relative)
  - Render Output node defines canvas dimensions (default: 1920×1080)
  - Stored on graph as `(this.graph as any).renderWidth/renderHeight`
  - Pattern nodes (Polar Array, Grid Array, Circular Array) read these for centering shapes
- **ViewBox Strategy**: Calculated from `renderDimensions` with scale/pan transforms
- **SVG Rendering**: React JSX for static elements (defs, grid, bg-rect), DOM manipulation for shapes

## Critical Data Flow: Event-Driven Visualization

```typescript
// Pattern used throughout src/components/graph/nodes/index.ts
function emitVisualization(data: any) {
  visualizationCallbacks.forEach(cb => cb(data));
}

// Nodes output shapes as ShapeData objects:
interface ShapeData {
  type: string;      // "circle", "rectangle", "polygon", etc.
  data: any;         // Shape-specific properties
  zIndex?: number;   // Rendering order (lower = back, higher = front)
}
```

**Key Rules**:
1. Nodes never render directly - they emit `ShapeData` objects
2. Render Output node receives shapes, calls `emitVisualization()` with canvas dimensions
3. Index.tsx subscribes via `onVisualizationUpdate()`, updates React state
4. VisualizationCanvas.tsx renders shapes via `renderVisualization()` (DOM manipulation)

## Node Development Patterns

### Modular Node File Structure
The node system follows a **category-based organization** for maintainability:

```
src/components/graph/nodes/
├── index.ts                    # Central registration file
├── utils/
│   └── visualization.ts        # Event system, callbacks, ShapeData type
├── math/                       # 16 mathematical operation nodes
│   ├── NumberNode.ts          # Value input
│   ├── AddNode.ts             # Addition
│   ├── SubtractNode.ts        # Subtraction
│   ├── MultiplyNode.ts        # Multiplication
│   ├── DivideNode.ts          # Division
│   ├── ModuloNode.ts          # Modulo
│   ├── PowerNode.ts           # Exponentiation
│   ├── AbsNode.ts             # Absolute value
│   ├── FloorNode.ts           # Floor
│   ├── CeilNode.ts            # Ceiling
│   ├── RoundNode.ts           # Rounding
│   ├── RandomNode.ts          # Random number generation
│   ├── MinNode.ts             # Minimum
│   ├── MaxNode.ts             # Maximum
│   ├── SineNode.ts            # Sine
│   └── CosineNode.ts          # Cosine
├── shapes/                     # 5 geometric shape nodes
│   ├── CircleNode.ts          # Circle shape
│   ├── RectangleNode.ts       # Rectangle shape
│   ├── SpiralNode.ts          # Spiral pattern
│   ├── WaveNode.ts            # Wave pattern
│   └── PolygonNode.ts         # Polygon shape
├── patterns/                   # 5 array/pattern nodes
│   ├── PolarArrayNode.ts      # Polar array transformation
│   ├── GridArrayNode.ts       # Grid array transformation
│   ├── CircularArrayNode.ts   # Circular array transformation
│   ├── MergeArraysNode.ts     # Array merging
│   └── ComposeShapesNode.ts   # Shape composition
└── output/                     # 2 output nodes
    ├── ResultNode.ts          # Numeric result display
    └── RenderOutputNode.ts    # SVG canvas output
```

### Creating Custom Nodes (Individual Files)
```typescript
class MyShapeNode extends LGraphNode {
  static title = "My Shape";
  static desc = "Description";

  constructor() {
    super("My Shape");
    // Inputs: Allow dynamic values
    this.addInput("X", "number");
    this.addInput("Y", "number");
    
    // Outputs: Pass data to other nodes
    this.addOutput("Shape", "shape");
    
    // Properties: Store default values
    this.addProperty("x", 960, "number");  // Default to HD center
    this.addProperty("y", 540, "number");
    
    // Widgets: UI controls (update properties)
    this.addWidget("number", "X", 960, (v: number) => {
      this.properties.x = v;
    });
    
    // Styling (color codes indicate node type)
    this.color = "#1a365d";     // Title bar color
    this.bgcolor = "#0f172a";   // Background color
  }

  onExecute() {
    // Priority: Input > Property
    const x = this.getInputData(0) ?? this.properties.x;
    
    // Output ShapeData, never render directly
    this.setOutputData(0, {
      type: "myshape",
      data: { x, y, /* ... */ },
      zIndex: this.properties.zIndex ?? 0
    });
  }
}
```

### Pattern Nodes (Grid/Polar/Circular Array)
**Critical**: These nodes MUST use render dimensions for centering:
```typescript
onExecute() {
  // Read from graph (set by Render Output node)
  const renderWidth = (this.graph as any)?.renderWidth || 1920;
  const renderHeight = (this.graph as any)?.renderHeight || 1080;
  
  // Center calculations relative to render canvas, NOT viewport
  const centerX = renderWidth / 2;
  const centerY = renderHeight / 2;
}
```

### Render Output Node (Entry Point)
- **Must exist** in every graph to see output
- Sets `graph.renderWidth/renderHeight` in constructor, widgets, `onAdded()`, AND `onExecute()`
- Clears visualizations before execution via `clearVisualizations()`
- Sorts shapes by zIndex before emitting
- Passes canvas dimensions with every visualization event

## SVG Rendering System

### Shape Z-Index (Stacking Order)
Background rect (`id="bg-rect"`) MUST render first, then shapes append via `appendShape()`:
```typescript
// VisualizationCanvas.tsx - SVG cleanup preserves specific IDs
if (child.tagName !== 'defs' && child.id !== 'grid-rect' && child.id !== 'bg-rect') {
  svgRef.current!.removeChild(child);
}

// Background rect in JSX (renders first)
<rect id="bg-rect" x="0" y="0" width={renderDimensions.width} height={renderDimensions.height} fill={backgroundColor} />

// Shapes appended via DOM (render on top)
const appendShape = (svg: SVGSVGElement, element: SVGElement) => {
  svg.appendChild(element);  // Always appends after bg-rect
};
```

### Zoom/Pan Implementation
- **Zoom**: Ctrl+Scroll or +/- buttons, scale range [0.1, 5]
- **Pan**: Click-drag with cursor feedback (grab/grabbing)
- **Fit View**: Calculates scale to fit render dimensions in viewport with 50px padding
- **ViewBox Math**: `offsetX = (width - scaledWidth) / 2 - pan.x / scale`

## Developer Workflows

### Development
```bash
npm run dev  # Vite dev server on localhost:8080
```

### Manual Update System
- Graph does NOT auto-execute on changes
- User must click "Update" button to run graph
- `Index.tsx` stores `runOnceRef` callback from GraphEditor
- Prevents performance issues with large graphs

### Adding New Shape Types
1. Create new node class file in appropriate `src/components/graph/nodes/` subdirectory:
   - `math/` - Mathematical operations and number manipulation
   - `shapes/` - Geometric shapes (circles, rectangles, polygons, etc.)
   - `patterns/` - Array and pattern generators (polar, grid, circular arrays)
   - `output/` - Output and display nodes (Result, Render Output)
   - `utils/` - Shared utilities (visualization callbacks, types)
2. Import LGraphNode from "litegraph.js" and ShapeData from "../utils/visualization"
3. Export the class with `export class MyNode extends LGraphNode`
4. Register in `src/components/graph/nodes/index.ts`:
   - Import: `import { MyNode } from "./category/MyNode"`
   - Register: `LiteGraph.registerNodeType("category/mynode", MyNode)`
   - Set color: `(MyNode as any).title_color = "#colorcode"`
5. Add to Sidebar categories in `src/components/graph/Sidebar.tsx`
6. Implement rendering in `VisualizationCanvas.tsx`:
   - Add `renderMyShape()` function
   - Add case to `renderVisualization()` switch statement

## Common Pitfalls

1. **Viewport vs Render Dimensions**: Pattern nodes must use `graph.renderWidth/renderHeight`, NOT canvas viewport size
2. **Widget Updates**: Render Output widgets update graph dimensions immediately, not just in `onExecute()`
3. **Background Disappearing**: Ensure `id="bg-rect"` on background rect and preserve it during SVG cleanup
4. **zIndex Ignored**: Render Output sorts by zIndex - shapes must have this property
5. **Context Menus**: Disabled via overriding `getCanvasMenuOptions()`, `getNodeMenuOptions()`, `getGroupMenuOptions()` in GraphEditor

## Technology Stack
- **React 18** + TypeScript + Vite (SWC)
- **LiteGraph.js 0.7.18** (node graph editor)
- **shadcn/ui** (UI components with Tailwind CSS)
- **Lucide React** (icons)
- **Sonner** (toast notifications)

## File Structure Conventions
- `src/components/graph/nodes/` - **Modular node structure** (refactored from monolithic 1968-line file)
  - `index.ts` - **120 lines** - imports all nodes and registers them with LiteGraph
  - `math/` - Mathematical operation nodes (16 files: Number, Add, Subtract, Multiply, Divide, Modulo, Power, Abs, Floor, Ceil, Round, Random, Min, Max, Sine, Cosine)
  - `shapes/` - Geometric shape nodes (5 files: Circle, Rectangle, Spiral, Wave, Polygon)
  - `patterns/` - Array and pattern generator nodes (5 files: PolarArray, GridArray, CircularArray, MergeArrays, ComposeShapes)
  - `output/` - Output and display nodes (2 files: Result, RenderOutput)
  - `utils/` - Shared utilities (1 file: visualization callbacks, event emitters, ShapeData type)
- `src/components/graph/` - Graph editor UI components
- `src/components/ui/` - shadcn/ui component library
- `src/pages/Index.tsx` - Main layout orchestrator (Header, Sidebar, split panels)

## Key Dependencies & Behavior
- Uses `@` path alias for `src/` (configured in `vite.config.ts`)
- LiteGraph context menus disabled (allow_searchbox = false)
- SVG preserveAspectRatio: "xMidYMid meet" (prevents distortion)
- ResizablePanel from shadcn/ui for split-view layout

## Future Extensions & Roadmap

### Planned Features (Not Yet Implemented)
1. **Export Capabilities**
   - Save visualization to SVG file format
   - Export with embedded node graph metadata or separate JSON
   - Laser cutter export with dimension scaling (e.g., 1:10 ratio for mm conversion)

2. **Import/Load System**
   - Read node tree from saved files (SVG metadata or JSON)
   - Restore complete graph state including connections

3. **Enhanced Shape Styling**
   - Dynamic color modification on existing shapes
   - Image loading inside shapes (fills, patterns)

4. **Additional Geometry Nodes**
   - Line node (with configurable endpoints)
   - Arc node (for curves and partial circles)
   - Path manipulation nodes

5. **Scale & Units System**
   - Dimension node with scale ratios (SVG units → real-world mm/cm/inches)
   - Measurement visualization overlay
   - Export metadata for CNC/laser cutters

6. **UI/UX Improvements**
   - Persist sidebar collapsed/expanded state
   - Remember last opened node graph
   - Node graph preset library
   - User preferences storage (localStorage)

7. **Animation System**
   - Animate node for real-time value interpolation
   - Playback controls (play/pause/speed)
   - Timeline visualization
   - Live SVG updates during animation

### Implementation Notes for Future Developers
- **Export**: SVG serialization from `VisualizationCanvas.tsx` svgRef, embed graph JSON in `<metadata>` tags
- **Import**: Parse SVG metadata or JSON, reconstruct LGraph in `GraphEditor.tsx`
- **Color Changes**: Add color inputs to shape nodes, update `renderVisualization()` switch cases
- **Image Fills**: Use SVG `<pattern>` with `<image>` elements in defs, apply as fill attribute
- **Scale System**: New utility node that multiplies coordinates by scale factor before Render Output
- **Animation**: useEffect hook with requestAnimationFrame, interpolate property values over time
