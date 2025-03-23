
import { useState } from "react";
import { 
  Bot, 
  Search, 
  Filter, 
  FileText, 
  MessageSquare
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
import ChatAgent from "./ChatAgent";
import BackgroundAgent from "./BackgroundAgent";

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

const TestingInterface = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  
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
  
  const selectedAgentData = agents.find(agent => agent.id === selectedAgent);
  
  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/3 space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Testing Lab</h2>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
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
        </div>
        
        <div className="space-y-3">
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
        </div>
      </div>
      
      <div className="flex-1 h-full">
        {selectedAgentData ? (
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
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-lg">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Select an Agent to Test</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              Choose an agent from the list to start testing its capabilities. Chat-based agents provide 
              real-time responses, while background process agents perform tasks asynchronously.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestingInterface;
