
import { useState, useCallback } from "react";
import { Bot, Users, Search, PlusCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExecutionStrategy } from "../teams/TeamNode";

interface AgentItem {
  id: string;
  type: "agent";
  name: string;
  llm: string;
}

interface TeamItem {
  id: string;
  type: "team";
  name: string;
  strategy: ExecutionStrategy;
}

type Item = AgentItem | TeamItem;

interface ControlPanelProps {
  onDragStart?: (event: React.DragEvent, nodeType: string, data: any) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onDragStart }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [agentsExpanded, setAgentsExpanded] = useState(true);
  const [teamsExpanded, setTeamsExpanded] = useState(true);
  
  const agents: AgentItem[] = [
    { id: "a1", type: "agent", name: "Text Summarizer", llm: "GPT-4" },
    { id: "a2", type: "agent", name: "Data Analyzer", llm: "Claude-3" },
    { id: "a3", type: "agent", name: "Code Generator", llm: "Gemini Pro" },
    { id: "a4", type: "agent", name: "Content Writer", llm: "GPT-4" },
  ];
  
  const teams: TeamItem[] = [
    { id: "t1", type: "team", name: "Research Team", strategy: "parallel" },
    { id: "t2", type: "team", name: "Content Team", strategy: "selection" },
    { id: "t3", type: "team", name: "Dev Team", strategy: "sequential" },
  ];
  
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    // This is important for drag feedback
    const dragPreview = document.createElement('div');
    dragPreview.className = 'bg-primary text-white p-2 rounded';
    dragPreview.textContent = nodeType === 'agent' ? 'Agent' : 'Team';
    document.body.appendChild(dragPreview);
    
    // Handle cleanup in a timely manner
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
  }, [onDragStart]);

  return (
    <div className="h-full w-72 bg-card border-r border-border p-4 flex flex-col">
      <div className="mb-4">
        <h2 className="font-semibold text-lg mb-2">Components</h2>
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
      
      <div className="flex-1 overflow-auto space-y-4">
        {/* Agents Section */}
        <div>
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setAgentsExpanded(!agentsExpanded)}
          >
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Agents</h3>
            </div>
            {agentsExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
          
          {agentsExpanded && (
            <div className="mt-2 space-y-2">
              {filteredAgents.map(agent => (
                <div
                  key={agent.id}
                  className="p-2 border border-border rounded-md cursor-move hover:bg-accent/50 transition-colors"
                  draggable
                  onDragStart={(event) => handleDragStart(event, "agent", {
                    label: agent.name,
                    llm: agent.llm,
                    tools: ["Web Search", "Calculator", "Text Analysis"]
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
              
              <Button variant="ghost" size="sm" className="w-full flex justify-center items-center gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Create New Agent</span>
              </Button>
            </div>
          )}
        </div>
        
        <Separator />
        
        {/* Teams Section */}
        <div>
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setTeamsExpanded(!teamsExpanded)}
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <h3 className="font-medium">Teams</h3>
            </div>
            {teamsExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
          
          {teamsExpanded && (
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
              
              <Button variant="ghost" size="sm" className="w-full flex justify-center items-center gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Create New Team</span>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 pt-2 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2 p-2 bg-accent/50 rounded">
          Drag and drop agents or teams onto the canvas to build your workflow. Connect them by dragging from handles.
        </div>
        <Button className="w-full">Save Workflow</Button>
      </div>
    </div>
  );
};

export default ControlPanel;
