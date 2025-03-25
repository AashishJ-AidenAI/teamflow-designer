
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface KnowledgeSource {
  id: string;
  name: string;
  type: "document" | "website" | "database" | "custom";
  description: string;
  status: "active" | "processing" | "error";
  lastUpdated: Date;
  documentCount?: number;
}

export interface Knowledgebase {
  id: string;
  name: string;
  description: string;
  sources: string[]; // IDs of knowledge sources
  createdAt: Date;
  updatedAt: Date;
}

interface KnowledgebaseContextType {
  knowledgebases: Knowledgebase[];
  sources: KnowledgeSource[];
  addKnowledgebase: (kb: Knowledgebase) => void;
  updateKnowledgebase: (kb: Knowledgebase) => void;
  deleteKnowledgebase: (kbId: string) => void;
  addSource: (source: KnowledgeSource) => void;
  updateSource: (source: KnowledgeSource) => void;
  deleteSource: (sourceId: string) => void;
}

const KnowledgebaseContext = createContext<KnowledgebaseContextType | undefined>(undefined);

// Initial sample data
const initialSources: KnowledgeSource[] = [
  {
    id: "src1",
    name: "Company Documentation",
    type: "document",
    description: "Internal company documentation and guidelines",
    status: "active",
    lastUpdated: new Date("2023-10-15"),
    documentCount: 45
  },
  {
    id: "src2",
    name: "Product Knowledge",
    type: "website",
    description: "Product specifications and user guides",
    status: "active",
    lastUpdated: new Date("2023-10-20"),
    documentCount: 28
  },
  {
    id: "src3",
    name: "Customer FAQ",
    type: "custom",
    description: "Frequently asked questions by customers",
    status: "active",
    lastUpdated: new Date("2023-10-18"),
    documentCount: 65
  }
];

const initialKnowledgebases: Knowledgebase[] = [
  {
    id: "kb1",
    name: "Support Knowledge",
    description: "Knowledge for customer support agents",
    sources: ["src1", "src3"],
    createdAt: new Date("2023-09-01"),
    updatedAt: new Date("2023-10-20")
  },
  {
    id: "kb2",
    name: "Sales Knowledge",
    description: "Product and pricing information for sales",
    sources: ["src2"],
    createdAt: new Date("2023-09-15"),
    updatedAt: new Date("2023-10-18")
  }
];

export const KnowledgebaseProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [knowledgebases, setKnowledgebases] = useState<Knowledgebase[]>(initialKnowledgebases);
  const [sources, setSources] = useState<KnowledgeSource[]>(initialSources);

  const addKnowledgebase = (kb: Knowledgebase) => {
    setKnowledgebases(prev => [...prev, kb]);
    console.log("Knowledgebase added:", kb);
  };

  const updateKnowledgebase = (kb: Knowledgebase) => {
    setKnowledgebases(prev => 
      prev.map(existing => existing.id === kb.id ? kb : existing)
    );
    console.log("Knowledgebase updated:", kb);
  };

  const deleteKnowledgebase = (kbId: string) => {
    setKnowledgebases(prev => prev.filter(kb => kb.id !== kbId));
    console.log("Knowledgebase deleted:", kbId);
  };

  const addSource = (source: KnowledgeSource) => {
    setSources(prev => [...prev, source]);
    console.log("Knowledge source added:", source);
  };

  const updateSource = (source: KnowledgeSource) => {
    setSources(prev => 
      prev.map(existing => existing.id === source.id ? source : existing)
    );
    console.log("Knowledge source updated:", source);
  };

  const deleteSource = (sourceId: string) => {
    setSources(prev => prev.filter(source => source.id !== sourceId));
    console.log("Knowledge source deleted:", sourceId);
  };

  return (
    <KnowledgebaseContext.Provider 
      value={{ 
        knowledgebases, 
        sources, 
        addKnowledgebase, 
        updateKnowledgebase, 
        deleteKnowledgebase, 
        addSource, 
        updateSource, 
        deleteSource 
      }}
    >
      {children}
    </KnowledgebaseContext.Provider>
  );
};

export const useKnowledgebase = () => {
  const context = useContext(KnowledgebaseContext);
  if (context === undefined) {
    throw new Error("useKnowledgebase must be used within a KnowledgebaseProvider");
  }
  return context;
};
