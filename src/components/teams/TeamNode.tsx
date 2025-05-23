
import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { Users, Cog, X, GitBranch, Zap, List } from "lucide-react";

// Define the execution strategy type
export type ExecutionStrategy = "parallel" | "selection" | "sequential";

// Define the data structure for the team node
export interface TeamNodeData {
  label: string;
  strategy: ExecutionStrategy;
  agents: string[];
}

// Use correct typing
const TeamNode = ({ 
  id, 
  data, 
  selected, 
  isConnectable 
}: {
  id: string;
  data: TeamNodeData;
  selected: boolean;
  isConnectable: boolean;
}) => {
  const onNodeClick = useCallback(() => {
    console.log("Team node clicked:", id);
  }, [id]);
  
  const StrategyIcon = {
    parallel: Zap,
    selection: List,
    sequential: GitBranch
  }[data?.strategy || "parallel"];

  return (
    <div 
      className={`w-64 p-3 rounded-md bg-blue-600 text-white shadow-md ${selected ? 'ring-2 ring-ring' : ''}`}
      onClick={onNodeClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="font-medium">{data?.label || "Unnamed Team"}</span>
        </div>
        <div className="flex gap-1">
          <button className="p-1 hover:bg-white/20 rounded-sm transition-colors">
            <Cog className="h-3.5 w-3.5" />
          </button>
          <button className="p-1 hover:bg-white/20 rounded-sm transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      
      <div className="text-xs space-y-1">
        <div className="flex items-center gap-1.5">
          {StrategyIcon && <StrategyIcon className="h-3.5 w-3.5" />}
          <span className="bg-white/20 px-1.5 py-0.5 rounded-sm capitalize">
            {data?.strategy || "parallel"} Execution
          </span>
        </div>
        
        <div className="mt-2">
          <span className="text-white/80">Agents: {data?.agents?.length || 0}</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {data?.agents && data.agents.slice(0, 3).map((agent, index) => (
              <span 
                key={index} 
                className="bg-white/20 px-1.5 py-0.5 rounded-sm text-[10px]"
              >
                {agent}
              </span>
            ))}
            {data?.agents && data.agents.length > 3 && (
              <span className="bg-white/20 px-1.5 py-0.5 rounded-sm text-[10px]">
                +{data.agents.length - 3} more
              </span>
            )}
          </div>
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
  );
};

export default TeamNode;
