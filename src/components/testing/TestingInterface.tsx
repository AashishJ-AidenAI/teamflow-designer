
import { useState } from "react";
import { 
  Bot, 
  Search, 
  Filter, 
  FileText, 
  MessageSquare,
  GitBranch
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ChatAgent from "./ChatAgent";
import BackgroundAgent from "./BackgroundAgent";
import WorkflowTester from "./WorkflowTester";

// Sample data
const agents = [
  {
    id: "a1",
    name: "Text Summarizer",
    description: "Summarizes any text content with key points extraction",
    type: "chat", // chat | background
    llm: "GPT-4",
  },
  {
    id: "a2",
    name: "Data Analyzer",
    description: "Analyzes datasets and generates insights",
    type: "background",
    llm: "Claude-3",
  },
  {
    id: "a3",
    name: "Code Generator",
    description: "Generates code based on requirements",
    type: "chat",
    llm: "Gemini Pro",
  },
  {
    id: "a4",
    name: "Content Writer",
    description: "Creates high-quality content for various purposes",
    type: "chat",
    llm: "GPT-4",
  },
  {
    id: "a5",
    name: "Research Assistant",
    description: "Conducts deep research on any topic",
    type: "background",
    llm: "Claude-3",
  },
  {
    id: "a6",
    name: "Image Analyzer",
    description: "Analyzes and describes image contents",
    type: "background",
    llm: "Gemini Pro",
  },
];

// Sample workflows
const workflows = [
  {
    id: "wf1",
    name: "Customer Support Flow",
    description: "Handles customer support requests with multiple agents",
    inputType: "Customer Request",
    outputType: "Resolution",
  },
  {
    id: "wf2",
    name: "Sales Qualification Flow",
    description: "Qualifies sales leads and routes to appropriate team",
    inputType: "Lead Data",
    outputType: "Qualified Lead",
  },
  {
    id: "wf3",
    name: "Document Processing",
    description: "Processes documents and extracts structured data",
    inputType: "PDF Document",
    outputType: "Structured Data",
  }
];

const TestingInterface = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("agents");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  
  // Filter agents based on search term and type
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.llm.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = 
      selectedType === "all" || agent.type === selectedType;
      
    return matchesSearch && matchesType;
  });
  
  // Filter workflows based on search term
  const filteredWorkflows = workflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.inputType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.outputType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const selectedAgentData = agents.find(agent => agent.id === selectedAgent);
  const selectedWorkflowData = workflows.find(workflow => workflow.id === selectedWorkflow);
  
  return (
    <div className="h-full flex flex-col space-y-4">
      <Tabs defaultValue="agents" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Workflows
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeTab}...`}
                className="pl-8 w-[200px] sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {activeTab === "agents" && (
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="chat">Chat Agents</SelectItem>
                  <SelectItem value="background">Background</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex flex-col lg:flex-row gap-6 h-full">
          <TabsContent value="agents" className="m-0 w-full lg:w-1/3 space-y-3">
            {filteredAgents.map((agent) => (
              <Card
                key={agent.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedAgent === agent.id ? "border-primary" : ""
                }`}
                onClick={() => setSelectedAgent(agent.id)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-primary" />
                      <CardTitle className="text-base">{agent.name}</CardTitle>
                    </div>
                    {agent.type === "chat" ? (
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <CardDescription className="mt-1">{agent.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">LLM:</span>
                    <span className="bg-secondary px-1.5 py-0.5 rounded-sm text-xs">
                      {agent.llm}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredAgents.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No agents found matching your search.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="workflows" className="m-0 w-full lg:w-1/3 space-y-3">
            {filteredWorkflows.map((workflow) => (
              <Card
                key={workflow.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedWorkflow === workflow.id ? "border-primary" : ""
                }`}
                onClick={() => setSelectedWorkflow(workflow.id)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-primary" />
                      <CardTitle className="text-base">{workflow.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="mt-1">{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">I/O:</span>
                    <span className="bg-secondary px-1.5 py-0.5 rounded-sm text-xs">
                      {workflow.inputType} → {workflow.outputType}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredWorkflows.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No workflows found matching your search.</p>
              </div>
            )}
          </TabsContent>
          
          <div className="flex-1 h-full">
            {activeTab === "agents" && selectedAgentData ? (
              selectedAgentData.type === "chat" ? (
                <ChatAgent 
                  agentName={selectedAgentData.name} 
                  agentType={selectedAgentData.llm}
                />
              ) : (
                <BackgroundAgent 
                  agentName={selectedAgentData.name} 
                  agentType={selectedAgentData.llm}
                />
              )
            ) : activeTab === "workflows" && selectedWorkflowData ? (
              <WorkflowTester 
                workflowName={selectedWorkflowData.name}
                inputType={selectedWorkflowData.inputType}
                outputType={selectedWorkflowData.outputType}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-lg">
                {activeTab === "agents" ? (
                  <>
                    <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Select an Agent to Test</h3>
                    <p className="text-muted-foreground mt-2 max-w-md">
                      Choose an agent from the list to start testing its capabilities. Chat-based agents provide 
                      real-time responses, while background process agents perform tasks asynchronously.
                    </p>
                  </>
                ) : (
                  <>
                    <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Select a Workflow to Test</h3>
                    <p className="text-muted-foreground mt-2 max-w-md">
                      Choose a workflow from the list to test its end-to-end execution. You'll be able to 
                      provide input data and see results at each stage of the workflow.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default TestingInterface;
