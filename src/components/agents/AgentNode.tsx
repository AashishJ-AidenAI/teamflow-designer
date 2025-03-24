
import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { Bot, Cog, X } from "lucide-react";

// Define the data structure that will be passed to the node
export interface AgentNodeData {
  label: string;
  llm: string;
  tools: string[];
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
  const onNodeClick = useCallback(() => {
    console.log("Agent node clicked:", id);
  }, [id]);

  return (
    <div 
      className={`agent-node transition-all duration-150 ${selected ? 'scale-[1.02]' : ''}`}
      onClick={onNodeClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          <span className="font-medium">{data?.label || "Unnamed Agent"}</span>
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

export default AgentNode;
