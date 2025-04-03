
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, GitBranch, List, Zap, Edit } from "lucide-react";
import { ExecutionStrategy } from "@/components/teams/TeamNode";
import ClientManager from "./ClientManager";
import { toast } from "sonner";

interface TeamCardProps {
  id: string;
  name: string;
  strategy: ExecutionStrategy;
  agents: string[];
  active: boolean;
  clientAssigned: string[];
  onUpdateClientList?: (teamId: string, clients: string[]) => void;
  onEdit?: (teamId: string) => void;
  allClients?: { id: string; name: string }[];
}

// Alternative way to receive the props as a single 'team' object
interface TeamCardWithTeamProp {
  team: TeamCardProps;
  onUpdateClientList?: (teamId: string, clients: string[]) => void;
  onEdit?: (teamId: string) => void;
  allClients?: { id: string; name: string }[];
}

const StrategyIcon = {
  parallel: Zap,
  selection: List,
  sequential: GitBranch,
};

// Handle both ways of receiving props
const TeamCard = (props: TeamCardProps | TeamCardWithTeamProp) => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  
  // Normalize props whether they come as individual props or as a team object
  const teamProps = 'team' in props 
    ? props.team 
    : props;
  
  const { 
    id, 
    name, 
    strategy, 
    agents, 
    active, 
    clientAssigned = [] 
  } = teamProps;
  
  const onUpdateClientList = 'team' in props 
    ? props.onUpdateClientList 
    : props.onUpdateClientList;
  
  const onEdit = 'team' in props 
    ? props.onEdit 
    : props.onEdit;
  
  const allClients = 'team' in props 
    ? props.allClients || [] 
    : props.allClients || [];
  
  const Icon = StrategyIcon[strategy] || GitBranch;
  
  const clientNames = Array.isArray(clientAssigned) 
    ? clientAssigned.map(
        (clientId) => allClients.find((c) => c.id === clientId)?.name || "Unknown Client"
      )
    : [];
  
  const handleSaveClients = (clients: string[]) => {
    if (onUpdateClientList) {
      onUpdateClientList(id, clients);
      toast.success(`Updated client list for ${name}`);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(id);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold">{name}</CardTitle>
            <Badge variant={active ? "default" : "secondary"}>
              {active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-1">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="capitalize">{strategy} Execution</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2">
            <div>
              <h4 className="text-sm font-medium mb-1">Agents ({agents ? agents.length : 0})</h4>
              <div className="flex flex-wrap gap-1">
                {agents && agents.length > 0 ? (
                  agents.map((agent, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {agent}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No agents assigned</span>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Assigned Clients ({clientNames.length})</h4>
              <div className="flex flex-wrap gap-1">
                {clientNames.length > 0 ? (
                  clientNames.map((client, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {client}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No clients assigned</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 gap-1"
            onClick={() => setIsClientModalOpen(true)}
          >
            <Users className="h-3.5 w-3.5" />
            Manage Clients
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-none gap-1"
            onClick={handleEdit}
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </Card>
      
      <ClientManager
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSave={handleSaveClients}
        teamName={name}
        selectedClients={clientAssigned || []}
        allClients={allClients}
      />
    </>
  );
};

export default TeamCard;
