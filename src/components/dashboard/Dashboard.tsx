import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Bot, 
  Users, 
  PlusCircle, 
  Search, 
  Filter, 
  ArrowUpDown
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AgentCard from "./AgentCard";
import TeamCard from "./TeamCard";
import Metrics from "./Metrics";
import { ExecutionStrategy } from "../teams/TeamNode";

// Sample data
const agentsData = [
  {
    id: "a1",
    name: "Text Summarizer",
    llm: "GPT-4",
    tools: ["Summarization", "Translation", "Paraphrasing"],
    active: true,
    responseTime: 220,
    usageCount: 1280,
  },
  {
    id: "a2",
    name: "Data Analyzer",
    llm: "Claude-3",
    tools: ["Data Analysis", "Chart Generation", "Insight Extraction"],
    active: true,
    responseTime: 300,
    usageCount: 950,
  },
  {
    id: "a3",
    name: "Code Generator",
    llm: "Gemini Pro",
    tools: ["Code Generation", "Code Review", "Bug Fixing"],
    active: false,
    responseTime: 150,
    usageCount: 750,
  },
  {
    id: "a4",
    name: "Content Writer",
    llm: "GPT-4",
    tools: ["Content Creation", "Editing", "SEO Optimization"],
    active: true,
    responseTime: 180,
    usageCount: 1100,
  },
  {
    id: "a5",
    name: "Research Assistant",
    llm: "Claude-3",
    tools: ["Web Search", "Document Analysis", "Citation Generator"],
    active: true,
    responseTime: 250,
    usageCount: 870,
  },
  {
    id: "a6",
    name: "Image Analyzer",
    llm: "Gemini Pro",
    tools: ["Image Recognition", "Object Detection", "Caption Generation"],
    active: false,
    responseTime: 350,
    usageCount: 580,
  },
];

const teamsData = [
  {
    id: "t1",
    name: "Research Team",
    strategy: "parallel" as ExecutionStrategy,
    agents: ["Text Summarizer", "Data Analyzer", "Research Assistant"],
    active: true,
    clientAssigned: ["Client A", "Client B"],
  },
  {
    id: "t2",
    name: "Content Team",
    strategy: "selection" as ExecutionStrategy,
    agents: ["Content Writer", "Text Summarizer"],
    active: true,
    clientAssigned: ["Client C"],
  },
  {
    id: "t3",
    name: "Dev Team",
    strategy: "sequential" as ExecutionStrategy,
    agents: ["Code Generator", "Data Analyzer"],
    active: false,
    clientAssigned: [],
  },
  {
    id: "t4",
    name: "Full Analysis Team",
    strategy: "sequential" as ExecutionStrategy,
    agents: ["Data Analyzer", "Content Writer", "Image Analyzer"],
    active: true,
    clientAssigned: ["Client A", "Client D"],
  },
];

// Sample client data
const clientsData = [
  { id: "Client A", name: "Acme Corp" },
  { id: "Client B", name: "Beta Industries" },
  { id: "Client C", name: "Catalyst Group" },
  { id: "Client D", name: "Delta Technologies" },
  { id: "Client E", name: "Epsilon Software" },
  { id: "Client F", name: "Foxtrot Media" },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("agents");
  const [teams, setTeams] = useState(teamsData);
  
  const handleUpdateClientList = (teamId: string, clients: string[]) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === teamId 
          ? { ...team, clientAssigned: clients }
          : team
      )
    );
  };
  
  const filteredAgents = agentsData.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.llm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.tools.some(tool => tool.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.agents.some(agent => agent.toLowerCase().includes(searchTerm.toLowerCase())) ||
    team.clientAssigned.some(client => 
      client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientsData.find(c => c.id === client)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  return (
    <div className="space-y-6">
      <Metrics />
      
      <Tabs defaultValue="agents" className="mt-6" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teams
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort by name
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Show active only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New {activeTab === "agents" ? "Agent" : "Team"}
            </Button>
          </div>
        </div>
        
        <TabsContent value="agents" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
          
          {filteredAgents.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No agents found matching your search.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="teams" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.map((team) => (
              <TeamCard 
                key={team.id}
                id={team.id}
                name={team.name}
                strategy={team.strategy}
                agents={team.agents}
                active={team.active}
                clientAssigned={team.clientAssigned}
                onUpdateClientList={handleUpdateClientList}
                allClients={clientsData}
              />
            ))}
          </div>
          
          {filteredTeams.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No teams found matching your search.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
