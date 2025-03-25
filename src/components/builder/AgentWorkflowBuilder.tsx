
import { useCallback, useState, useRef, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  OnConnect,
  NodeMouseHandler,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Save, Trash2, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ControlPanel from "./ControlPanel";
import AgentNode, { AgentNodeData } from "../agents/AgentNode";
import TeamNode, { TeamNodeData } from "../teams/TeamNode";
import InputNode from "./nodes/InputNode";
import OutputNode from "./nodes/OutputNode";
import { useAgents } from "@/context/AgentContext";

// Define proper edge type
interface CustomEdge extends Edge {
  animated?: boolean;
  style?: {
    stroke: string;
    strokeWidth: number;
  };
  markerEnd?: {
    type: MarkerType;
  };
}

// Initial template edges with correct typing
const initialEdges: CustomEdge[] = [
  {
    id: 'template-edge-1',
    source: 'input-1',
    target: 'template-agent-1',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    sourceHandle: null,
    targetHandle: null,
  },
  {
    id: 'template-edge-2',
    source: 'template-agent-1',
    target: 'output-1',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    sourceHandle: null,
    targetHandle: null,
  },
];

// Initial template nodes for the flow
const initialNodes: Node[] = [
  {
    id: 'input-1',
    type: 'input',
    position: { x: 250, y: 50 },
    data: {
      label: 'Input',
      format: 'JSON',
      description: 'Workflow starting point'
    },
  },
  {
    id: 'template-agent-1',
    type: 'agent',
    position: { x: 250, y: 200 },
    data: {
      label: 'Template Agent',
      llm: 'GPT-4',
      tools: ['Web Search', 'Calculator']
    },
  },
  {
    id: 'output-1',
    type: 'output',
    position: { x: 250, y: 350 },
    data: {
      label: 'Output',
      format: 'JSON',
      description: 'Workflow endpoint'
    },
  },
];

// Define node types with their respective data structures
const nodeTypes: NodeTypes = {
  agent: AgentNode,
  team: TeamNode,
  input: InputNode,
  output: OutputNode
};

// Create a separate component for the flow content
const FlowContent = () => {
  const { agents, teams } = useAgents();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowInstance = useReactFlow();
  const [showHelp, setShowHelp] = useState(true);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  
  // Initialize the flow after component mount and track container dimensions
  useEffect(() => {
    if (reactFlowWrapper.current) {
      // Set explicit height and width to fix container dimension issues
      const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          console.log("Flow container dimensions:", { width, height });
          setContainerDimensions({ width, height });
        }
      });
      
      observer.observe(reactFlowWrapper.current);
      
      return () => {
        observer.disconnect();
      };
    }
  }, [reactFlowWrapper]);

  // Fit view once the container has dimensions and instance is ready
  useEffect(() => {
    if (reactFlowInstance && containerDimensions.width > 0 && containerDimensions.height > 0) {
      console.log("Fitting view with dimensions:", containerDimensions);
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 200);
    }
  }, [reactFlowInstance, containerDimensions]);
  
  const onConnect: OnConnect = useCallback(
    (connection) => {
      console.log("Creating connection:", connection);
      // Create a unique ID for the new edge
      const newEdge: CustomEdge = {
        ...connection,
        id: `e${connection.source}-${connection.target}`,
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        }
      };
      setEdges((eds) => addEdge(newEdge, eds));
      toast.success("Connection created successfully");
    },
    [setEdges]
  );
  
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    console.log("Dragging over flow area");
  }, []);
  
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      console.log("Drop event triggered");
      
      if (!reactFlowWrapper.current || !reactFlowInstance) {
        console.error("Missing reactFlowWrapper or reactFlowInstance");
        return;
      }
      
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow/type");
      const nodeDataString = event.dataTransfer.getData("application/reactflow/data");
      
      console.log("Drag data:", { type, nodeDataString });
      
      if (!type || !nodeDataString) {
        console.error("Missing type or data in drop event");
        return;
      }
      
      try {
        const nodeData = JSON.parse(nodeDataString);
        
        // Get the position where the node was dropped
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        
        console.log("Creating new node at position:", position);
        
        const newNode: Node = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: nodeData,
        };
        
        setNodes((nds) => nds.concat(newNode));
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added to workflow`);
        
        // Hide the help message after successfully adding a node
        setShowHelp(false);
      } catch (error) {
        console.error("Error parsing node data:", error);
        toast.error("Failed to add element to workspace");
      }
    },
    [reactFlowInstance, setNodes]
  );
  
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    // Handle node click (for editing, etc.)
    console.log("Node clicked:", node);
    
    // If node is an agent node, show edit modal
    if (node.type === 'agent') {
      toast.info("Agent editor would open here", {
        description: "Edit tools, name, and configuration"
      });
    } else if (node.type === 'team') {
      toast.info("Team editor would open here", {
        description: "Edit team configuration"
      });
    } else if (node.type === 'input' || node.type === 'output') {
      toast.info(`${node.type.charAt(0).toUpperCase() + node.type.slice(1)} configuration`, {
        description: "Configure data format and connections"
      });
    }
  }, []);
  
  const onNodeDragStop: NodeMouseHandler = useCallback((event, node) => {
    // Check for intersections with other nodes for grouping, etc.
    console.log("Node dragged:", node);
  }, []);
  
  const onSaveFlow = useCallback(() => {
    // Save the current flow configuration (nodes and edges)
    const flow = { nodes, edges };
    localStorage.setItem("savedFlow", JSON.stringify(flow));
    toast.success("Workflow saved successfully!");
  }, [nodes, edges]);
  
  const onDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
    toast.success("Selected items deleted");
  }, [setNodes, setEdges]);

  // Handle drag start event
  const handleDragStart = useCallback((event: React.DragEvent, nodeType: string, data: any) => {
    console.log("Drag start from control panel:", { nodeType, data });
    event.dataTransfer.setData("application/reactflow/type", nodeType);
    event.dataTransfer.setData("application/reactflow/data", JSON.stringify(data));
    event.dataTransfer.effectAllowed = "move";
  }, []);

  // Check workflow validity (at least one input and one output node)
  const validateWorkflow = useCallback(() => {
    const inputNodes = nodes.filter(node => node.type === 'input');
    const outputNodes = nodes.filter(node => node.type === 'output');
    
    if (inputNodes.length === 0) {
      toast.error("Workflow must have at least one Input node");
      return false;
    }
    
    if (outputNodes.length === 0) {
      toast.error("Workflow must have at least one Output node");
      return false;
    }
    
    // Check for orphaned nodes (nodes without connections)
    const connectedNodeIds = new Set<string>();
    
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });
    
    const orphanedNodes = nodes.filter(node => !connectedNodeIds.has(node.id));
    
    if (orphanedNodes.length > 0) {
      toast.warning("Workflow contains unconnected nodes", {
        description: "All nodes should be connected to the workflow"
      });
      return false;
    }
    
    return true;
  }, [nodes, edges]);

  return (
    <div className="flex h-full">
      <ControlPanel 
        onDragStart={handleDragStart} 
        agents={agents}
      />
      
      <div 
        ref={reactFlowWrapper} 
        className="flex-1 h-full border-2 border-dashed border-border relative" 
        style={{ minHeight: "500px" }}
      >
        {showHelp && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg z-10 text-center max-w-md">
            <p className="text-sm text-muted-foreground mb-2">
              Drag components from the left panel and drop them here to build your workflow.
            </p>
            <p className="text-xs text-muted-foreground">
              Start with Input node → Add Agents or Teams → End with Output node.
            </p>
          </div>
        )}
        
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          minZoom={0.2}
          maxZoom={4}
          attributionPosition="bottom-right"
          deleteKeyCode={["Backspace", "Delete"]}
          style={{ background: "#f8fafc" }}
        >
          <Background gap={16} size={1} color="#f8fafc" />
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          
          <Panel position="top-right" className="space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => setShowHelp(!showHelp)}
            >
              <Info className="h-4 w-4" />
              Help
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => {
                if (validateWorkflow()) {
                  onSaveFlow();
                }
              }}
            >
              <Save className="h-4 w-4" />
              Save Workflow
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="gap-2"
              onClick={onDeleteSelected}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

// Main component wrapped with ReactFlowProvider
const AgentWorkflowBuilder = () => {
  // Add a wrapper div with explicit height to fix React Flow container sizing issue
  return (
    <div className="h-full w-full" style={{ height: "calc(100vh - 64px)" }}>
      <ReactFlowProvider>
        <FlowContent />
      </ReactFlowProvider>
    </div>
  );
};

export default AgentWorkflowBuilder;
