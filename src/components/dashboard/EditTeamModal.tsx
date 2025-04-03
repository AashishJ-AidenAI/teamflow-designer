
import { useState, useEffect } from "react";
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
import { Agent, Team, ExecutionStrategy } from "@/context/AgentContext";
import { Users } from "lucide-react";

interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (team: Team) => void;
  team: Team | null;
  allAgents: Agent[];
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({
  isOpen,
  onClose,
  onSave,
  team,
  allAgents,
}) => {
  const [name, setName] = useState("");
  const [strategy, setStrategy] = useState<ExecutionStrategy>("sequential");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (team) {
      setName(team.name);
      setStrategy(team.strategy);
      setSelectedAgents(team.agents);
      setActive(team.active);
    }
  }, [team]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!team) return;
    
    const updatedTeam: Team = {
      ...team,
      name,
      strategy,
      agents: selectedAgents,
      active
    };
    
    onSave(updatedTeam);
  };

  const resetForm = () => {
    if (team) {
      setName(team.name);
      setStrategy(team.strategy);
      setSelectedAgents(team.agents);
      setActive(team.active);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const toggleAgent = (agentName: string) => {
    setSelectedAgents(prev =>
      prev.includes(agentName)
        ? prev.filter(name => name !== agentName)
        : [...prev, agentName]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={state => !state && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Edit Team
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter team name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strategy">Execution Strategy</Label>
            <Select value={strategy} onValueChange={(value: ExecutionStrategy) => setStrategy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sequential">Sequential</SelectItem>
                <SelectItem value="parallel">Parallel</SelectItem>
                <SelectItem value="selection">Selection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="active" 
              checked={active} 
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') {
                  setActive(checked);
                }
              }}
            />
            <Label htmlFor="active">Active</Label>
          </div>

          <div className="space-y-2">
            <Label>Select Agents</Label>
            <ScrollArea className="h-[200px] border rounded-md p-2">
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name || selectedAgents.length === 0}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeamModal;
