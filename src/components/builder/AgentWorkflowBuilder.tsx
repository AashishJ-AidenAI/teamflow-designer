
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
import { Save, Trash2, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ControlPanel from "./ControlPanel";
import AgentNode, { AgentNodeData } from "../agents/AgentNode";
import TeamNode, { TeamNodeData } from "../teams/TeamNode";
import InputNode from "./nodes/InputNode";
import OutputNode from "./nodes/OutputNode";
import IfNode from "./nodes/IfNode";
import { useAgents } from "@/context/AgentContext";
import { validateWorkflow, ValidationResult } from "@/utils/workflowValidation";

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
  output: OutputNode,
  if: IfNode
};

// Mock saved workflows - in a real app, these would come from a database
const savedWorkflowsData = {
  "wf1": {
    nodes: [
      {
        id: 'input-1',
        type: 'input',
        position: { x: 250, y: 50 },
        data: {
          label: 'Customer Request',
          format: 'JSON',
          description: 'Customer support request'
        },
      },
      {
        id: 'agent-1',
        type: 'agent',
        position: { x: 250, y: 200 },
        data: {
          label: 'Customer Support Agent',
          llm: 'GPT-4',
          tools: ['Knowledge Base', 'Email Templates']
        },
      },
      {
        id: 'agent-2',
        type: 'agent',
        position: { x: 250, y: 350 },
        data: {
          label: 'Document Processing Agent',
          llm: 'Claude-3',
          tools: ['Document Analysis', 'Data Extraction']
        },
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 250, y: 500 },
        data: {
          label: 'Support Resolution',
          format: 'JSON',
          description: 'Customer support resolution'
        },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'input-1',
        target: 'agent-1',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      },
      {
        id: 'e2-3',
        source: 'agent-1',
        target: 'agent-2',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      },
      {
        id: 'e3-4',
        source: 'agent-2',
        target: 'output-1',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      },
    ]
  },
  "wf2": {
    nodes: [
      {
        id: 'input-1',
        type: 'input',
        position: { x: 250, y: 50 },
        data: {
          label: 'Lead Information',
          format: 'JSON',
          description: 'Sales lead information'
        },
      },
      {
        id: 'agent-1',
        type: 'agent',
        position: { x: 250, y: 200 },
        data: {
          label: 'Pre-screening Agent',
          llm: 'GPT-4',
          tools: ['Lead Scoring', 'Contact Validation']
        },
      },
      {
        id: 'if-1',
        type: 'if',
        position: { x: 250, y: 350 },
        data: {
          label: 'Qualified Lead Check',
          condition: 'lead_score > 70',
          description: 'Check if lead is qualified'
        },
      },
      {
        id: 'agent-2',
        type: 'agent',
        position: { x: 100, y: 500 },
        data: {
          label: 'Lead Nurturing Agent',
          llm: 'Claude-3',
          tools: ['Email Campaigns', 'CRM Update']
        },
      },
      {
        id: 'agent-3',
        type: 'agent',
        position: { x: 400, y: 500 },
        data: {
          label: 'Sales Agent',
          llm: 'GPT-4',
          tools: ['Sales Pitch Generator', 'Meeting Scheduler']
        },
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 100, y: 650 },
        data: {
          label: 'Nurturing Queue',
          format: 'JSON',
          description: 'Leads for nurturing'
        },
      },
      {
        id: 'output-2',
        type: 'output',
        position: { x: 400, y: 650 },
        data: {
          label: 'Sales Queue',
          format: 'JSON',
          description: 'Qualified leads for sales'
        },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'input-1',
        target: 'agent-1',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: 'e2-3',
        source: 'agent-1',
        target: 'if-1',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: 'e3-4',
        source: 'if-1',
        target: 'agent-2',
        sourceHandle: 'false',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: 'e3-5',
        source: 'if-1',
        target: 'agent-3',
        sourceHandle: 'true',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: 'e4-6',
        source: 'agent-2',
        target: 'output-1',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: 'e5-7',
        source: 'agent-3',
        target: 'output-2',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ]
  },
  "wf3": {
    // Document Processing workflow data...
    nodes: [
      {
        id: 'input-1',
        type: 'input',
        position: { x: 250, y: 50 },
        data: {
          label: 'Document Input',
          format: 'PDF',
          description: 'Document for processing'
        },
      },
      {
        id: 'agent-1',
        type: 'agent',
        position: { x: 250, y: 200 },
        data: {
          label: 'Document Processing Agent',
          llm: 'GPT-4',
          tools: ['OCR', 'Text Extraction']
        },
      },
      {
        id: 'agent-2',
        type: 'agent',
        position: { x: 250, y: 350 },
        data: {
          label: 'Validation Agent',
          llm: 'Claude-3',
          tools: ['Data Validation', 'Error Detection']
        },
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 250, y: 500 },
        data: {
          label: 'Structured Data',
          format: 'JSON',
          description: 'Validated structured data'
        },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'input-1',
        target: 'agent-1',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: 'e2-3',
        source: 'agent-1',
        target: 'agent-2',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: 'e3-4',
        source: 'agent-2',
        target: 'output-1',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ]
  }
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
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [] });
  
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

  // Validate workflow when nodes or edges change
  useEffect(() => {
    const validationResult = validateWorkflow(nodes, edges);
    setValidation(validationResult);
  }, [nodes, edges]);
  
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
    } else if (node.type === 'if') {
      toast.info("If Statement editor would open here", {
        description: "Configure conditional logic"
      });
    }
  }, []);
  
  const onNodeDragStop: NodeMouseHandler = useCallback((event, node) => {
    // Check for intersections with other nodes for grouping, etc.
    console.log("Node dragged:", node);
  }, []);
  
  const onSaveFlow = useCallback(() => {
    // Validate workflow before saving
    const validationResult = validateWorkflow(nodes, edges);
    
    if (!validationResult.isValid) {
      toast.error("Cannot save workflow with errors", {
        description: validationResult.errors.join(", ")
      });
      return;
    }
    
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

  // Load a saved workflow
  const handleLoadWorkflow = useCallback((workflowId: string) => {
    console.log("Loading workflow:", workflowId);
    const workflow = savedWorkflowsData[workflowId as keyof typeof savedWorkflowsData];
    
    if (workflow) {
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
      setSelectedWorkflowId(workflowId);
      toast.success("Workflow loaded successfully");
      
      // Fit view after loading workflow
      setTimeout(() => {
        reactFlowInstance?.fitView({ padding: 0.2 });
      }, 200);
    } else {
      toast.error("Failed to load workflow");
    }
  }, [reactFlowInstance, setNodes, setEdges]);

  // Handle drag start event
  const handleDragStart = useCallback((event: React.DragEvent, nodeType: string, data: any) => {
    console.log("Drag start from control panel:", { nodeType, data });
    event.dataTransfer.setData("application/reactflow/type", nodeType);
    event.dataTransfer.setData("application/reactflow/data", JSON.stringify(data));
    event.dataTransfer.effectAllowed = "move";
  }, []);

  return (
    <div className="flex h-full">
      <ControlPanel 
        onDragStart={handleDragStart} 
        agents={agents}
        onLoadWorkflow={handleLoadWorkflow}
        selectedWorkflowId={selectedWorkflowId}
      />
      
      <div 
        ref={reactFlowWrapper} 
        className="flex-1 h-full border-2 border-dashed border-border relative" 
        style={{ minHeight: "500px" }}
      >
        {showHelp && nodes.length <= 3 && !selectedWorkflowId && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg z-10 text-center max-w-md">
            <p className="text-sm text-muted-foreground mb-2">
              Drag components from the left panel and drop them here to build your workflow.
            </p>
            <p className="text-xs text-muted-foreground">
              Start with Input node → Add Agents or Teams → End with Output node.
            </p>
          </div>
        )}

        {!validation.isValid && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 w-[80%] max-w-md">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Workflow Validation Error</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4 text-sm mt-1">
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
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
              onClick={onSaveFlow}
              disabled={!validation.isValid}
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
          
          {validation.isValid && nodes.length > 0 && (
            <Panel position="top-left" className="ml-80 mt-2">
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-md border border-green-200">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Workflow validation successful</span>
              </div>
            </Panel>
          )}
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
