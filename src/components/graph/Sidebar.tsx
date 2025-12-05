import { Layers, Hash, X, Calculator, MonitorDot, Grid3x3, Circle, ChevronDown } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  onAddNode: (type: string) => void;
}

const nodeCategories = [
  {
    name: "Math",
    icon: Calculator,
    nodes: [
      { type: "math/number", label: "Number", desc: "Output a constant number" },
      { type: "math/add", label: "Add", desc: "Add two numbers" },
      { type: "math/subtract", label: "Subtract", desc: "Subtract two numbers" },
      { type: "math/multiply", label: "Multiply", desc: "Multiply two numbers" },
      { type: "math/divide", label: "Divide", desc: "Divide two numbers" },
      { type: "math/modulo", label: "Modulo", desc: "Calculate remainder" },
      { type: "math/power", label: "Power", desc: "Raise to power" },
      { type: "math/abs", label: "Absolute", desc: "Absolute value" },
      { type: "math/floor", label: "Floor", desc: "Round down" },
      { type: "math/ceil", label: "Ceiling", desc: "Round up" },
      { type: "math/round", label: "Round", desc: "Round to nearest" },
      { type: "math/min", label: "Min", desc: "Minimum of two values" },
      { type: "math/max", label: "Max", desc: "Maximum of two values" },
      { type: "math/random", label: "Random", desc: "Random number" },
      { type: "math/sin", label: "Sine", desc: "Sine function" },
      { type: "math/cos", label: "Cosine", desc: "Cosine function" },
    ],
  },
  {
    name: "Display",
    icon: MonitorDot,
    nodes: [
      { type: "display/result", label: "Result", desc: "Display final result" },
    ],
  },
  {
    name: "Visualization",
    icon: Layers,
    nodes: [
      { type: "visualization/circle", label: "Circle", desc: "Render a circle shape" },
      { type: "visualization/rectangle", label: "Rectangle", desc: "Render a rectangle" },
      { type: "visualization/spiral", label: "Spiral", desc: "Generate spiral pattern" },
      { type: "visualization/wave", label: "Wave", desc: "Generate sine wave" },
      { type: "visualization/polygon", label: "Polygon", desc: "Render N-sided polygon" },
    ],
  },
  {
    name: "Patterns",
    icon: Grid3x3,
    nodes: [
      { type: "pattern/polar_array", label: "Polar Array", desc: "Circular pattern layout" },
      { type: "pattern/grid_array", label: "Grid Array", desc: "Grid pattern layout" },
      { type: "pattern/circular_array", label: "Circular Array", desc: "Arc pattern layout" },
      { type: "pattern/compose_shapes", label: "Compose Shapes", desc: "Merge two shapes with positioning" },
      { type: "pattern/merge_arrays", label: "Merge Arrays", desc: "Combine shape arrays" },
    ],
  },
  {
    name: "Output",
    icon: Circle,
    nodes: [
      { type: "output/render", label: "Render Output", desc: "Send to SVG canvas" },
    ],
  },
];

export const Sidebar = ({ onAddNode }: SidebarProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(nodeCategories.map(cat => cat.name)) // All expanded by default
  );

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  return (
    <aside className="w-64 h-full bg-sidebar border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground text-sm">Node Graph</h1>
            <p className="text-xs text-muted-foreground">Visual Editor</p>
          </div>
        </div>
      </div>

      {/* Node palette */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Available Nodes
        </p>

        <div className="space-y-2">
          {nodeCategories.map((category) => {
            const isExpanded = expandedCategories.has(category.name);
            return (
              <div key={category.name} className="border border-border/50 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <category.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground flex-1 text-left">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {category.nodes.length}
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="space-y-1 p-2 bg-background/50">
                    {category.nodes.map((node) => (
                      <button
                        key={node.type}
                        onClick={() => onAddNode(node.type)}
                        className="w-full text-left px-3 py-2 rounded-md bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/30 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                            {node.label}
                          </span>
                          <Hash className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {node.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>
            <span className="text-primary">Right-click</span> canvas for menu
          </p>
          <p className="mt-1">
            <span className="text-primary">Drag</span> to connect nodes
          </p>
        </div>
      </div>
    </aside>
  );
};
