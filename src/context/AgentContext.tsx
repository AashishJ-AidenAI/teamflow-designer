import React, { createContext, useContext, useState, ReactNode } from "react";

// Agent types
export type AgentType = 
  | "pre-screening" 
  | "interview" 
  | "sales" 
  | "document-processing" 
  | "customer-support" 
  | "validation" 
  | "email-parser";

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  llm: string;
  tools: string[];
  active: boolean;
  responseTime: number;
  usageCount: number;
  knowledgebaseId?: string;
  assignedClients?: string[];
}

export type ExecutionStrategy = "parallel" | "selection" | "sequential";

export interface Team {
  id: string;
  name: string;
  strategy: ExecutionStrategy;
  agents: string[];
  active: boolean;
  clientAssigned: string[];
}

interface AgentContextType {
  agents: Agent[];
  teams: Team[];
  updateAgent: (updatedAgent: Agent) => void;
  addTeam: (team: Team) => void;
  updateTeam: (updatedTeam: Team) => void;
  deleteTeam: (teamId: string) => void;
  updateClientList: (teamId: string, clients: string[]) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

// Predefined agent templates
const predefinedAgents: Agent[] = [
  {
    id: "a1",
    name: "Pre-screening Agent",
    type: "pre-screening",
    llm: "GPT-4",
    tools: ["Resume Analysis", "Credential Verification", "Candidate Scoring"],
    active: true,
    responseTime: 220,
    usageCount: 1280,
    assignedClients: ["Client A", "Client B"]
  },
  {
    id: "a2",
    name: "Interview Agent",
    type: "interview",
    llm: "Claude-3",
    tools: ["Question Generation", "Response Analysis", "Candidate Assessment"],
    active: true,
    responseTime: 300,
    usageCount: 950,
    assignedClients: ["Client A"]
  },
  {
    id: "a3",
    name: "Sales Agent",
    type: "sales",
    llm: "Gemini Pro",
    tools: ["Lead Qualification", "Product Matching", "Pricing Analysis"],
    active: false,
    responseTime: 150,
    usageCount: 750,
  },
  {
    id: "a4",
    name: "Document/Data Processing Agent",
    type: "document-processing",
    llm: "GPT-4",
    tools: ["PDF Extraction", "Data Validation", "Format Conversion"],
    active: true,
    responseTime: 180,
    usageCount: 1100,
  },
  {
    id: "a5",
    name: "Customer Support Agent",
    type: "customer-support",
    llm: "Claude-3",
    tools: ["Issue Classification", "Knowledge Base Search", "Solution Recommendation"],
    active: true,
    responseTime: 250,
    usageCount: 870,
  },
  {
    id: "a6",
    name: "Validation Agent",
    type: "validation",
    llm: "Gemini Pro",
    tools: ["Data Verification", "Consistency Checking", "Quality Control"],
    active: false,
    responseTime: 350,
    usageCount: 580,
  },
  {
    id: "a7",
    name: "Email Parser Agent",
    type: "email-parser",
    llm: "GPT-4",
    tools: ["Content Extraction", "Intent Recognition", "Action Classification"],
    active: true,
    responseTime: 200,
    usageCount: 820,
  }
];

// Sample teams data
const initialTeams: Team[] = [
  {
    id: "t1",
    name: "Research Team",
    strategy: "parallel",
    agents: ["Pre-screening Agent", "Interview Agent"],
    active: true,
    clientAssigned: ["Client A", "Client B"],
  },
  {
    id: "t2",
    name: "Content Team",
    strategy: "selection",
    agents: ["Customer Support Agent", "Sales Agent"],
    active: true,
    clientAssigned: ["Client C"],
  },
  {
    id: "t3",
    name: "Dev Team",
    strategy: "sequential",
    agents: ["Document/Data Processing Agent", "Validation Agent"],
    active: false,
    clientAssigned: [],
  }
];

export const AgentProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>(predefinedAgents);
  const [teams, setTeams] = useState<Team[]>(initialTeams);

  const updateAgent = (updatedAgent: Agent) => {
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === updatedAgent.id ? updatedAgent : agent
      )
    );
    console.log("Agent updated:", updatedAgent);
  };

  const addTeam = (team: Team) => {
    setTeams(prevTeams => [...prevTeams, team]);
    console.log("Team added:", team);
  };

  const updateTeam = (updatedTeam: Team) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === updatedTeam.id ? updatedTeam : team
      )
    );
    console.log("Team updated:", updatedTeam);
  };

  const deleteTeam = (teamId: string) => {
    setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
    console.log("Team deleted:", teamId);
  };

  const updateClientList = (teamId: string, clients: string[]) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === teamId 
          ? { ...team, clientAssigned: clients }
          : team
      )
    );
    console.log("Client list updated for team", teamId, ":", clients);
  };

  return (
    <AgentContext.Provider 
      value={{ 
        agents, 
        teams, 
        updateAgent, 
        addTeam, 
        updateTeam, 
        deleteTeam, 
        updateClientList 
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export const useAgents = () => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error("useAgents must be used within an AgentProvider");
  }
  return context;
};
