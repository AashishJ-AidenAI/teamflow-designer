
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, Users, Check } from "lucide-react";
import { ExecutionStrategy } from "../teams/TeamNode";

// Sample client data (in a real app, this would come from an API)
const availableClients = [
  "Client A", "Client B", "Client C", "Client D", "Client E",
  "Client F", "Client G", "Client H", "Client I", "Client J"
];

interface ClientManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: {
    id: string;
    name: string;
    strategy: ExecutionStrategy;
    agents: string[];
    active: boolean;
    clientAssigned: string[];
  };
  onSave: (teamId: string, updatedClients: string[]) => void;
}

const ClientManagementModal: React.FC<ClientManagementModalProps> = ({
  isOpen,
  onClose,
  team,
  onSave
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      setSelectedClients(team.clientAssigned);
    }
  }, [isOpen, team]);
  
  const filteredClients = availableClients.filter(client => 
    client.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedClients.includes(client)
  );
  
  const handleAddClient = (client: string) => {
    setSelectedClients(prev => [...prev, client]);
  };
  
  const handleRemoveClient = (client: string) => {
    setSelectedClients(prev => prev.filter(c => c !== client));
  };
  
  const handleSave = () => {
    onSave(team.id, selectedClients);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Client Access for {team.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {selectedClients.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Selected Clients</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedClients.map(client => (
                    <Badge 
                      key={client} 
                      variant="secondary"
                      className="flex items-center gap-1 pl-2 pr-1 py-1"
                    >
                      {client}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 hover:bg-destructive/20 rounded-full" 
                        onClick={() => handleRemoveClient(client)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium mb-2">Available Clients</h3>
              {filteredClients.length > 0 ? (
                <ScrollArea className="h-[200px] rounded-md border">
                  <div className="p-4 space-y-2">
                    {filteredClients.map(client => (
                      <div 
                        key={client}
                        className="flex justify-between items-center p-2 hover:bg-accent rounded-md cursor-pointer"
                        onClick={() => handleAddClient(client)}
                      >
                        <span>{client}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 hover:bg-primary/20 rounded-full"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex justify-center items-center h-[200px] rounded-md border">
                  <span className="text-muted-foreground">
                    {searchTerm ? "No clients found matching search" : "No more clients available"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientManagementModal;
