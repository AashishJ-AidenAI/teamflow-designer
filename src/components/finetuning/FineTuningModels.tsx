
import { useState } from "react";
import { Cpu, Info, Settings, CheckCircle, ArrowRight } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FineTuningModel } from "@/types/finetuning";

interface FineTuningModelsProps {
  onSelectModel: (model: FineTuningModel) => void;
}

const FineTuningModels = ({ onSelectModel }: FineTuningModelsProps) => {
  const [models] = useState<FineTuningModel[]>([
    {
      id: "model-1",
      name: "GPT-3.5 Turbo",
      provider: "openai",
      size: "medium",
      description: "A versatile and economical model with broad capabilities, ideal for fine-tuning for specific domains.",
      parameters: "1.3B",
      supportsTraining: true,
      requiredDataFormat: "JSONL",
      baseModel: "gpt-3.5-turbo"
    },
    {
      id: "model-2",
      name: "Claude Instant",
      provider: "anthropic",
      size: "medium",
      description: "Fast and cost-effective model with good comprehension and response capabilities.",
      parameters: "2B",
      supportsTraining: true,
      requiredDataFormat: "JSONL",
      baseModel: "claude-instant-1.2"
    },
    {
      id: "model-3",
      name: "Llama 2 (7B)",
      provider: "meta",
      size: "small",
      description: "Open source model with good performance on a variety of tasks, easily deployable on modest hardware.",
      parameters: "7B",
      supportsTraining: true,
      requiredDataFormat: "JSONL",
      baseModel: "llama-2-7b"
    },
    {
      id: "model-4",
      name: "Mistral 7B",
      provider: "mistral",
      size: "small",
      description: "Powerful open source model with great instruction following capabilities.",
      parameters: "7B",
      supportsTraining: true,
      requiredDataFormat: "JSONL/TXT",
      baseModel: "mistral-7b-v0.1"
    },
    {
      id: "model-5",
      name: "GPT-4o",
      provider: "openai",
      size: "large",
      description: "Advanced multi-modal model with exceptional reasoning and instruction following.",
      parameters: "100B+",
      supportsTraining: false,
      requiredDataFormat: "JSONL",
      baseModel: "gpt-4o"
    }
  ]);

  const getProviderColor = (provider: string): string => {
    switch (provider) {
      case "openai": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "anthropic": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "meta": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "mistral": return "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getSizeColor = (size: string): string => {
    switch (size) {
      case "small": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "medium": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "large": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-medium">Available Models</h2>
        <p className="text-muted-foreground">Select a model to fine-tune for your specific use case</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map(model => (
          <Card key={model.id} className={`${!model.supportsTraining ? 'opacity-60' : ''}`}>
            <CardHeader className="gap-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        {model.description}
                        <br /><br />
                        Required data format: {model.requiredDataFormat}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getProviderColor(model.provider)}>
                  {model.provider.charAt(0).toUpperCase() + model.provider.slice(1)}
                </Badge>
                <Badge variant="outline" className={getSizeColor(model.size)}>
                  {model.size.charAt(0).toUpperCase() + model.size.slice(1)}
                </Badge>
                <Badge variant="outline">
                  {model.parameters} parameters
                </Badge>
              </div>
              <CardDescription>{model.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Model</span>
                  <span className="font-medium">{model.baseModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fine-Tuning Support</span>
                  <span className="font-medium flex items-center">
                    {model.supportsTraining ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        Supported
                      </>
                    ) : (
                      <>
                        <Settings className="h-4 w-4 text-amber-500 mr-1" />
                        Limited Support
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data Format</span>
                  <span className="font-medium">{model.requiredDataFormat}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                className="w-full" 
                disabled={!model.supportsTraining}
                onClick={() => onSelectModel(model)}
              >
                Select for Fine-Tuning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FineTuningModels;
