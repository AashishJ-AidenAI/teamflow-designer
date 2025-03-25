
import { Handle, Position } from "@xyflow/react";
import { CircleGauge, Edit, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

export interface IfNodeData {
  label: string;
  condition: string;
  description: string;
}

const IfNode = ({ 
  data, 
  selected 
}: {
  data: IfNodeData;
  selected: boolean;
}) => {
  return (
    <div className={`w-64 p-3 rounded-md bg-amber-500 text-white ${selected ? 'ring-2 ring-ring' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4" />
          <span className="font-medium">{data?.label || "If Statement"}</span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
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
  );
};

export default IfNode;
