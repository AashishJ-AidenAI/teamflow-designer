
import { useState } from "react";
import { Bot, MoreVertical, Edit, Trash2, Share2, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Agent } from "@/context/AgentContext";
import { useAgents } from "@/context/AgentContext";
import { toast } from "sonner";

interface AgentCardProps {
  agent: Agent;
  onEdit: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onEdit }) => {
  const { updateAgent } = useAgents();
  const [isActive, setIsActive] = useState(agent.active);
  
  const handleActiveChange = (checked: boolean) => {
    setIsActive(checked);
    updateAgent({
      ...agent,
      active: checked
    });
    toast.success(`${agent.name} is now ${checked ? 'active' : 'inactive'}`);
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          {agent.name}
        </CardTitle>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Active</span>
            <Switch checked={isActive} onCheckedChange={handleActiveChange} />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Assign to Client</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => toast.error("Agent templates cannot be deleted.")}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">LLM:</span>
            <Badge variant="outline">{agent.llm}</Badge>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Response Time:</span>
            <div className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-primary" />
              <span>{agent.responseTime}ms</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Usage Count:</span>
            <span>{agent.usageCount}</span>
          </div>
          
          <div className="mt-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">Tools:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {agent.tools.map((tool, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;
