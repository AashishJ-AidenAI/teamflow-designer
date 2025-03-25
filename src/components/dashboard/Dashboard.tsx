
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  ArrowUpDown,
  GitBranch
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
import WorkflowCard from "./WorkflowCard";
import Metrics from "./Metrics";
import NewTeamModal from "./NewTeamModal";
import EditAgentModal from "./EditAgentModal";
import NewWorkflowModal from "./NewWorkflowModal";
import ClientManager from "./ClientManager";
import { useAgents } from "@/context/AgentContext";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { agents, teams, updateAgent, addTeam, updateClientList } = useAgents();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("agents");
  const [isNewTeamModalOpen, setIsNewTeamModalOpen] = useState(false);
  const [isNewWorkflowModalOpen, setIsNewWorkflowModalOpen] = useState(false);
  const [isClientManagerOpen, setIsClientManagerOpen] = useState(false);
  const [selectedAgentForClients, setSelectedAgentForClients] = useState<string | null>(null);
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
  
  // Sample workflows data
  const workflows = [
    { 
      id: "wf1", 
      name: "Customer Support Flow", 
      agents: ["Customer Support Agent", "Document Processing Agent"],
      teams: ["Support Team"],
      inputType: "Customer Request",
      outputType: "Resolution",
      clients: ["Client A", "Client C"],
      active: true,
      createdBy: "Admin",
      lastModified: new Date("2023-11-15")
    },
    { 
      id: "wf2", 
      name: "Sales Qualification Flow", 
      agents: ["Sales Agent", "Pre-screening Agent"],
      teams: [],
      inputType: "Lead Data",
      outputType: "Qualified Lead",
      clients: ["Client B"],
      active: true,
      createdBy: "Admin",
      lastModified: new Date("2023-11-10")
    },
    { 
      id: "wf3", 
      name: "Document Processing", 
      agents: ["Document Processing Agent", "Validation Agent"],
      teams: ["Content Team"],
      inputType: "PDF Document",
      outputType: "Structured Data",
      clients: ["Client D", "Client E"],
      active: false,
      createdBy: "Admin",
      lastModified: new Date("2023-11-05")
    }
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
  
  const handleCreateWorkflow = (newWorkflow: any) => {
    // Instead of just showing a toast, redirect to builder
    setIsNewWorkflowModalOpen(false);
    navigate("/builder");
    toast.success("New workflow created. Complete it in the builder");
  };
  
  const handleEditWorkflow = (workflowId: string) => {
    // Redirect to builder with the workflow ID
    navigate(`/builder?workflow=${workflowId}`);
  };
  
  const handleNewWorkflow = () => {
    // Redirect directly to builder for a new workflow
    navigate("/builder");
  };
  
  const handleAssignClientsToAgent = (agentId: string) => {
    setSelectedAgentForClients(agentId);
    setIsClientManagerOpen(true);
  };
  
  const handleUpdateAgentClients = (clients: string[]) => {
    if (selectedAgentForClients) {
      const agent = agents.find(a => a.id === selectedAgentForClients);
      if (agent) {
        const updatedAgent = {
          ...agent,
          clientAssigned: clients
        };
        updateAgent(updatedAgent);
        toast.success(`Updated clients for ${agent.name}`);
      }
    }
    setIsClientManagerOpen(false);
    setSelectedAgentForClients(null);
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
  
  const filteredWorkflows = workflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.agents.some(agent => agent.toLowerCase().includes(searchTerm.toLowerCase())) ||
    workflow.teams.some(team => team.toLowerCase().includes(searchTerm.toLowerCase())) ||
    workflow.inputType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.outputType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.clients.some(client => 
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
            
            {activeTab === "workflows" && (
              <Button 
                className="gap-2"
                onClick={handleNewWorkflow}
              >
                <PlusCircle className="h-4 w-4" />
                New Workflow
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
                onAssignClients={() => handleAssignClientsToAgent(agent.id)}
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
        
        <TabsContent value="workflows" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkflows.map((workflow) => (
              <WorkflowCard 
                key={workflow.id}
                workflow={workflow}
                allClients={clientsData}
                onEdit={() => handleEditWorkflow(workflow.id)}
              />
            ))}
          </div>
          
          {filteredWorkflows.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No workflows found matching your search.</p>
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
      
      <NewWorkflowModal 
        isOpen={isNewWorkflowModalOpen}
        onClose={() => setIsNewWorkflowModalOpen(false)}
        onSave={handleCreateWorkflow}
        allAgents={agents}
        allTeams={teams}
        allClients={clientsData}
      />
      
      <ClientManager 
        isOpen={isClientManagerOpen}
        onClose={() => setIsClientManagerOpen(false)}
        onSave={handleUpdateAgentClients}
        teamName={agents.find(a => a.id === selectedAgentForClients)?.name || "Agent"}
        selectedClients={agents.find(a => a.id === selectedAgentForClients)?.clientAssigned || []}
        allClients={clientsData}
      />
    </div>
  );
};

export default Dashboard;
