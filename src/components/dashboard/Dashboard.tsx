
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
import NewTeamModal from "./NewTeamModal";
import EditAgentModal from "./EditAgentModal";
import { useAgents } from "@/context/AgentContext";
import { toast } from "sonner";

const Dashboard = () => {
  const { agents, teams, updateAgent, addTeam, updateClientList } = useAgents();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("agents");
  const [isNewTeamModalOpen, setIsNewTeamModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  
  // Client data
  const clientsData = [
    { id: "Client A", name: "Acme Corp" },
    { id: "Client B", name: "Beta Industries" },
    { id: "Client C", name: "Catalyst Group" },
    { id: "Client D", name: "Delta Technologies" },
    { id: "Client E", name: "Epsilon Software" },
    { id: "Client F", name: "Foxtrot Media" },
  ];
  
  const handleAgentUpdate = (updatedAgent: any) => {
    updateAgent(updatedAgent);
    setEditingAgent(null);
    toast.success("Agent updated successfully");
  };
  
  const handleCreateTeam = (newTeam: any) => {
    addTeam(newTeam);
    setIsNewTeamModalOpen(false);
    toast.success("Team created successfully");
  };
  
  const filteredAgents = agents.filter(agent => 
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

  const handleEditAgent = (agentId: string) => {
    console.log("Editing agent:", agentId);
    setEditingAgent(agentId);
  };
  
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
            
            {activeTab === "teams" && (
              <Button 
                className="gap-2"
                onClick={() => setIsNewTeamModalOpen(true)}
              >
                <PlusCircle className="h-4 w-4" />
                New Team
              </Button>
            )}
          </div>
        </div>
        
        <TabsContent value="agents" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgents.map((agent) => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                onEdit={() => handleEditAgent(agent.id)}
              />
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
                onUpdateClientList={updateClientList}
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

      {/* Modals */}
      <NewTeamModal
        isOpen={isNewTeamModalOpen}
        onClose={() => setIsNewTeamModalOpen(false)}
        onSave={handleCreateTeam}
        allAgents={agents}
      />

      <EditAgentModal
        isOpen={!!editingAgent}
        onClose={() => setEditingAgent(null)}
        onSave={handleAgentUpdate}
        agent={agents.find(a => a.id === editingAgent) || null}
      />
    </div>
  );
};

export default Dashboard;
