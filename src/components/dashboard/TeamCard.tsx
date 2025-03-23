
import { useState } from "react";
import { Users, MoreVertical, Edit, Trash2, Share2, GitBranch, Zap, List } from "lucide-react";
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

type ExecutionStrategy = "parallel" | "selection" | "sequential";

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    strategy: ExecutionStrategy;
    agents: string[];
    active: boolean;
    clientAssigned: string[];
  };
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const [isActive, setIsActive] = useState(team.active);
  
  const handleActiveChange = (checked: boolean) => {
    setIsActive(checked);
    // Here you would update the team status in the backend
  };
  
  const StrategyIcon = {
    parallel: Zap,
    selection: List,
    sequential: GitBranch
  }[team.strategy];
  
  const strategyLabel = {
    parallel: "Parallel Execution",
    selection: "Selection Execution",
    sequential: "Sequential Execution"
  }[team.strategy];
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          <Users className="h-4 w-4 text-team" />
          {team.name}
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
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Assign to Client</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <StrategyIcon className="h-3.5 w-3.5 text-team" />
            <Badge variant="outline">{strategyLabel}</Badge>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Agents:</span>
            <span>{team.agents.length}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Client Access:</span>
            <span>{team.clientAssigned.length}</span>
          </div>
          
          <div className="mt-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">Agents:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {team.agents.map((agent, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {agent}
                </Badge>
              ))}
            </div>
          </div>
          
          {team.clientAssigned.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">Client Access:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {team.clientAssigned.map((client, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {client}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
