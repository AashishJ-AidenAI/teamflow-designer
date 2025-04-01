
import { useCallback, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Bot, Cog, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Define the data structure that will be passed to the node
export interface AgentNodeData {
  label: string;
  llm: string;
  tools: string[];
  onUpdate?: (id: string, data: Partial<AgentNodeData>) => void;
}

// Use Node from React Flow
const AgentNode = ({ 
  id, 
  data, 
  selected, 
  isConnectable 
}: {
  id: string;
  data: AgentNodeData;
  selected: boolean;
  isConnectable: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<{
    label: string;
    llm: string;
    tools: string[];
  }>({
    label: data?.label || "Unnamed Agent",
    llm: data?.llm || "GPT-4",
    tools: data?.tools || []
  });
  
  const [newTool, setNewTool] = useState("");

  const onNodeClick = useCallback(() => {
    console.log("Agent node clicked:", id);
  }, [id]);

  const handleOpenEdit = () => {
    setEditData({
      label: data?.label || "Unnamed Agent",
      llm: data?.llm || "GPT-4",
      tools: [...(data?.tools || [])]
    });
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
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
  };

  const handleAddTool = () => {
    if (newTool.trim() && !editData.tools.includes(newTool.trim())) {
      setEditData(prev => ({
        ...prev,
        tools: [...prev.tools, newTool.trim()]
      }));
      setNewTool("");
    }
  };

  const handleRemoveTool = (tool: string) => {
    setEditData(prev => ({
      ...prev,
      tools: prev.tools.filter(t => t !== tool)
    }));
  };

  return (
    <>
      <div 
        className={`w-64 p-3 rounded-md bg-primary text-primary-foreground shadow-md ${selected ? 'ring-2 ring-ring' : ''}`}
        onClick={onNodeClick}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span className="font-medium">{data?.label || "Unnamed Agent"}</span>
          </div>
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="p-1 hover:bg-white/20 rounded-sm transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit();
                  }}
                >
                  <Cog className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Configure agent
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 hover:bg-white/20 rounded-sm transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Remove agent
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        <div className="text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-white/80">LLM:</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded-sm">{data?.llm || "Unknown"}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {data?.tools && data.tools.map((tool, index) => (
              <span 
                key={index} 
                className="bg-white/20 px-1.5 py-0.5 rounded-sm text-[10px]"
              >
                {tool}
              </span>
            ))}
            {(!data?.tools || data.tools.length === 0) && (
              <span className="text-white/60 text-[10px]">No tools configured</span>
            )}
          </div>
        </div>
        
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          style={{ background: "#fff", borderRadius: "50%" }}
          isConnectable={isConnectable}
        />
        
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          style={{ background: "#fff", borderRadius: "50%" }}
          isConnectable={isConnectable}
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
                LLM
              </Label>
              <Select 
                value={editData.llm} 
                onValueChange={(value) => setEditData(prev => ({ ...prev, llm: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select LLM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GPT-4">GPT-4</SelectItem>
                  <SelectItem value="GPT-3.5">GPT-3.5</SelectItem>
                  <SelectItem value="Claude-3">Claude-3</SelectItem>
                  <SelectItem value="Llama-3">Llama-3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Tools</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    placeholder="Add a tool"
                  />
                  <Button type="button" size="sm" onClick={handleAddTool}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editData.tools.map((tool, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tool}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveTool(tool)}
                      />
                    </Badge>
                  ))}
                  {editData.tools.length === 0 && (
                    <span className="text-sm text-muted-foreground">No tools added</span>
                  )}
                </div>
              </div>
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
    </>
  );
};

export default AgentNode;
