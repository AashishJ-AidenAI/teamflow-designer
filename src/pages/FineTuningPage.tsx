
import { useState } from "react";
import FineTuningModels from "@/components/finetuning/FineTuningModels";
import FineTuningJobs from "@/components/finetuning/FineTuningJobs";
import FineTuningUpload from "@/components/finetuning/FineTuningUpload";
import FineTuningDeployed from "@/components/finetuning/FineTuningDeployed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FineTuningModel } from "@/types/finetuning";

const FineTuningPage = () => {
  const [selectedTab, setSelectedTab] = useState("models");
  const [selectedModel, setSelectedModel] = useState<FineTuningModel | null>(null);

  const handleSelectModel = (model: FineTuningModel) => {
    setSelectedModel(model);
    setSelectedTab("upload");
  };

  const handleDeploySuccess = () => {
    setSelectedTab("deployed");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fine-Tuning Lab</h1>
        <p className="text-muted-foreground">
          Fine-tune and customize LLMs for your specific use cases
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="upload" disabled={!selectedModel}>Dataset</TabsTrigger>
          <TabsTrigger value="jobs">Training Jobs</TabsTrigger>
          <TabsTrigger value="deployed">Deployed Models</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="mt-0">
          <FineTuningModels onSelectModel={handleSelectModel} />
        </TabsContent>

        <TabsContent value="upload" className="mt-0">
          {selectedModel && (
            <FineTuningUpload model={selectedModel} onComplete={() => setSelectedTab("jobs")} />
          )}
        </TabsContent>

        <TabsContent value="jobs" className="mt-0">
          <FineTuningJobs onDeploySuccess={handleDeploySuccess} />
        </TabsContent>

        <TabsContent value="deployed" className="mt-0">
          <FineTuningDeployed />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FineTuningPage;
