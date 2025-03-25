
import { Handle, Position } from "@xyflow/react";
import { CircleArrowRight, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

export interface InputNodeData {
  label: string;
  format: string;
  description: string;
}

const InputNode = ({ 
  data, 
  selected 
}: {
  data: InputNodeData;
  selected: boolean;
}) => {
  return (
    <div className={`w-56 p-3 rounded-md bg-green-500 text-white ${selected ? 'ring-2 ring-ring' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CircleArrowRight className="h-4 w-4" />
          <span className="font-medium">{data?.label || "Input"}</span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
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
  );
};

export default InputNode;
