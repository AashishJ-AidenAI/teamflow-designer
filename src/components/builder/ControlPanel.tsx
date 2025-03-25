
import { useState, useCallback, useEffect } from "react";
import { Bot, Users, Search, ChevronDown, ChevronUp, CircleArrowRight, CircleArrowDown, Settings, ArrowLeftRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ExecutionStrategy } from "../teams/TeamNode";
import { Agent } from "@/context/AgentContext";

interface ControlPanelProps {
  onDragStart?: (event: React.DragEvent, nodeType: string, data: any) => void;
  agents: Agent[];
  onLoadWorkflow?: (workflowId: string) => void;
  selectedWorkflowId?: string | null;
}

type TeamItem = {
  id: string;
  type: "team";
  name: string;
  strategy: ExecutionStrategy;
};

type WorkflowItem = {
  id: string;
  name: string;
  lastModified: Date;
  agents: string[];
  teams: string[];
};

// Mock saved workflows - in a real app, these would come from a database or context
const savedWorkflows: WorkflowItem[] = [
  {
    id: "wf1",
    name: "Customer Support Flow",
    lastModified: new Date("2024-03-15"),
    agents: ["Customer Support Agent", "Document Processing Agent"],
    teams: ["Support Team"]
  },
  {
    id: "wf2",
    name: "Sales Qualification Flow",
    lastModified: new Date("2024-03-10"),
    agents: ["Sales Agent", "Pre-screening Agent"],
    teams: []
  },
  {
    id: "wf3",
    name: "Document Processing",
    lastModified: new Date("2024-03-05"),
    agents: ["Document Processing Agent", "Validation Agent"],
    teams: ["Content Team"]
  }
];

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onDragStart, 
  agents, 
  onLoadWorkflow,
  selectedWorkflowId
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>(["workflows", "workflowNodes", "agents", "teams"]);
  
  const teams: TeamItem[] = [
    { id: "t1", type: "team", name: "Research Team", strategy: "parallel" },
    { id: "t2", type: "team", name: "Content Team", strategy: "selection" },
    { id: "t3", type: "team", name: "Dev Team", strategy: "sequential" },
  ];
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };
  
  const isExpanded = (section: string) => expandedSections.includes(section);
  
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredWorkflows = savedWorkflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.agents.some(agent => agent.toLowerCase().includes(searchTerm.toLowerCase())) ||
    workflow.teams.some(team => team.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDragStart = useCallback((event: React.DragEvent, nodeType: string, data: any) => {
    console.log("ControlPanel handleDragStart:", { nodeType, data });
    
    if (onDragStart) {
      onDragStart(event, nodeType, data);
    } else {
      console.log("Using default drag handling (no onDragStart provided)");
      event.dataTransfer.setData("application/reactflow/type", nodeType);
      event.dataTransfer.setData("application/reactflow/data", JSON.stringify(data));
      event.dataTransfer.effectAllowed = "move";
    }
  }, [onDragStart]);

  return (
    <div className="h-full w-72 bg-card border-r border-border p-4 flex flex-col">
      <div className="mb-4">
        <h2 className="font-semibold text-lg mb-2">Agent Workflow Builder</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 pr-3">
        <div className="space-y-4">
          {/* Saved Workflows Section */}
          <div>
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("workflows")}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <h3 className="font-medium">Saved Workflows</h3>
              </div>
              {isExpanded("workflows") ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
            
            {isExpanded("workflows") && (
              <div className="mt-2 space-y-2">
                {filteredWorkflows.map(workflow => (
                  <div
                    key={workflow.id}
                    className={`p-2 border border-border rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
                      selectedWorkflowId === workflow.id ? "bg-accent border-primary" : ""
                    }`}
                    onClick={() => onLoadWorkflow && onLoadWorkflow(workflow.id)}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{workflow.name}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {workflow.agents.slice(0, 2).map((agent, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {agent}
                          </Badge>
                        ))}
                        {workflow.agents.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{workflow.agents.length - 2} more
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        Last modified: {workflow.lastModified.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredWorkflows.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-2">
                    No workflows found
                  </div>
                )}
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Workflow Nodes Section */}
          <div>
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("workflowNodes")}
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-green-500" />
                <h3 className="font-medium">Workflow Nodes</h3>
              </div>
              {isExpanded("workflowNodes") ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
            
            {isExpanded("workflowNodes") && (
              <div className="mt-2 space-y-2">
                <div
                  className="p-2 border border-border rounded-md cursor-move hover:bg-accent/50 transition-colors"
                  draggable
                  onDragStart={(event) => handleDragStart(event, "input", {
                    label: "Input",
                    format: "JSON",
                    description: "Workflow starting point"
                  })}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CircleArrowRight className="h-4 w-4 text-green-500" />
                      <span>Input Node</span>
                    </div>
                    <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">
                      Start
                    </span>
                  </div>
                </div>
                
                <div
                  className="p-2 border border-border rounded-md cursor-move hover:bg-accent/50 transition-colors"
                  draggable
                  onDragStart={(event) => handleDragStart(event, "if", {
                    label: "If Statement",
                    condition: "x > 0",
                    description: "Conditional branch"
                  })}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowLeftRight className="h-4 w-4 text-amber-500" />
                      <span>If Statement</span>
                    </div>
                    <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">
                      Control
                    </span>
                  </div>
                </div>
                
                <div
                  className="p-2 border border-border rounded-md cursor-move hover:bg-accent/50 transition-colors"
                  draggable
                  onDragStart={(event) => handleDragStart(event, "output", {
                    label: "Output",
                    format: "JSON",
                    description: "Workflow endpoint"
                  })}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CircleArrowDown className="h-4 w-4 text-blue-500" />
                      <span>Output Node</span>
                    </div>
                    <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">
                      End
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Agents Section */}
          <div>
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("agents")}
            >
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Agents</h3>
              </div>
              {isExpanded("agents") ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
            
            {isExpanded("agents") && (
              <div className="mt-2 space-y-2">
                {filteredAgents.map(agent => (
                  <div
                    key={agent.id}
                    className="p-2 border border-border rounded-md cursor-move hover:bg-accent/50 transition-colors"
                    draggable
                    onDragStart={(event) => handleDragStart(event, "agent", {
                      label: agent.name,
                      llm: agent.llm,
                      tools: agent.tools || ["Web Search", "Calculator", "Text Analysis"]
                    })}
                  >
                    <div className="flex items-center justify-between">
                      <span>{agent.name}</span>
                      <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">
                        {agent.llm}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Teams Section */}
          <div>
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("teams")}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium">Teams</h3>
              </div>
              {isExpanded("teams") ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
            
            {isExpanded("teams") && (
              <div className="mt-2 space-y-2">
                {filteredTeams.map(team => (
                  <div
                    key={team.id}
                    className="p-2 border border-border rounded-md cursor-move hover:bg-accent/50 transition-colors"
                    draggable
                    onDragStart={(event) => handleDragStart(event, "team", {
                      label: team.name,
                      strategy: team.strategy,
                      agents: ["Text Summarizer", "Data Analyzer", "Content Writer"]
                    })}
                  >
                    <div className="flex items-center justify-between">
                      <span>{team.name}</span>
                      <span className="text-xs bg-secondary px-1.5 py-0.5 rounded capitalize">
                        {team.strategy}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
      
      <div className="mt-4 pt-2 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2 p-2 bg-accent/50 rounded">
          Build your workflow with Input → Process (Agents/Teams) → Output. Connect nodes by dragging between handles.
        </div>
        <Button className="w-full">Save Workflow</Button>
      </div>
    </div>
  );
};

export default ControlPanel;
