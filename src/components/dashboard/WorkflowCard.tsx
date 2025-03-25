
import { useCallback, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GitBranch, 
  Users, 
  Bot,
  ArrowRightLeft,
  Trash2,
  Edit,
  Copy
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import ClientManager from "./ClientManager";

interface WorkflowCardProps {
  workflow: {
    id: string;
    name: string;
    agents: string[];
    teams: string[];
    inputType: string;
    outputType: string;
    clients: string[];
    active: boolean;
    createdBy: string;
    lastModified: Date;
  };
  allClients: {
    id: string;
    name: string;
  }[];
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, allClients }) => {
  const [isClientManagerOpen, setIsClientManagerOpen] = useState(false);
  
  const handleClientUpdate = useCallback((clients: string[]) => {
    // Here you would update the clients assigned to this workflow
    toast.success(`Updated clients for ${workflow.name}`);
  }, [workflow.name]);
  
  const handleDuplicate = useCallback(() => {
    toast.success(`Duplicated workflow: ${workflow.name}`);
  }, [workflow.name]);
  
  const handleEdit = useCallback(() => {
    toast.success(`Editing workflow: ${workflow.name}`);
  }, [workflow.name]);
  
  const handleDelete = useCallback(() => {
    toast.success(`Deleted workflow: ${workflow.name}`);
  }, [workflow.name]);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 relative">
        <div className="absolute top-2 right-2">
          <Badge 
            variant={workflow.active ? "default" : "secondary"}
            className="font-normal"
          >
            {workflow.active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <CardTitle className="flex items-center gap-2 text-lg">
          <GitBranch className="h-4 w-4 text-primary" />
          {workflow.name}
        </CardTitle>
        <div className="flex gap-1 mt-1">
          <Badge variant="outline" className="text-xs font-normal">
            {workflow.inputType} → {workflow.outputType}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-muted-foreground mb-1 text-xs">Agents</p>
            <div className="flex flex-wrap gap-1">
              {workflow.agents.map((agent, idx) => (
                <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                  <Bot className="h-3 w-3" />
                  <span className="text-xs truncate max-w-[100px]">{agent}</span>
                </Badge>
              ))}
              {workflow.agents.length === 0 && (
                <span className="text-xs text-muted-foreground">No agents assigned</span>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-muted-foreground mb-1 text-xs">Teams</p>
            <div className="flex flex-wrap gap-1">
              {workflow.teams.map((team, idx) => (
                <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span className="text-xs truncate max-w-[100px]">{team}</span>
                </Badge>
              ))}
              {workflow.teams.length === 0 && (
                <span className="text-xs text-muted-foreground">No teams assigned</span>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-muted-foreground mb-1 text-xs">Assigned Clients</p>
            <div className="flex flex-wrap gap-1">
              {workflow.clients.map((clientId, idx) => {
                const client = allClients.find(c => c.id === clientId);
                return (
                  <Badge key={idx} variant="outline" className="text-xs font-normal">
                    {client?.name || clientId}
                  </Badge>
                );
              })}
              {workflow.clients.length === 0 && (
                <span className="text-xs text-muted-foreground">No clients assigned</span>
              )}
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Last modified {formatDistanceToNow(workflow.lastModified)} ago by {workflow.createdBy}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-3 pb-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs gap-1"
          onClick={() => setIsClientManagerOpen(true)}
        >
          <Users className="h-3 w-3" />
          Assign
        </Button>
        
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleDuplicate}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
      
      <ClientManager 
        isOpen={isClientManagerOpen}
        onClose={() => setIsClientManagerOpen(false)}
        onSave={handleClientUpdate}
        teamName={workflow.name}
        selectedClients={workflow.clients}
        allClients={allClients}
      />
    </Card>
  );
};

export default WorkflowCard;
