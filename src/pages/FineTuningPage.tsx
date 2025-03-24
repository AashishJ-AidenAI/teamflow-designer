
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FineTuningUpload from "@/components/finetuning/FineTuningUpload";
import FineTuningModels from "@/components/finetuning/FineTuningModels";
import FineTuningJobs from "@/components/finetuning/FineTuningJobs";
import FineTuningDeployed from "@/components/finetuning/FineTuningDeployed";

const FineTuningPage = () => {
  const [activeTab, setActiveTab] = useState("datasets");

  return (
    <div className="w-full h-full" style={{ height: "calc(100vh - 64px)" }}>
      <Tabs 
        defaultValue="datasets" 
        className="w-full h-full flex flex-col"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="border-b">
          <TabsList className="h-12">
            <TabsTrigger value="datasets" className="text-sm">Datasets</TabsTrigger>
            <TabsTrigger value="models" className="text-sm">Models</TabsTrigger>
            <TabsTrigger value="jobs" className="text-sm">Training Jobs</TabsTrigger>
            <TabsTrigger value="deployed" className="text-sm">Deployed Models</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="datasets" className="flex-1 overflow-auto p-1">
          <FineTuningUpload />
        </TabsContent>
        
        <TabsContent value="models" className="flex-1 overflow-auto p-1">
          <FineTuningModels onSelectModel={() => setActiveTab("jobs")} />
        </TabsContent>
        
        <TabsContent value="jobs" className="flex-1 overflow-auto p-1">
          <FineTuningJobs onDeploySuccess={() => setActiveTab("deployed")} />
        </TabsContent>
        
        <TabsContent value="deployed" className="flex-1 overflow-auto p-1">
          <FineTuningDeployed />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FineTuningPage;
