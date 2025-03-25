
import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Agent } from "@/context/AgentContext";
import { useKnowledgebase } from "@/context/KnowledgebaseContext";

interface EditAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agent: Agent) => void;
  agent: Agent | null;
}

const EditAgentModal = ({
  isOpen,
  onClose,
  onSave,
  agent
}: EditAgentModalProps) => {
  const { knowledgebases } = useKnowledgebase();
  const [formData, setFormData] = useState<Partial<Agent>>({});
  const [newTool, setNewTool] = useState("");

  useEffect(() => {
    if (agent) {
      setFormData({
        ...agent
      });
    } else {
      setFormData({});
    }
  }, [agent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agent && formData) {
      onSave({
        ...agent,
        ...formData
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      active: checked
    }));
  };

  const addTool = () => {
    if (newTool.trim() && formData.tools) {
      if (!formData.tools.includes(newTool.trim())) {
        setFormData(prev => ({
          ...prev,
          tools: [...(prev.tools || []), newTool.trim()]
        }));
      }
      setNewTool("");
    }
  };

  const removeTool = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      tools: (prev.tools || []).filter(t => t !== tool)
    }));
  };

  const handleKnowledgebaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      knowledgebaseId: value === "none" ? undefined : value
    }));
  };

  if (!agent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Agent</DialogTitle>
          <DialogDescription>
            Modify the agent's properties and capabilities.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="llm" className="text-right">
              LLM
            </Label>
            <Input
              id="llm"
              name="llm"
              value={formData.llm || ""}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Active
            </Label>
            <div className="col-span-3">
              <Switch
                checked={formData.active || false}
                onCheckedChange={handleSwitchChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <Label className="text-right pt-2">
              Tools
            </Label>
            <div className="col-span-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.tools?.map((tool) => (
                  <Badge key={tool} className="gap-1 pl-2">
                    {tool}
                    <button
                      type="button"
                      onClick={() => removeTool(tool)}
                      className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tool..."
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addTool}
                  disabled={!newTool.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="knowledgebase" className="text-right">
              Knowledgebase
            </Label>
            <select
              id="knowledgebase"
              name="knowledgebase"
              value={formData.knowledgebaseId || "none"}
              onChange={handleKnowledgebaseChange}
              className="col-span-3 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="none">None</option>
              {knowledgebases.map(kb => (
                <option key={kb.id} value={kb.id}>{kb.name}</option>
              ))}
            </select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAgentModal;
