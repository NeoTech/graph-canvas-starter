import { Layers, Hash, X, Calculator, MonitorDot } from "lucide-react";

interface SidebarProps {
  onAddNode: (type: string) => void;
}

const nodeCategories = [
  {
    name: "Math",
    icon: Calculator,
    nodes: [
      { type: "math/number", label: "Number", desc: "Output a constant number" },
      { type: "math/multiply", label: "Multiply", desc: "Multiply two values" },
    ],
  },
  {
    name: "Display",
    icon: MonitorDot,
    nodes: [
      { type: "display/result", label: "Result", desc: "Display final result" },
    ],
  },
];

export const Sidebar = ({ onAddNode }: SidebarProps) => {
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

        <div className="space-y-4">
          {nodeCategories.map((category) => (
            <div key={category.name}>
              <div className="flex items-center gap-2 mb-2">
                <category.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {category.name}
                </span>
              </div>

              <div className="space-y-1 ml-6">
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
            </div>
          ))}
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
