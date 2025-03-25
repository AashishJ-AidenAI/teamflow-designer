
import { useState } from "react";
import { 
  GitBranch, 
  Play, 
  Clock, 
  ArrowRight,
  DownloadCloud,
  Bot,
  Users,
  CircleArrowRight,
  CircleArrowDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface WorkflowTesterProps {
  workflowName: string;
  inputType: string;
  outputType: string;
}

interface WorkflowNode {
  id: string;
  type: 'input' | 'agent' | 'team' | 'if' | 'output';
  name: string;
  status: 'waiting' | 'processing' | 'completed' | 'error';
  output?: string;
  executionTime?: number;
}

const dummyWorkflowNodes: Record<string, WorkflowNode[]> = {
  "wf1": [
    { 
      id: 'input-1', 
      type: 'input', 
      name: 'Customer Request', 
      status: 'waiting' 
    },
    { 
      id: 'agent-1', 
      type: 'agent', 
      name: 'Customer Support Agent', 
      status: 'waiting' 
    },
    { 
      id: 'agent-2', 
      type: 'agent', 
      name: 'Document Processing Agent', 
      status: 'waiting' 
    },
    { 
      id: 'output-1', 
      type: 'output', 
      name: 'Support Resolution', 
      status: 'waiting' 
    }
  ],
  "wf2": [
    { 
      id: 'input-1', 
      type: 'input', 
      name: 'Lead Information', 
      status: 'waiting' 
    },
    { 
      id: 'agent-1', 
      type: 'agent', 
      name: 'Pre-screening Agent', 
      status: 'waiting' 
    },
    { 
      id: 'if-1', 
      type: 'if', 
      name: 'Qualified Lead Check', 
      status: 'waiting' 
    },
    { 
      id: 'agent-2', 
      type: 'agent', 
      name: 'Lead Nurturing Agent', 
      status: 'waiting' 
    },
    { 
      id: 'agent-3', 
      type: 'agent', 
      name: 'Sales Agent', 
      status: 'waiting' 
    },
    { 
      id: 'output-1', 
      type: 'output', 
      name: 'Nurturing Queue', 
      status: 'waiting' 
    },
    { 
      id: 'output-2', 
      type: 'output', 
      name: 'Sales Queue', 
      status: 'waiting' 
    }
  ],
  "wf3": [
    { 
      id: 'input-1', 
      type: 'input', 
      name: 'Document Input', 
      status: 'waiting' 
    },
    { 
      id: 'agent-1', 
      type: 'agent', 
      name: 'Document Processing Agent', 
      status: 'waiting' 
    },
    { 
      id: 'agent-2', 
      type: 'agent', 
      name: 'Validation Agent', 
      status: 'waiting' 
    },
    { 
      id: 'output-1', 
      type: 'output', 
      name: 'Structured Data', 
      status: 'waiting' 
    }
  ]
};

const sampleInputs: Record<string, string> = {
  "wf1": `{
  "customer_id": "CUST-12345",
  "request_type": "technical_support",
  "subject": "Unable to log into account",
  "description": "I've been trying to log into my account for the past 2 hours but keep getting an 'invalid password' error. I've already reset my password twice but still can't get in."
}`,
  "wf2": `{
  "lead_id": "LEAD-78901",
  "name": "John Smith",
  "company": "Acme Corp",
  "email": "john.smith@acmecorp.com",
  "phone": "+1-555-123-4567",
  "industry": "Manufacturing",
  "revenue": "$5-10M",
  "source": "Website Contact Form",
  "interest": "Enterprise Solution",
  "notes": "Looking for a solution within the next quarter"
}`,
  "wf3": `{
  "document_id": "DOC-34567",
  "type": "invoice",
  "format": "pdf",
  "size": "245KB",
  "source": "email_attachment",
  "filename": "invoice_march_2024.pdf",
  "upload_timestamp": "2024-03-15T14:30:00Z",
  "priority": "normal"
}`
};

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'input':
      return <CircleArrowRight className="h-5 w-5 text-green-500" />;
    case 'agent':
      return <Bot className="h-5 w-5 text-primary" />;
    case 'team':
      return <Users className="h-5 w-5 text-blue-500" />;
    case 'if':
      return <ArrowRight className="h-5 w-5 text-amber-500" />;
    case 'output':
      return <CircleArrowDown className="h-5 w-5 text-blue-500" />;
    default:
      return <GitBranch className="h-5 w-5 text-gray-500" />;
  }
};

const WorkflowTester: React.FC<WorkflowTesterProps> = ({ 
  workflowName, 
  inputType, 
  outputType 
}) => {
  const workflowId = Object.keys(dummyWorkflowNodes).find(
    id => dummyWorkflowNodes[id][0].name === inputType
  ) || "wf1";
  
  const [inputData, setInputData] = useState(sampleInputs[workflowId] || "");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [nodes, setNodes] = useState<WorkflowNode[]>(dummyWorkflowNodes[workflowId] || []);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("input");
  
  const handleExecute = () => {
    if (!inputData) {
      return;
    }
    
    setIsExecuting(true);
    setExecutionLogs([]);
    setExecutionProgress(0);
    
    // Reset node statuses
    setNodes(prevNodes => 
      prevNodes.map(node => ({ ...node, status: 'waiting', output: undefined, executionTime: undefined }))
    );
    
    // Simulate workflow execution
    const totalNodes = nodes.length;
    const stepTime = 2000; // Time per node in ms
    
    // Process each node sequentially
    nodes.forEach((node, index) => {
      setTimeout(() => {
        // Update execution progress
        const progress = Math.round(((index + 1) / totalNodes) * 100);
        setExecutionProgress(progress);
        
        // Add log entry
        setExecutionLogs(prev => [
          ...prev, 
          `[${new Date().toLocaleTimeString()}] Processing ${node.name}...`
        ]);
        
        // Update node status to processing
        setNodes(prevNodes => 
          prevNodes.map((n, i) => 
            i === index ? { ...n, status: 'processing' } : n
          )
        );
        
        // After a delay, complete the node processing
        setTimeout(() => {
          const executionTime = Math.floor(Math.random() * 1000) + 500; // Random time between 500-1500ms
          let output;
          
          if (node.type === 'input') {
            output = inputData;
          } else if (node.type === 'output') {
            // For output node, generate a result summary
            output = JSON.stringify({
              status: "success",
              timestamp: new Date().toISOString(),
              result: {
                processed: true,
                response_time: `${executionTime}ms`,
                output_type: outputType
              }
            }, null, 2);
          } else if (node.type === 'if') {
            // For if node, make a decision
            output = "Condition evaluated to: true";
          } else {
            // For agent/team nodes, generate some processing result
            output = JSON.stringify({
              agentResult: {
                processed: true,
                confidence: Math.round(Math.random() * 100) / 100,
                processingTime: `${executionTime}ms`,
                notes: `Processed by ${node.name}`
              }
            }, null, 2);
          }
          
          // Update node status to completed and add output
          setNodes(prevNodes => 
            prevNodes.map((n, i) => 
              i === index ? { 
                ...n, 
                status: 'completed', 
                output,
                executionTime
              } : n
            )
          );
          
          // Add completion log
          setExecutionLogs(prev => [
            ...prev, 
            `[${new Date().toLocaleTimeString()}] Completed ${node.name} in ${executionTime}ms`
          ]);
          
          // If it's the last node, set executing to false
          if (index === totalNodes - 1) {
            setTimeout(() => {
              setIsExecuting(false);
              setExecutionLogs(prev => [
                ...prev, 
                `[${new Date().toLocaleTimeString()}] Workflow execution completed successfully`
              ]);
            }, 500);
          }
        }, stepTime / 2);
        
      }, index * stepTime);
    });
  };
  
  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-gray-200';
      case 'processing':
        return 'bg-amber-500 animate-pulse';
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-200';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-primary" />
                {workflowName}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs font-normal">
                  {inputType} → {outputType}
                </Badge>
                {isExecuting && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-amber-500 animate-pulse" />
                    <span className="text-xs text-amber-500">Executing...</span>
                  </div>
                )}
              </div>
            </div>
            <Button 
              onClick={handleExecute} 
              disabled={isExecuting || !inputData}
              size="sm"
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Execute Workflow
            </Button>
          </div>
          
          {isExecuting && (
            <Progress value={executionProgress} className="mt-3 h-2" />
          )}
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-0">
          <Tabs defaultValue="input" className="h-full flex flex-col" onValueChange={setActiveTab}>
            <div className="px-6 border-b">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="input">Input</TabsTrigger>
                <TabsTrigger value="execution">Execution</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="output">Results</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-auto">
              <TabsContent value="input" className="h-full m-0 p-6">
                <div className="space-y-4 h-full flex flex-col">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Input Data ({inputType})</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Enter or modify the input data for this workflow. The data should be in the format expected by the workflow's input node.
                    </p>
                  </div>
                  
                  <div className="flex-1 relative">
                    <Textarea 
                      className="w-full h-full min-h-[300px] font-mono resize-none"
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      placeholder={`Enter ${inputType} data...`}
                    />
                    
                    {!inputData && (
                      <div className="absolute bottom-4 right-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="gap-2"
                          onClick={() => setInputData(sampleInputs[workflowId] || "")}
                        >
                          <DownloadCloud className="h-4 w-4" />
                          Load Sample
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="execution" className="h-full m-0 p-6">
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Workflow Execution</h3>
                    <p className="text-xs text-muted-foreground">
                      Visual representation of the workflow execution. Each node represents a step in the workflow.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {nodes.map((node, index) => (
                      <div key={node.id} className="relative">
                        {index > 0 && (
                          <div className="absolute left-[23px] -top-4 h-4 w-0.5 bg-gray-200"></div>
                        )}
                        
                        <div className="flex items-start gap-4">
                          <div className="mt-1 flex flex-col items-center">
                            <div className={`rounded-full h-6 w-6 ${getNodeStatusColor(node.status)} flex items-center justify-center transition-colors`}>
                              {node.status === 'completed' ? 
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg> : 
                                <span className="text-white text-xs">{index + 1}</span>
                              }
                            </div>
                            {index < nodes.length - 1 && (
                              <div className="h-full w-0.5 bg-gray-200 mt-1"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 pb-5">
                            <div className="flex items-center gap-2 mb-1">
                              {getNodeIcon(node.type)}
                              <span className="font-medium">{node.name}</span>
                              <Badge variant="outline" className="text-xs capitalize ml-2">
                                {node.type}
                              </Badge>
                              {node.executionTime && (
                                <Badge variant="secondary" className="text-xs ml-auto">
                                  {node.executionTime}ms
                                </Badge>
                              )}
                            </div>
                            
                            {node.output && (
                              <div className="mt-2 bg-muted/50 rounded-md p-3 font-mono text-xs overflow-auto max-h-[150px]">
                                <pre>{node.output}</pre>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="logs" className="h-full m-0 p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Execution Logs</h3>
                    <p className="text-xs text-muted-foreground">
                      Detailed logs of the workflow execution process. These logs can help debug issues with the workflow.
                    </p>
                  </div>
                  
                  <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-md h-[400px] overflow-auto">
                    {executionLogs.length > 0 ? (
                      executionLogs.map((log, index) => (
                        <div key={index} className="pb-1">{log}</div>
                      ))
                    ) : (
                      <div className="text-gray-500">No logs available. Execute the workflow to generate logs.</div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="output" className="h-full m-0 p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Workflow Results</h3>
                    <p className="text-xs text-muted-foreground">
                      Final outputs from all output nodes in the workflow.
                    </p>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {nodes
                      .filter(node => node.type === 'output' && node.output)
                      .map((node, index) => (
                        <AccordionItem key={node.id} value={node.id}>
                          <AccordionTrigger className="text-sm py-3">
                            <div className="flex items-center gap-2">
                              <CircleArrowDown className="h-4 w-4 text-blue-500" />
                              {node.name}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="bg-muted/50 rounded-md p-3 font-mono text-xs overflow-auto max-h-[300px]">
                              <pre>{node.output}</pre>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    
                    {nodes.filter(node => node.type === 'output' && node.output).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No output data available. Execute the workflow to generate results.
                      </div>
                    )}
                  </Accordion>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t p-4">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <div>
              {activeTab === "input" ? 
                "Provide input data and click 'Execute Workflow' to test" : 
                activeTab === "execution" ? 
                "Visual execution flow with real-time status updates" :
                activeTab === "logs" ?
                "Detailed execution logs for debugging" :
                "Final output from all workflow endpoints"
              }
            </div>
            
            {nodes.filter(n => n.status === 'completed').length > 0 && (
              <Badge variant="outline" className="ml-auto">
                {nodes.filter(n => n.status === 'completed').length}/{nodes.length} Steps Completed
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WorkflowTester;
