
import { useState } from "react";
import FineTuningModels from "@/components/finetuning/FineTuningModels";
import FineTuningJobs from "@/components/finetuning/FineTuningJobs";
import FineTuningUpload from "@/components/finetuning/FineTuningUpload";
import FineTuningDeployed from "@/components/finetuning/FineTuningDeployed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FineTuningModel } from "@/types/finetuning";
import { Cpu, Database, Activity, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

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

  // Added animation variants for page elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        ease: "easeOut",
        duration: 0.4
      }
    }
  };

  return (
    <motion.div 
      className="container mx-auto py-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Fine-Tuning Lab
        </h1>
        <p className="text-muted-foreground">
          Fine-tune and customize LLMs for your specific use cases
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-200/50 dark:bg-slate-800/50">
              <TabsTrigger value="models" className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                <span>Models</span>
              </TabsTrigger>
              <TabsTrigger value="upload" disabled={!selectedModel} className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Dataset</span>
              </TabsTrigger>
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>Training Jobs</span>
              </TabsTrigger>
              <TabsTrigger value="deployed" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Deployed Models</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="models" className="mt-0 p-0">
              <FineTuningModels onSelectModel={handleSelectModel} />
            </TabsContent>

            <TabsContent value="upload" className="mt-0 p-0">
              {selectedModel && (
                <FineTuningUpload model={selectedModel} onComplete={() => setSelectedTab("jobs")} />
              )}
            </TabsContent>

            <TabsContent value="jobs" className="mt-0 p-0">
              <FineTuningJobs onDeploySuccess={handleDeploySuccess} />
            </TabsContent>

            <TabsContent value="deployed" className="mt-0 p-0">
              <FineTuningDeployed />
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>

      {/* Additional help section */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
      >
        <Card className="p-4 hover:shadow-md transition-all duration-300">
          <h3 className="font-semibold text-lg mb-2">Model Selection</h3>
          <p className="text-sm text-muted-foreground">
            Choose from a variety of base models to fine-tune for your specific use case.
          </p>
        </Card>
        <Card className="p-4 hover:shadow-md transition-all duration-300">
          <h3 className="font-semibold text-lg mb-2">Dataset Preparation</h3>
          <p className="text-sm text-muted-foreground">
            Upload and prepare your training data in the required format for optimal results.
          </p>
        </Card>
        <Card className="p-4 hover:shadow-md transition-all duration-300">
          <h3 className="font-semibold text-lg mb-2">Monitoring & Deployment</h3>
          <p className="text-sm text-muted-foreground">
            Track training progress and deploy your fine-tuned models with just a few clicks.
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default FineTuningPage;
