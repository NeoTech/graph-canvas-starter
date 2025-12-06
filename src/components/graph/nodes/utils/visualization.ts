// Visualization Event System
let visualizationCallbacks: ((data: any) => void)[] = [];
let clearCallbacks: (() => void)[] = [];

export function onVisualizationUpdate(callback: (data: any) => void) {
  visualizationCallbacks.push(callback);
  return () => {
    visualizationCallbacks = visualizationCallbacks.filter(cb => cb !== callback);
  };
}

export function onVisualizationClear(callback: () => void) {
  clearCallbacks.push(callback);
  return () => {
    clearCallbacks = clearCallbacks.filter(cb => cb !== callback);
  };
}

export function emitVisualization(data: any) {
  visualizationCallbacks.forEach(cb => cb(data));
}

export function clearVisualizations() {
  clearCallbacks.forEach(cb => cb());
}

// Shape data type for passing between nodes
export interface ShapeData {
  type: string;
  data: any;
  zIndex?: number;
}
