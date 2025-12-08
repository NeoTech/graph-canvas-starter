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

## Critical Data Flow: SVG Group-Based Visualization System

**MAJOR REFACTOR (Dec 2024)**: System now uses **SVG groups with transforms** instead of coordinate recalculation.

### Coordinate System Hierarchy (CRITICAL)

```
Level 1: Shape Nodes (Local Coordinates)
  ↓ Output at (0, 0) by default
Level 2: Array Nodes (Local Group Positioning)  
  ↓ Create SVG <g> with translate(), default center (0, 0)
Level 3: Compose Nodes (Global Canvas Positioning)
  ↓ Wrap in parent <g>, default center (renderWidth/2, renderHeight/2)
Level 4: Render Output (Emit to Canvas)
  ↓ Pass complete group structure to visualization
```

### ShapeData Interface (Updated)
```typescript
interface ShapeData {
  type: string;           // "circle", "rectangle", "polygon", "group"
  data?: any;            // Shape-specific properties (optional for groups)
  zIndex?: number;       // Rendering order for shapes
  // SVG Group Properties
  isGroup?: boolean;     // True for group containers
  children?: ShapeData[]; // Nested shapes/groups
  transform?: string;    // SVG transform attribute (e.g., "translate(100, 200)")
}
```

**Key Rules**:
1. **Shapes** output at local (0,0), never aware of canvas dimensions
2. **Arrays** wrap shapes in groups with `translate()` transforms, default to (0,0)
3. **Compose** wraps groups in parent groups, defaults to canvas center for global positioning
4. **RenderOutput** passes complete group hierarchy including `isGroup`, `children`, `transform`
5. **VisualizationCanvas** renders nested `<g>` elements, transforms cascade naturally via SVG

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
└── output/                     # 3 output nodes
    ├── ResultNode.ts          # Numeric result display
    ├── RenderOutputNode.ts    # SVG canvas output
    └── AnimateNode.ts         # Value animation over time
```

### Creating Shape Nodes (Local Coordinates)
```typescript
class MyShapeNode extends LGraphNode {
  static title = "My Shape";
  static desc = "Description";

  constructor() {
    super("My Shape");
    // Inputs: Allow local positioning relative to parent group
    this.addInput("X", "number");
    this.addInput("Y", "number");
    
    // Outputs: Pass data to other nodes
    this.addOutput("Shape", "shape");
    
    // Properties: Store default values (local coordinates)
    this.addProperty("x", 0, "number");  // Local (0,0) by default
    this.addProperty("y", 0, "number");
    
    // Widgets: UI controls (update properties)
    // CRITICAL: Every numeric property MUST have a widget
    this.addWidget("number", "X", 0, (v: number) => {
      this.properties.x = v;
    });
    this.addWidget("number", "Y", 0, (v: number) => {
      this.properties.y = v;
    });
    
    // Styling (color codes indicate node type)
    this.color = "#1a365d";     // Title bar color
    this.bgcolor = "#0f172a";   // Background color
  }

  onExecute() {
    // Priority: Input > Property
    // CRITICAL: Use local coordinates (0,0) by default
    // DO NOT read renderWidth/renderHeight - shapes are canvas-agnostic
    const x = this.getInputData(0) ?? this.properties.x;
    const y = this.getInputData(1) ?? this.properties.y;
    
    // Output ShapeData with local coordinates
    this.setOutputData(0, {
      type: "myshape",
      data: { x, y, /* ... */ },
      zIndex: this.properties.zIndex ?? 0
    });
  }
}
```

**Widget Pattern (CRITICAL)**:
Each numeric parameter MUST have three components:
1. **Property** - Stores the default value
2. **Widget** - UI control to edit the property directly on the node
3. **Input** - Graph connection that overrides the property when connected

This pattern allows users to:
- Type values directly into widgets for quick edits
- OR connect math nodes for dynamic/chained values
- Input always takes priority when connected

### Array Nodes (SVG Group Positioning)
**Critical**: Array nodes create SVG groups with transforms, use local (0,0) by default:
```typescript
onExecute() {
  const input = this.getInputData(0);
  if (!input) return;
  
  // Normalize input to array
  const inputShapes: ShapeData[] = Array.isArray(input) ? input : [input];
  
  const xInput = this.getInputData(3); // Center X input
  const yInput = this.getInputData(4); // Center Y input
  
  // CRITICAL: Default to local (0,0), NOT canvas center
  // Only ComposeShapes should default to canvas center
  const cx = xInput !== undefined && xInput !== null ? xInput : this.properties.centerX;
  const cy = yInput !== undefined && yInput !== null ? yInput : this.properties.centerY;
  
  const groups: ShapeData[] = [];
  
  for (let i = 0; i < count; i++) {
    // Calculate position offset for this copy
    const offsetX = /* ...array-specific calculation... */;
    const offsetY = /* ...array-specific calculation... */;
    
    // Create SVG group with transform
    // IMPORTANT: Clone inputShapes to avoid reference sharing
    const group: ShapeData = {
      type: "group",
      isGroup: true,
      children: JSON.parse(JSON.stringify(inputShapes)), // Deep clone
      transform: `translate(${cx + offsetX}, ${cy + offsetY})`,
      zIndex: 0
    };
    
    groups.push(group);
  }
  
  this.setOutputData(0, groups);
}
```

### Compose Nodes (Global Canvas Positioning)
**Critical**: Compose nodes provide global positioning, wrap inputs in parent groups:
```typescript
onExecute() {
  const shapeA = this.getInputData(0);
  const shapeB = this.getInputData(1);
  
  // Get render canvas dimensions for default center
  const renderWidth = (this.graph as any)?.renderWidth || 1920;
  const renderHeight = (this.graph as any)?.renderHeight || 1080;
  
  const composeXInput = this.getInputData(6);
  const composeYInput = this.getInputData(7);
  
  // CRITICAL: Default to canvas center for global positioning
  // Only if Compose X/Y inputs are NOT connected
  const hasComposeInput = composeXInput !== undefined && composeXInput !== null && 
                         composeYInput !== undefined && composeYInput !== null;
  
  const composeX = hasComposeInput ? composeXInput : renderWidth / 2;
  const composeY = hasComposeInput ? composeYInput : renderHeight / 2;
  
  const composed: ShapeData[] = [];
  
  // Wrap inputs (shapes OR groups from arrays) in parent group
  if (shapeA) {
    const shapesA = Array.isArray(shapeA) ? shapeA : [shapeA];
    const groupA: ShapeData = {
      type: "group",
      isGroup: true,
      children: shapesA, // Can be shapes OR groups - nesting works!
      transform: `translate(${composeX + aX}, ${composeY + aY})`,
      zIndex: 0
    };
    composed.push(groupA);
  }
  
  this.setOutputData(0, composed);
}
```

### Math Nodes (Value Generators vs Operations)
**Two categories of math nodes:**

1. **Value Generators** (have widgets):
   - NumberNode - outputs a constant value
   - RandomNode - generates random numbers with min/max range
   - These nodes provide configurable values and MUST have widgets for their parameters

2. **Operations** (no widgets):
   - Add, Subtract, Multiply, Divide, Modulo, Power
   - Min, Max, Abs, Floor, Ceil, Round
   - Sine, Cosine
   - These nodes only perform calculations on inputs - no widgets needed
   - Users connect inputs from other nodes to perform operations

**Example - NumberNode (correct pattern with widget)**:
```typescript
constructor() {
  super("Number");
  this.addOutput("value", "number");
  this.addProperty("value", 1, "number");
  this.addWidget("number", "value", 1, (v: number) => {
    this.properties.value = v;
  });
}
```

**Example - AddNode (correct pattern without widgets)**:
```typescript
constructor() {
  super("Add");
  this.addInput("A", "number");
  this.addInput("B", "number");
  this.addOutput("Result", "number");
  // No properties or widgets - pure operation node
}
```

### Render Output Node (Entry Point)
- **Must exist** in every graph to see output
- Sets `graph.renderWidth/renderHeight` in constructor, widgets, `onAdded()`, AND `onExecute()`
- **CRITICAL**: Must pass complete shape objects including group properties:
```typescript
sortedShapes.forEach((shape: ShapeData, index: number) => {
  emitVisualization({
    type: shape.type,
    data: shape.data,
    // MUST include group properties for SVG group rendering
    isGroup: shape.isGroup,
    children: shape.children,
    transform: shape.transform,
    timestamp: Date.now() + index,
    canvasWidth: this.properties.width,
    canvasHeight: this.properties.height,
    backgroundColor: this.properties.backgroundColor,
  });
});
```

### Animate Node (Time-Based Value Animation)
**Location**: `src/components/graph/nodes/output/AnimateNode.ts`

The Animate node provides real-time value animation with play/pause/reset controls:

**Features**:
- **Value Input/Widget**: Starting value for animation (default: 0)
- **Modifier Input/Widget**: Amount to add per frame (default: 1)
- **FPS Widget**: Animation speed in frames per second (1-120 FPS, default: 30)
- **Current Display**: Read-only widget showing live animated value
- **Play/Stop Button**: Toggles animation (button text updates dynamically)
- **Reset Button**: Stops animation and restores initial value

**Critical Implementation Details**:
```typescript
private hasStarted: boolean = false; // Prevents value reset on stop

// State transitions:
// Initial → hasStarted=false, isPlaying=false → updates from inputs/widgets
// Play → hasStarted=true, isPlaying=true → animation runs
// Stop → hasStarted=true, isPlaying=false → preserves currentValue
// Reset → hasStarted=false → restores initialValue
```

**Animation Loop Pattern**:
- Uses `requestAnimationFrame` with frame timing for consistent FPS
- Triggers `graph.runStep(1)` each frame to update visualization
- Automatically cleans up animation on node removal
- Current value persists when stopped (doesn't reset until Reset button clicked)

**Usage Example**:
```typescript
// Connect Animate output to shape X/Y position for movement
Animate (value: 0, modifier: 5) → Circle.X → creates horizontal motion
```

**Widget State Management**:
- Value/Modifier widgets only update properties when animation is NOT playing
- Current value widget is read-only (disabled) and updates every frame
- Play button label toggles between "Play" and "Stop"

## SVG Rendering System

### Group Rendering (CRITICAL)
VisualizationCanvas.tsx now renders SVG groups with nested transforms:
```typescript
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
    if (shape.children) {
      shape.children.forEach((child: any) => {
        renderShapeInGroup(nestedGroup, child);
      });
    }
    group.appendChild(nestedGroup);
    return;
  }
  
  // Render individual shape element (circle, rect, polygon, etc.)
  const element = createShapeElement(shape);
  group.appendChild(element);
};
```

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

### SVG Export System
**Location**: `src/components/graph/VisualizationCanvas.tsx` - Download button in Header component

**Functionality**:
- Serializes complete SVG canvas including shapes, groups, transforms, and styling
- Embeds LiteGraph node graph as JSON metadata in `<metadata>` tag for restore capability
- Generates downloadable `.svg` file with timestamp

**Metadata Format** (IMPORTANT):
```typescript
// CORRECT: Compact JSON on single line (recommended)
const metadata = `<metadata id="graph-data">${JSON.stringify(graphData)}</metadata>`;

// INCORRECT: Prettified/formatted JSON (avoid this)
const metadata = `<metadata id="graph-data">${JSON.stringify(graphData, null, 2)}</metadata>`;
```

**Rationale**: Compact single-line JSON keeps SVG file size smaller and prevents unnecessary whitespace in exported files. Metadata is machine-readable, not intended for human editing. For debugging graph structure, use browser DevTools or dedicated JSON viewers.

**Implementation Pattern**:
```typescript
// In VisualizationCanvas.tsx download handler
const handleDownloadSVG = () => {
  const svgElement = svgRef.current;
  if (!svgElement) return;
  
  // Clone SVG to avoid modifying rendered version
  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
  
  // Add compact graph metadata (no formatting)
  const graphData = graph?.serialize(); // LiteGraph JSON
  const metadata = document.createElementNS("http://www.w3.org/2000/svg", "metadata");
  metadata.setAttribute("id", "graph-data");
  metadata.textContent = JSON.stringify(graphData); // Single line, no spaces
  svgClone.insertBefore(metadata, svgClone.firstChild);
  
  // Serialize and download
  const svgString = new XMLSerializer().serializeToString(svgClone);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `visualization-${Date.now()}.svg`;
  link.click();
  URL.revokeObjectURL(url);
};
```

**Future Import System** (see roadmap):
- Parse `<metadata id="graph-data">` tag from loaded SVG
- Deserialize JSON to restore LGraph state
- Reconstruct all nodes, connections, and property values

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

1. **Coordinate System Hierarchy** (CRITICAL - Dec 2024 Refactor):
   - **Shapes** MUST output at local (0,0) - never read renderWidth/renderHeight
   - **Arrays** MUST default to (0,0) local coordinates - only use canvas center if explicitly needed
   - **Compose** MUST default to canvas center (renderWidth/2, renderHeight/2) for global positioning
   - **Pitfall**: If arrays default to canvas center, shapes will "stack" instead of positioning locally
   - **Fix**: Arrays use `cx = xInput ?? 0`, Compose uses `composeX = hasInput ? input : renderWidth/2`

2. **Group Reference Sharing** (CRITICAL):
   - Array nodes must **deep clone** input shapes: `JSON.parse(JSON.stringify(inputShapes))`
   - **Pitfall**: Sharing same array reference causes one shape to stay stationary
   - **Fix**: Each group gets its own independent copy of children

3. **Group Properties in RenderOutput**:
   - RenderOutputNode must pass `isGroup`, `children`, `transform` to emitVisualization()
   - **Pitfall**: Groups created but not rendering = missing group properties in emission
   - **Fix**: Include all group properties when calling emitVisualization()

4. **Widget Updates**: Render Output widgets update graph dimensions immediately, not just in `onExecute()`

5. **Shape Widget Values** (CRITICAL - Dec 2024 Fix):
   - **Priority**: `Input > Property (widget value)`
   - **Pitfall**: Shape nodes defaulting to 0 when no input connected instead of using widget values
   - **Fix**: Use `const x = xInput !== undefined && xInput !== null ? xInput : this.properties.x`
   - All shape nodes (Circle, Rectangle, Polygon, Spiral, Wave) must respect widget X/Y values

6. **Background Disappearing**: Ensure `id="bg-rect"` on background rect and preserve it during SVG cleanup

7. **zIndex Ignored**: Render Output sorts by zIndex - shapes must have this property

8. **Context Menus**: Disabled via overriding `getCanvasMenuOptions()`, `getNodeMenuOptions()`, `getGroupMenuOptions()` in GraphEditor

9. **Animate Node State Management** (CRITICAL):
   - **hasStarted flag**: Prevents currentValue reset when stopped
   - **Pitfall**: Stop button resets value because `onExecute()` updates currentValue when `!isPlaying`
   - **Fix**: Only update currentValue when `!isPlaying && !hasStarted` (never started state)
   - Stop preserves position, Reset restores initial value

10. **ResizablePanel Behavior** (Index.tsx split-view layout):
   - **CRITICAL**: With `direction="vertical"`, the **first panel in DOM** grows when you drag the handle **down**
   - **DOM Order Controls Resize**: Place the panel you want to grow on drag-down FIRST in the DOM
   - **Visual Layout**: Flexbox naturally stacks panels in DOM order (first = top, second = bottom)
   - **Current Setup**: Graph Editor first in DOM (bottom visually), Visualization Canvas second (top visually)
   - This makes dragging down expand the Graph Editor (intuitive behavior)
   - **DO NOT** use CSS `order`, `flex-direction: column-reverse`, or swap DOM order to "fix" resize - it breaks the natural behavior
   - If resize feels inverted, the panels are in the wrong DOM order, not a CSS issue

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
  - `output/` - Output and display nodes (3 files: Result, RenderOutput, Animate)
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

7. **Docker Container build**
   - Create a docker build script for this application.
   - Create a docker-compose run script for the container.

### Implementation Notes for Future Developers
- **Export**: SVG serialization from `VisualizationCanvas.tsx` svgRef, embed graph JSON in `<metadata>` tags
- **Import**: Parse SVG metadata or JSON, reconstruct LGraph in `GraphEditor.tsx`
- **Color Changes**: Add color inputs to shape nodes, update `renderVisualization()` switch cases
- **Image Fills**: Use SVG `<pattern>` with `<image>` elements in defs, apply as fill attribute
- **Scale System**: New utility node that multiplies coordinates by scale factor before Render Output
