
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Team, Agent } from "@/context/AgentContext";
import { ExecutionStrategy } from "@/components/teams/TeamNode";

interface NewTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (team: Team) => void;
  allAgents: Agent[];
}

const NewTeamModal = ({
  isOpen,
  onClose,
  onSave,
  allAgents
}: NewTeamModalProps) => {
  const [name, setName] = useState("");
  const [strategy, setStrategy] = useState<ExecutionStrategy>("parallel");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [active, setActive] = useState(true);
  const [open, setOpen] = useState(false);

  const resetForm = () => {
    setName("");
    setStrategy("parallel");
    setSelectedAgents([]);
    setActive(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTeam: Team = {
      id: `t-${Date.now()}`,
      name,
      strategy,
      agents: selectedAgents,
      active,
      clientAssigned: []
    };
    
    onSave(newTeam);
    resetForm();
  };

  const toggleAgentSelection = (agentName: string) => {
    if (selectedAgents.includes(agentName)) {
      setSelectedAgents(selectedAgents.filter(a => a !== agentName));
    } else {
      setSelectedAgents([...selectedAgents, agentName]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Configure a new team by selecting agents and execution strategy.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Team Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="strategy" className="text-right">
              Strategy
            </Label>
            <div className="col-span-3">
              <select
                id="strategy"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as ExecutionStrategy)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="parallel">Parallel (Execute all agents simultaneously)</option>
                <option value="sequential">Sequential (Execute agents in order)</option>
                <option value="selection">Selection (Pick best agent for the task)</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Active
            </Label>
            <div className="col-span-3">
              <Switch
                checked={active}
                onCheckedChange={setActive}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Agents
            </Label>
            <div className="col-span-3">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between w-full text-left"
                  >
                    {selectedAgents.length > 0
                      ? `${selectedAgents.length} agent${selectedAgents.length > 1 ? 's' : ''} selected`
                      : "Select agents..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search agents..." />
                    <CommandList>
                      <CommandEmpty>No agents found.</CommandEmpty>
                      <CommandGroup>
                        {allAgents.map((agent) => (
                          <CommandItem
                            key={agent.id}
                            value={agent.name}
                            onSelect={() => toggleAgentSelection(agent.name)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedAgents.includes(agent.name)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {agent.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {selectedAgents.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-1">Selected agents:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedAgents.map(agentName => (
                      <div 
                        key={agentName} 
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center"
                      >
                        {agentName}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name || selectedAgents.length === 0}>
              Create Team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTeamModal;
