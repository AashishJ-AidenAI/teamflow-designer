
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FileIcon, Server, UploadIcon, Brain } from "lucide-react";
import FineTuningJobs from "@/components/finetuning/FineTuningJobs";
import FineTuningModels from "@/components/finetuning/FineTuningModels";
import FineTuningUpload from "@/components/finetuning/FineTuningUpload";
import FineTuningDeployed from "@/components/finetuning/FineTuningDeployed";

const FineTuningPage = () => {
  const [activeTab, setActiveTab] = useState("models");
  
  const handleSelectModel = (modelId: string) => {
    console.log(`Selected model: ${modelId}`);
    setActiveTab("jobs");
  };

  const handleDeploySuccess = () => {
    setActiveTab("deployed");
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Fine-Tuning</h1>
      
      <Tabs defaultValue="models" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Models
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <FileIcon className="h-4 w-4" />
            Jobs
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <UploadIcon className="h-4 w-4" />
            Upload Data
          </TabsTrigger>
          <TabsTrigger value="deployed" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Deployed Models
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="models">
          <FineTuningModels onSelectModel={handleSelectModel} />
        </TabsContent>
        
        <TabsContent value="jobs">
          <FineTuningJobs onDeploySuccess={handleDeploySuccess} />
        </TabsContent>
        
        <TabsContent value="upload">
          <FineTuningUpload />
        </TabsContent>
        
        <TabsContent value="deployed">
          <FineTuningDeployed />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FineTuningPage;
