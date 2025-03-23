
import { useCallback } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Users, Cog, X, GitBranch, Zap, List } from "lucide-react";

// Define the execution strategy type
export type ExecutionStrategy = "parallel" | "selection" | "sequential";

// Define the data structure for the team node
interface TeamNodeData {
  label: string;
  strategy: ExecutionStrategy;
  agents: string[];
}

// The NodeProps from @xyflow/react already includes id, selected, etc.
const TeamNode: React.FC<NodeProps<TeamNodeData>> = ({ 
  id, 
  data, 
  selected, 
  isConnectable
}) => {
  const onNodeClick = useCallback(() => {
    console.log("Team node clicked:", id);
  }, [id]);

  const StrategyIcon = {
    parallel: Zap,
    selection: List,
    sequential: GitBranch
  }[data.strategy];

  return (
    <div 
      className={`team-node transition-all duration-150 ${selected ? 'scale-[1.02]' : ''}`}
      onClick={onNodeClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="font-medium">{data.label}</span>
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
          <StrategyIcon className="h-3.5 w-3.5" />
          <span className="bg-white/20 px-1.5 py-0.5 rounded-sm capitalize">
            {data.strategy} Execution
          </span>
        </div>
        
        <div className="mt-2">
          <span className="text-white/80">Agents: {data.agents.length}</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {data.agents.slice(0, 3).map((agent, index) => (
              <span 
                key={index} 
                className="bg-white/20 px-1.5 py-0.5 rounded-sm text-[10px]"
              >
                {agent}
              </span>
            ))}
            {data.agents.length > 3 && (
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
