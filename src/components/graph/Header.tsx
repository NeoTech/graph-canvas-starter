import { RefreshCw, RotateCcw, Maximize2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onUpdate: () => void;
  onReset: () => void;
  onFitView: () => void;
}

export const Header = ({ onUpdate, onReset, onFitView }: HeaderProps) => {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Graph Editor</h2>
        </div>
        <div className="h-4 w-px bg-border" />
        <span className="text-sm text-muted-foreground font-mono">
          A computational visualization aid
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onFitView}
          className="text-muted-foreground hover:text-foreground"
        >
          <Maximize2 className="w-4 h-4 mr-2" />
          Fit View
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        <Button
          variant="default"
          size="sm"
          onClick={onUpdate}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Update
        </Button>
      </div>
    </header>
  );
};
