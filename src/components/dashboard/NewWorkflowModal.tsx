
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Agent } from "@/context/AgentContext";
import { GitBranch } from "lucide-react";

interface NewWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workflow: any) => void;
  allAgents: Agent[];
  allTeams: any[];
  allClients: { id: string; name: string }[];
}

const NewWorkflowModal: React.FC<NewWorkflowModalProps> = ({
  isOpen,
  onClose,
  onSave,
  allAgents,
  allTeams,
  allClients,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inputType, setInputType] = useState("JSON");
  const [outputType, setOutputType] = useState("JSON");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newWorkflow = {
      id: `wf-${Date.now()}`,
      name,
      description,
      inputType,
      outputType,
      agents: selectedAgents,
      teams: selectedTeams,
      clients: selectedClients,
      active: true,
      createdBy: "Admin",
      lastModified: new Date(),
    };
    
    onSave(newWorkflow);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setInputType("JSON");
    setOutputType("JSON");
    setSelectedAgents([]);
    setSelectedTeams([]);
    setSelectedClients([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleAgent = (agentId: string) => {
    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const toggleTeam = (teamId: string) => {
    setSelectedTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const toggleClient = (clientId: string) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const inputTypes = ["JSON", "Text", "File", "API Request"];
  const outputTypes = ["JSON", "Text", "Email", "Database", "API Response"];

  return (
    <Dialog open={isOpen} onOpenChange={state => !state && handleClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Create New Workflow
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workflow Name</Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter workflow name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief description"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inputType">Input Type</Label>
              <Select value={inputType} onValueChange={setInputType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select input type" />
                </SelectTrigger>
                <SelectContent>
                  {inputTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="outputType">Output Type</Label>
              <Select value={outputType} onValueChange={setOutputType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select output type" />
                </SelectTrigger>
                <SelectContent>
                  {outputTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Agents</Label>
            <ScrollArea className="h-[100px] border rounded-md p-2">
              <div className="space-y-2">
                {allAgents.map(agent => (
                  <div key={agent.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`agent-${agent.id}`}
                      checked={selectedAgents.includes(agent.name)}
                      onCheckedChange={() => toggleAgent(agent.name)}
                    />
                    <Label htmlFor={`agent-${agent.id}`} className="text-sm cursor-pointer">
                      {agent.name}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <Label>Select Teams</Label>
            <ScrollArea className="h-[100px] border rounded-md p-2">
              <div className="space-y-2">
                {allTeams.map(team => (
                  <div key={team.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`team-${team.id}`}
                      checked={selectedTeams.includes(team.name)}
                      onCheckedChange={() => toggleTeam(team.name)}
                    />
                    <Label htmlFor={`team-${team.id}`} className="text-sm cursor-pointer">
                      {team.name}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <Label>Assign to Clients</Label>
            <ScrollArea className="h-[100px] border rounded-md p-2">
              <div className="space-y-2">
                {allClients.map(client => (
                  <div key={client.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`client-${client.id}`}
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={() => toggleClient(client.id)}
                    />
                    <Label htmlFor={`client-${client.id}`} className="text-sm cursor-pointer">
                      {client.name}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name || selectedAgents.length === 0 && selectedTeams.length === 0}>
              Create Workflow
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewWorkflowModal;
