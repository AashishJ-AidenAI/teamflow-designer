
import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Brain, Edit, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export interface AgentNodeData {
  label: string;
  llm: string;
  tools: string[];
  description?: string;
  onUpdate?: (id: string, data: Partial<AgentNodeData>) => void;
}

const AgentNode = ({ 
  id,
  data, 
  selected,
}: {
  id: string;
  data: AgentNodeData;
  selected: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<{
    label: string;
    llm: string;
    tools: string[];
    description?: string;
  }>({
    label: data?.label || "Agent",
    llm: data?.llm || "GPT-4",
    tools: data?.tools || [],
    description: data?.description || "",
  });
  
  const [newTool, setNewTool] = useState<string>("");

  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditData({
      label: data?.label || "Agent",
      llm: data?.llm || "GPT-4",
      tools: [...(data?.tools || [])],
      description: data?.description || "",
    });
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setNewTool("");
  };

  const handleSaveEdit = () => {
    if (data.onUpdate) {
      data.onUpdate(id, editData);
      toast.success("Agent updated successfully");
    } else {
      console.warn("No update handler provided for agent node");
      toast.error("Could not update agent: No handler provided");
    }
    setIsEditing(false);
    setNewTool("");
  };
  
  const handleAddTool = () => {
    if (newTool.trim() === "") return;
    
    setEditData(prev => ({
      ...prev,
      tools: [...prev.tools, newTool.trim()]
    }));
    
    setNewTool("");
  };
  
  const handleRemoveTool = (toolToRemove: string) => {
    setEditData(prev => ({
      ...prev,
      tools: prev.tools.filter(tool => tool !== toolToRemove)
    }));
  };

  return (
    <TooltipProvider>
      <div className={`w-64 p-3 rounded-md bg-purple-600 text-white ${selected ? 'ring-2 ring-ring' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="font-medium">{data?.label || "Agent"}</span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 w-7 p-0"
                onClick={handleOpenEdit}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Edit agent
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-white/80">LLM:</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded-sm">{data?.llm || "GPT-4"}</span>
          </div>
          
          <div className="mt-2">
            <span className="text-white/80">Tools:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {data?.tools && data.tools.slice(0, 3).map((tool, index) => (
                <span 
                  key={index} 
                  className="bg-white/20 px-1.5 py-0.5 rounded-sm text-[10px] flex items-center gap-1"
                >
                  <Wrench className="h-3 w-3" />
                  {tool}
                </span>
              ))}
              {data?.tools && data.tools.length > 3 && (
                <span className="bg-white/20 px-1.5 py-0.5 rounded-sm text-[10px]">
                  +{data.tools.length - 3} more
                </span>
              )}
            </div>
          </div>
          
          {data?.description && (
            <div className="mt-2 text-white/80">
              {data.description}
            </div>
          )}
        </div>
        
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          style={{ background: "#fff", borderRadius: "50%" }}
        />
        
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          style={{ background: "#fff", borderRadius: "50%" }}
        />
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editData.label}
                onChange={(e) => setEditData(prev => ({ ...prev, label: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="llm" className="text-right">
                LLM Model
              </Label>
              <Input
                id="llm"
                value={editData.llm}
                onChange={(e) => setEditData(prev => ({ ...prev, llm: e.target.value }))}
                className="col-span-3"
                placeholder="e.g., GPT-4, Claude-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="tools" className="text-right mt-2">
                Tools
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="tools"
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    placeholder="Add a tool"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTool();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleAddTool}
                    type="button"
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {editData.tools.map((tool, index) => (
                    <Badge key={index} variant="secondary" className="flex gap-1 items-center">
                      <span>{tool}</span>
                      <button
                        type="button"
                        className="text-xs hover:text-destructive"
                        onClick={() => handleRemoveTool(tool)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Description
              </Label>
              <Input
                id="description"
                value={editData.description || ""}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                placeholder="Agent description (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default AgentNode;
