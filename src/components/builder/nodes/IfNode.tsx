import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { ArrowLeftRight, Edit, Plus, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export type Operator = "==" | "!=" | ">" | ">=" | "<" | "<=" | "in" | "contains";
export type LogicType = "AND" | "OR" | undefined;

export interface SimpleCondition {
  operator: Operator;
  left: string;
  right: any;
}

export interface ComplexCondition {
  type: LogicType;
  conditions: (SimpleCondition | ComplexCondition)[];
}

export type Condition = SimpleCondition | ComplexCondition;

const isSimpleCondition = (condition: any): condition is SimpleCondition => {
  return condition && 'operator' in condition && 'left' in condition && 'right' in condition;
};

const isComplexCondition = (condition: any): condition is ComplexCondition => {
  return condition && 'type' in condition && 'conditions' in condition;
};

const parseStringCondition = (conditionStr: string): SimpleCondition => {
  const defaultCondition: SimpleCondition = {
    operator: ">",
    left: "score",
    right: 0
  };
  
  try {
    const parts = conditionStr.split(/\s+/);
    if (parts.length >= 3) {
      const left = parts[0];
      const operator = parts[1] as Operator;
      const right = isNaN(Number(parts[2])) ? parts[2] : Number(parts[2]);
      
      if (left && operator) {
        return {
          operator,
          left,
          right
        };
      }
    }
    
    console.warn("Failed to parse condition string:", conditionStr);
    return defaultCondition;
  } catch (error) {
    console.error("Error parsing condition:", error);
    return defaultCondition;
  }
};

const conditionToString = (condition: Condition): string => {
  if (isSimpleCondition(condition)) {
    return `${condition.left} ${condition.operator} ${JSON.stringify(condition.right)}`;
  } else if (isComplexCondition(condition)) {
    return condition.conditions
      .map(cond => conditionToString(cond))
      .join(` ${condition.type} `);
  }
  return "";
};

const SimpleConditionEditor = ({ 
  condition, 
  onChange,
  onDelete
}: { 
  condition: SimpleCondition; 
  onChange: (updated: SimpleCondition) => void;
  onDelete?: () => void;
}) => {
  return (
    <div className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded-md mb-2">
      <Input
        className="col-span-4"
        value={condition.left}
        onChange={(e) => onChange({ ...condition, left: e.target.value })}
        placeholder="Field name"
      />
      
      <Select
        value={condition.operator}
        onValueChange={(value) => onChange({ ...condition, operator: value as Operator })}
      >
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder="Operator" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="==">==</SelectItem>
          <SelectItem value="!=">!=</SelectItem>
          <SelectItem value=">">{">"}</SelectItem>
          <SelectItem value=">=">{"≥"}</SelectItem>
          <SelectItem value="<">{"<"}</SelectItem>
          <SelectItem value="<=">{"≤"}</SelectItem>
          <SelectItem value="in">in</SelectItem>
          <SelectItem value="contains">contains</SelectItem>
        </SelectContent>
      </Select>
      
      <Input
        className="col-span-4"
        value={typeof condition.right === 'object' ? JSON.stringify(condition.right) : condition.right.toString()}
        onChange={(e) => {
          let value = e.target.value;
          
          let parsedValue: any = value;
          
          if (!isNaN(Number(value))) {
            parsedValue = Number(value);
          } 
          else if (value.toLowerCase() === 'true') {
            parsedValue = true;
          } 
          else if (value.toLowerCase() === 'false') {
            parsedValue = false;
          }
          else if (value.startsWith('[') && value.endsWith(']')) {
            try {
              parsedValue = JSON.parse(value);
            } catch (e) {
              console.warn("Failed to parse as JSON:", value);
            }
          }
          
          onChange({ ...condition, right: parsedValue });
        }}
        placeholder="Value"
      />
      
      {onDelete && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="col-span-1"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

const ComplexConditionEditor = ({ 
  condition, 
  onChange,
  onDelete,
  depth = 0
}: { 
  condition: ComplexCondition; 
  onChange: (updated: ComplexCondition) => void;
  onDelete?: () => void;
  depth?: number;
}) => {
  const addSimpleCondition = () => {
    const newCondition: SimpleCondition = {
      operator: "==",
      left: "field",
      right: "value"
    };
    
    onChange({
      ...condition,
      conditions: [...condition.conditions, newCondition]
    });
  };
  
  const addComplexCondition = () => {
    const newCondition: ComplexCondition = {
      type: "AND",
      conditions: [
        {
          operator: "==",
          left: "field",
          right: "value"
        }
      ]
    };
    
    onChange({
      ...condition,
      conditions: [...condition.conditions, newCondition]
    });
  };
  
  const updateCondition = (index: number, updatedCondition: Condition) => {
    const newConditions = [...condition.conditions];
    newConditions[index] = updatedCondition;
    onChange({
      ...condition,
      conditions: newConditions
    });
  };
  
  const removeCondition = (index: number) => {
    const newConditions = condition.conditions.filter((_, i) => i !== index);
    onChange({
      ...condition,
      conditions: newConditions
    });
  };
  
  const MAX_DEPTH = 3;
  
  return (
    <div className={`border rounded-md p-3 mb-2 ${depth % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-2">
        <Select
          value={condition.type}
          onValueChange={(value) => onChange({ ...condition, type: value as LogicType })}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Logic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">AND</SelectItem>
            <SelectItem value="OR">OR</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex space-x-1">
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Remove
            </Button>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        {condition.conditions.map((cond, index) => (
          <div key={index}>
            {isSimpleCondition(cond) ? (
              <SimpleConditionEditor
                condition={cond}
                onChange={(updated) => updateCondition(index, updated)}
                onDelete={() => removeCondition(index)}
              />
            ) : isComplexCondition(cond) && depth < MAX_DEPTH ? (
              <ComplexConditionEditor
                condition={cond}
                onChange={(updated) => updateCondition(index, updated)}
                onDelete={() => removeCondition(index)}
                depth={depth + 1}
              />
            ) : (
              <div className="text-red-500 text-sm">
                Max nesting depth reached
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex space-x-2 mt-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={addSimpleCondition}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Condition
        </Button>
        
        {depth < MAX_DEPTH && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={addComplexCondition}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Group
          </Button>
        )}
      </div>
    </div>
  );
};

export interface IfNodeData {
  label: string;
  condition: Condition | string;
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
    condition: Condition | string;
    description: string;
  }>({
    label: data?.label || "If Statement",
    condition: data?.condition || "x > 0",
    description: data?.description || "Conditional branch"
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    let initialCondition = data?.condition;
    if (typeof initialCondition === 'string') {
      initialCondition = parseStringCondition(initialCondition);
    }
    
    setEditData({
      label: data?.label || "If Statement",
      condition: initialCondition,
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
  
  const getConditionDisplay = (): string => {
    const condition = data?.condition;
    
    if (typeof condition === 'string') {
      return condition;
    } else if (condition) {
      return conditionToString(condition).slice(0, 30) + (conditionToString(condition).length > 30 ? '...' : '');
    }
    
    return "x > 0";
  };
  
  const createNewCondition = (): ComplexCondition => {
    return {
      type: "AND",
      conditions: [
        {
          operator: "==",
          left: "field",
          right: "value"
        }
      ]
    };
  };
  
  const prepareConditionForEditing = () => {
    if (typeof editData.condition === 'string') {
      setEditData({
        ...editData,
        condition: parseStringCondition(editData.condition)
      });
    } else if (!editData.condition) {
      setEditData({
        ...editData,
        condition: createNewCondition()
      });
    }
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
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  <span className="bg-white/20 px-1.5 py-0.5 rounded-sm max-w-[160px] truncate">
                    {getConditionDisplay()}
                  </span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 bg-white/10 p-1 rounded text-xs">
                <pre className="overflow-x-auto max-w-full whitespace-pre-wrap">
                  {typeof data?.condition === 'string' 
                    ? data.condition 
                    : JSON.stringify(data?.condition, null, 2)}
                </pre>
              </CollapsibleContent>
            </Collapsible>
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
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
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
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                Condition
              </Label>
              <div className="col-span-3">
                <div className="mb-2 flex justify-between">
                  <Select
                    value={typeof editData.condition === 'string' ? 'simple' : 'advanced'}
                    onValueChange={(value) => {
                      if (value === 'simple') {
                        setEditData(prev => ({
                          ...prev,
                          condition: conditionToString(
                            typeof prev.condition === 'string' 
                              ? parseStringCondition(prev.condition) 
                              : prev.condition as Condition
                          )
                        }));
                      } else {
                        prepareConditionForEditing();
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Edit mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple (text)</SelectItem>
                      <SelectItem value="advanced">Advanced (builder)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {typeof editData.condition === 'string' ? (
                  <Input
                    value={editData.condition}
                    onChange={(e) => setEditData(prev => ({ ...prev, condition: e.target.value }))}
                    placeholder="e.g., score > 80 or hasError === false"
                  />
                ) : isSimpleCondition(editData.condition) ? (
                  <SimpleConditionEditor
                    condition={editData.condition}
                    onChange={(updated) => setEditData(prev => ({ ...prev, condition: updated }))}
                  />
                ) : isComplexCondition(editData.condition) ? (
                  <ComplexConditionEditor
                    condition={editData.condition}
                    onChange={(updated) => setEditData(prev => ({ ...prev, condition: updated }))}
                  />
                ) : (
                  <Button 
                    onClick={() => setEditData(prev => ({ 
                      ...prev, 
                      condition: createNewCondition()
                    }))}
                  >
                    Create Condition
                  </Button>
                )}
              </div>
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
