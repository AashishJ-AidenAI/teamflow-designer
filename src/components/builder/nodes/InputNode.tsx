
import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { CircleArrowRight, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export interface InputNodeData {
  label: string;
  format: string;
  description: string;
  onUpdate?: (id: string, data: Partial<InputNodeData>) => void;
}

const InputNode = ({ 
  id,
  data, 
  selected 
}: {
  id: string;
  data: InputNodeData;
  selected: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<{
    label: string;
    format: string;
    description: string;
  }>({
    label: data?.label || "Input",
    format: data?.format || "JSON",
    description: data?.description || "Workflow starting point"
  });

  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditData({
      label: data?.label || "Input",
      format: data?.format || "JSON",
      description: data?.description || "Workflow starting point"
    });
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (data.onUpdate) {
      data.onUpdate(id, editData);
      toast.success("Input node updated successfully");
    } else {
      console.warn("No update handler provided for input node");
      toast.error("Could not update input node: No handler provided");
    }
    setIsEditing(false);
  };

  return (
    <TooltipProvider>
      <div className={`w-56 p-3 rounded-md bg-green-500 text-white ${selected ? 'ring-2 ring-ring' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CircleArrowRight className="h-4 w-4" />
            <span className="font-medium">{data?.label || "Input"}</span>
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
              Edit input configuration
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-white/80">Format:</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded-sm">{data?.format || "JSON"}</span>
          </div>
          
          <div className="mt-2 text-white/80">
            {data?.description || "Workflow starting point"}
          </div>
        </div>
        
        <Handle
          type="source"
          position={Position.Bottom}
          id="source"
          style={{ background: "#fff", borderRadius: "50%" }}
        />
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Input Node</DialogTitle>
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
              <Label htmlFor="format" className="text-right">
                Format
              </Label>
              <Input
                id="format"
                value={editData.format}
                onChange={(e) => setEditData(prev => ({ ...prev, format: e.target.value }))}
                className="col-span-3"
                placeholder="e.g., JSON, XML, Text"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={editData.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                rows={3}
                placeholder="Describe this input node's purpose"
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

export default InputNode;
