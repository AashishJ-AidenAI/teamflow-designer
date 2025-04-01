
import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { CircleGauge, Edit, ArrowLeftRight } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export interface IfNodeData {
  label: string;
  condition: string;
  description: string;
  onUpdate?: (id: string, data: Partial<IfNodeData>) => void;
}

const IfNode = ({ 
  id,
  data, 
  selected 
}: {
  id: string;
  data: IfNodeData;
  selected: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<{
    label: string;
    condition: string;
    description: string;
  }>({
    label: data?.label || "If Statement",
    condition: data?.condition || "x > 0",
    description: data?.description || "Conditional branch"
  });

  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditData({
      label: data?.label || "If Statement",
      condition: data?.condition || "x > 0",
      description: data?.description || "Conditional branch"
    });
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (data.onUpdate) {
      data.onUpdate(id, editData);
      toast.success("Condition updated successfully");
    } else {
      console.warn("No update handler provided for if node");
      toast.error("Could not update condition: No handler provided");
    }
    setIsEditing(false);
  };

  return (
    <TooltipProvider>
      <div className={`w-64 p-3 rounded-md bg-amber-500 text-white ${selected ? 'ring-2 ring-ring' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            <span className="font-medium">{data?.label || "If Statement"}</span>
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
              Edit condition
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-white/80">Condition:</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded-sm max-w-[160px] truncate">
              {data?.condition || "x > 0"}
            </span>
          </div>
          
          <div className="mt-2 text-white/80">
            {data?.description || "Conditional branch"}
          </div>
        </div>
        
        <Handle
          type="target"
          position={Position.Top}
          id="target"
          style={{ background: "#fff", borderRadius: "50%" }}
        />
        
        <div className="flex justify-between relative mt-2 pt-2">
          <div className="text-xs font-medium absolute -left-2 top-0">False</div>
          <div className="text-xs font-medium absolute -right-2 top-0">True</div>
          
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            style={{ background: "#fff", borderRadius: "50%", left: "30%" }}
          />
          
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            style={{ background: "#fff", borderRadius: "50%", left: "70%" }}
          />
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Condition</DialogTitle>
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
              <Label htmlFor="condition" className="text-right">
                Condition
              </Label>
              <Input
                id="condition"
                value={editData.condition}
                onChange={(e) => setEditData(prev => ({ ...prev, condition: e.target.value }))}
                className="col-span-3"
                placeholder="e.g., score > 80 or hasError === false"
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
                placeholder="Describe what this condition does"
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

export default IfNode;
