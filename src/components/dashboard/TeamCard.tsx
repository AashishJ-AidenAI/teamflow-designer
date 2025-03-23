
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, GitBranch, List, Zap } from "lucide-react";
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
  onUpdateClientList: (teamId: string, clients: string[]) => void;
  allClients: { id: string; name: string }[];
}

const StrategyIcon = {
  parallel: Zap,
  selection: List,
  sequential: GitBranch,
};

const TeamCard = ({
  id,
  name,
  strategy,
  agents,
  active,
  clientAssigned,
  onUpdateClientList,
  allClients,
}: TeamCardProps) => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  
  const Icon = StrategyIcon[strategy];
  
  const clientNames = clientAssigned.map(
    (clientId) => allClients.find((c) => c.id === clientId)?.name || "Unknown Client"
  );
  
  const handleSaveClients = (clients: string[]) => {
    onUpdateClientList(id, clients);
    toast.success(`Updated client list for ${name}`);
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
              <h4 className="text-sm font-medium mb-1">Agents ({agents.length})</h4>
              <div className="flex flex-wrap gap-1">
                {agents.map((agent, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {agent}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Assigned Clients ({clientAssigned.length})</h4>
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
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-1"
            onClick={() => setIsClientModalOpen(true)}
          >
            <Users className="h-3.5 w-3.5" />
            Manage Clients
          </Button>
        </CardFooter>
      </Card>
      
      <ClientManager
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSave={handleSaveClients}
        teamName={name}
        selectedClients={clientAssigned}
        allClients={allClients}
      />
    </>
  );
};

export default TeamCard;
