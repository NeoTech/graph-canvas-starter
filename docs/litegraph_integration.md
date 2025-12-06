# Using LiteGraph.js in Applications

LiteGraph.js is a JavaScript library designed for creating and managing node-based graphs. It is widely used for visual programming interfaces, similar to Unreal Engine's Blueprints. This document provides an overview of integrating LiteGraph.js into applications, covering core concepts, setup, graph management, and best practices.

---

## Core Integration Concepts

LiteGraph.js can be integrated into both browser and server-side applications. The core components include:

- **LiteGraph**: The global registry containing all node types and utility functions.
- **LGraph**: The graph container that holds nodes and manages execution.
- **LGraphNode**: The base class for all node types.
- **LGraphCanvas**: The visual canvas component (for browser applications).

---

## Setting Up LiteGraph.js

### Browser Setup
To include LiteGraph.js in your browser application:

```html
<script src="path/to/litegraph.js"></script>
```

### Node.js Setup
For server-side applications:

```bash
npm install litegraph.js
```

---

## Creating and Managing Graphs

### Initializing a Graph
To create a new graph instance:

```javascript
const graph = new LiteGraph.LGraph();
```

### Graph Configuration Options
LiteGraph graphs can be customized with various properties:

| Property               | Description                      | Default                |
| ---------------------- | -------------------------------- | ---------------------- |
| `graph.config`         | Custom configuration object      | `{}`                   |
| `graph.catch_errors`   | Catch errors during execution    | `true`                 |
| `graph.elapsed_time`   | Time elapsed between steps       | `0.01`                 |
| `graph.fixedtime_lapse`| Fixed time step                  | `0.01`                 |
| `graph.status`         | Current status (STOPPED/RUNNING) | `LGraph.STATUS_STOPPED`|

---

## Working with Nodes

### Creating Nodes
To create and add nodes to your graph:

```javascript
const node = LiteGraph.createNode("basic/math");
graph.add(node);
```

### Accessing and Modifying Nodes
Once nodes are added, you can retrieve and modify them:

```javascript
const node = graph.getNodeById(nodeId);
node.properties.value = 42;
```

---

## Connecting Nodes

Create connections between node slots to define the dataflow:

```javascript
nodeA.connect(0, nodeB, 1); // Connect output 0 of nodeA to input 1 of nodeB
```

---

## Executing Graphs

### Starting Execution
To execute a graph:

```javascript
graph.start();
```

### Execution Flow
Graphs execute in a step-by-step manner, processing nodes in the correct order.

---

## Serialization and Persistence

### Serializing Graphs
To save a graph's state:

```javascript
const data = graph.serialize();
```

### Loading Graphs
To load a previously saved graph:

```javascript
graph.configure(data);
```

---

## Integration Patterns

### Basic Application Integration
Use LiteGraph as a processing engine in your application:

```javascript
const graph = new LiteGraph.LGraph();
// Add nodes and connections
```

### Visual Editor with Runtime
Provide a visual editor for configurations that are executed in a runtime environment.

---

## Event Handling

LiteGraph supports an event system for triggering conditional executions:

```javascript
node.triggerSlot(0, data);
```

---

## Advanced Integration Features

### Custom Node Types
For specialized applications, create custom nodes:

```javascript
class CustomNode extends LiteGraph.LGraphNode {
  constructor() {
    super("CustomNode");
    this.addInput("in", "number");
    this.addOutput("out", "number");
  }
  onExecute() {
    const input = this.getInputData(0);
    this.setOutputData(0, input * 2);
  }
}
LiteGraph.registerNodeType("custom/node", CustomNode);
```

### Handling Subgraphs
Encapsulate functionality using subgraphs for complex applications.

---

## Best Practices

1. **Separate UI from Logic**: Keep graph execution logic separate from UI components.
2. **Error Handling**: Use `try-catch` blocks during graph execution to prevent crashes.
3. **Throttle Execution**: For real-time applications, throttle graph execution to maintain performance.
4. **Custom Node Creation**: Create application-specific nodes to encapsulate domain logic.
5. **Validation**: Validate graphs before execution to ensure proper configuration.

---

## Summary

LiteGraph.js provides a flexible framework for integrating node-based programming into applications. By understanding the core concepts of graph creation, node management, execution flow, and serialization, developers can leverage the power of visual programming to enhance their applications.