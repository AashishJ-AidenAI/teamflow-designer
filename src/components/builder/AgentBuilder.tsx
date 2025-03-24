
import { useCallback, useState, useRef } from "react";
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
  XYPosition,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ControlPanel from "./ControlPanel";
import AgentNode, { AgentNodeData } from "../agents/AgentNode";
import TeamNode, { TeamNodeData } from "../teams/TeamNode";

// Define node types with their respective data structures
const nodeTypes: NodeTypes = {
  agent: AgentNode,
  team: TeamNode
};

// Create a separate component for the flow content
const FlowContent = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowInstance = useReactFlow();
  
  const onConnect: OnConnect = useCallback(
    (connection) => {
      // Create a unique ID for the new edge
      const newEdge = {
        ...connection,
        id: `e${connection.source}-${connection.target}`,
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 }
      };
      setEdges((eds) => addEdge(newEdge, eds));
      toast.success("Connection created successfully");
    },
    [setEdges]
  );
  
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      if (!reactFlowWrapper.current || !reactFlowInstance) return;
      
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow/type");
      const nodeDataString = event.dataTransfer.getData("application/reactflow/data");
      
      if (!type || !nodeDataString) return;
      
      try {
        const nodeData = JSON.parse(nodeDataString);
        
        // Get the position where the node was dropped
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        
        const newNode: Node = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: nodeData,
        };
        
        setNodes((nds) => nds.concat(newNode));
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added to workspace`);
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
  }, []);
  
  const onNodeDragStop: NodeMouseHandler = useCallback((event, node) => {
    // Check for intersections with other nodes for grouping, etc.
    console.log("Node dragged:", node);
  }, []);
  
  const onSaveFlow = useCallback(() => {
    // Save the current flow configuration (nodes and edges)
    const flow = { nodes, edges };
    localStorage.setItem("savedFlow", JSON.stringify(flow));
    toast.success("Flow saved successfully!");
  }, [nodes, edges]);
  
  const onDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
    toast.success("Selected items deleted");
  }, [setNodes, setEdges]);

  // Pass handleDragStart to ControlPanel
  const handleDragStart = useCallback((event: React.DragEvent, nodeType: string, data: any) => {
    event.dataTransfer.setData("application/reactflow/type", nodeType);
    event.dataTransfer.setData("application/reactflow/data", JSON.stringify(data));
    event.dataTransfer.effectAllowed = "move";
  }, []);

  return (
    <div className="flex h-full">
      <ControlPanel onDragStart={handleDragStart} />
      
      <div ref={reactFlowWrapper} className="flex-1 h-full">
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
        >
          <Background gap={16} size={1} color="#f8fafc" />
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          
          <Panel position="top-right" className="space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={onSaveFlow}
            >
              <Save className="h-4 w-4" />
              Save
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
const AgentBuilder = () => {
  return (
    <div className="h-full w-full">
      <ReactFlowProvider>
        <FlowContent />
      </ReactFlowProvider>
    </div>
  );
};

export default AgentBuilder;
