import { LGraphNode } from "litegraph.js";

export class AnimateNode extends LGraphNode {
  static title = "Animate";
  static desc = "Animates a value over time with play/pause/reset controls";

  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private isPlaying: boolean = false;
  private hasStarted: boolean = false; // Track if animation has ever started
  private currentValue: number = 0;
  private initialValue: number = 0;
  private initialModifier: number = 0;

  constructor() {
    super("Animate");

    // Inputs
    this.addInput("Value", "number");
    this.addInput("Modifier", "number");

    // Output
    this.addOutput("Current Value", "number");

    // Properties
    this.addProperty("value", 0, "number");
    this.addProperty("modifier", 1, "number");
    this.addProperty("fps", 30, "number");

    // Widgets
    this.addWidget("number", "Value", this.properties.value, (v: number) => {
      this.properties.value = v;
      if (!this.isPlaying) {
        this.currentValue = v;
        this.initialValue = v;
      }
    });

    this.addWidget("number", "Modifier", this.properties.modifier, (v: number) => {
      this.properties.modifier = v;
      if (!this.isPlaying) {
        this.initialModifier = v;
      }
    });

    this.addWidget("number", "FPS", this.properties.fps, (v: number) => {
      this.properties.fps = Math.max(1, Math.min(120, v)); // Clamp between 1-120 FPS
    });

    // Read-only display of current value (for debugging)
    const currentValueWidget = this.addWidget("number", "Current", 0, null);
    if (currentValueWidget) {
      (currentValueWidget as any).disabled = true; // Make it read-only
    }

    this.addWidget("button", "Play", null, () => {
      this.togglePlayStop();
    });

    this.addWidget("button", "Reset", null, () => {
      this.reset();
    });

    // Initialize values
    this.currentValue = this.properties.value;
    this.initialValue = this.properties.value;
    this.initialModifier = this.properties.modifier;

    // Styling
    this.color = "#7c2d12"; // Darker orange/brown for animation
    this.bgcolor = "#1c1917"; // Very dark brown
    this.size = [200, 180];
  }

  onAdded() {
    // Store initial values when node is added to graph
    this.initialValue = this.properties.value;
    this.initialModifier = this.properties.modifier;
    this.currentValue = this.properties.value;
  }

  togglePlayStop() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  play() {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.hasStarted = true; // Mark that animation has started
    this.lastFrameTime = performance.now();

    // Update button text
    const playButton = this.widgets?.find((w) => w.name === "Play");
    if (playButton) {
      playButton.label = "Stop";
    }

    // Start animation loop
    this.animate();
  }

  stop() {
    if (!this.isPlaying) return;

    this.isPlaying = false;

    // Cancel animation frame if exists
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Update button text
    const playButton = this.widgets?.find((w) => w.name === "Play");
    if (playButton) {
      playButton.label = "Play";
    }
  }

  reset() {
    // Stop animation if playing
    if (this.isPlaying) {
      this.stop();
    }

    // Reset hasStarted flag
    this.hasStarted = false;

    // Reset to initial values that were stored when node was created/added
    this.currentValue = this.initialValue;

    // Trigger graph execution to update visualization
    if (this.graph) {
      this.graph.runStep(1);
    }
  }

  animate() {
    if (!this.isPlaying) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    const frameInterval = 1000 / this.properties.fps; // milliseconds per frame

    // Only update if enough time has passed for the target FPS
    if (deltaTime >= frameInterval) {
      this.lastFrameTime = currentTime - (deltaTime % frameInterval);

      // Get current modifier (from input or property)
      const inputModifier = this.getInputData(1);
      const modifier = inputModifier !== undefined && inputModifier !== null ? inputModifier : this.properties.modifier;

      // Update current value
      this.currentValue += modifier;

      // Trigger graph execution to update visualization
      if (this.graph) {
        this.graph.runStep(1);
      }
    }

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  onExecute() {
    // Get inputs (priority: input > stored initial > property)
    const inputValue = this.getInputData(0);
    const inputModifier = this.getInputData(1);

    // Only update current value if we've never started (not stopped, not playing)
    // This prevents resetting currentValue when animation is stopped
    if (!this.isPlaying && !this.hasStarted) {
      if (inputValue !== undefined && inputValue !== null) {
        this.currentValue = inputValue;
        this.initialValue = inputValue;
      } else {
        this.currentValue = this.properties.value;
        this.initialValue = this.properties.value;
      }

      if (inputModifier !== undefined && inputModifier !== null) {
        this.initialModifier = inputModifier;
      } else {
        this.initialModifier = this.properties.modifier;
      }
    }

    // Update the current value display widget
    const currentWidget = this.widgets?.find((w) => w.name === "Current");
    if (currentWidget) {
      currentWidget.value = this.currentValue;
    }

    // Output current animated value
    this.setOutputData(0, this.currentValue);
  }

  onRemoved() {
    // Clean up animation when node is removed
    if (this.isPlaying) {
      this.stop();
    }
  }

  // Serialize state for save/load
  serialize() {
    const data = super.serialize() as any;
    data.isPlaying = this.isPlaying;
    data.currentValue = this.currentValue;
    data.initialValue = this.initialValue;
    data.initialModifier = this.initialModifier;
    return data;
  }

  // Restore state on load
  configure(data: any) {
    super.configure(data);
    if (data.currentValue !== undefined) {
      this.currentValue = data.currentValue;
    }
    if (data.initialValue !== undefined) {
      this.initialValue = data.initialValue;
    }
    if (data.initialModifier !== undefined) {
      this.initialModifier = data.initialModifier;
    }
    // Don't auto-play on load
    this.isPlaying = false;
  }
}
