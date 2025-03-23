
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Search, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Client {
  id: string;
  name: string;
}

interface ClientManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clients: string[]) => void;
  teamName: string;
  selectedClients: string[];
  allClients: Client[];
}

const ClientManager = ({
  isOpen,
  onClose,
  onSave,
  teamName,
  selectedClients,
  allClients,
}: ClientManagerProps) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setSelected(selectedClients);
  }, [selectedClients, isOpen]);

  const filteredClients = allClients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleClient = (clientId: string) => {
    setSelected((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Clients for {teamName}</DialogTitle>
          <DialogDescription>
            Select clients to assign to this team. Search to filter the client list.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((clientId) => {
            const client = allClients.find((c) => c.id === clientId);
            return (
              <Badge key={clientId} variant="secondary" className="flex items-center gap-1">
                {client?.name}
                <button onClick={() => toggleClient(clientId)} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          {selected.length === 0 && (
            <div className="text-sm text-muted-foreground">No clients selected</div>
          )}
        </div>

        <ScrollArea className="h-60">
          <div className="space-y-1">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer ${
                  selected.includes(client.id) ? "bg-secondary" : "hover:bg-secondary/50"
                }`}
                onClick={() => toggleClient(client.id)}
              >
                <span>{client.name}</span>
                {selected.includes(client.id) && (
                  <CheckCircle className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}
            {filteredClients.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No clients found matching "{search}"
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientManager;
