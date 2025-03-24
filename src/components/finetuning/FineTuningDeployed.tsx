
import { useState } from "react";
import { 
  Cpu, 
  Server, 
  Globe, 
  ArrowUpDown, 
  Users, 
  Rocket, 
  BarChart, 
  Copy,
  CheckCircle,
  AlertCircle
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { DeployedModel } from "@/types/finetuning";
import { toast } from "sonner";

const FineTuningDeployed = () => {
  const [deployedModels, setDeployedModels] = useState<DeployedModel[]>([
    {
      id: "deploy-1",
      name: "Customer Support GPT",
      trainingJobId: "job-1",
      deployedAt: new Date("2023-10-12"),
      status: "active",
      endpoint: "api/v1/models/customer-support-gpt",
      version: "1.0.0"
    },
    {
      id: "deploy-2",
      name: "Documentation Assistant",
      trainingJobId: "job-fake",
      deployedAt: new Date("2023-10-02"),
      status: "active",
      endpoint: "api/v1/models/documentation-assistant",
      version: "2.1.5"
    },
    {
      id: "deploy-3",
      name: "Sales Conversation Agent",
      trainingJobId: "job-fake-2",
      deployedAt: new Date("2023-10-16"),
      status: "deploying",
      version: "1.0.0"
    }
  ]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "active": 
        return <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span className="text-xs text-green-500 font-medium">Active</span>
        </div>;
      case "inactive": 
        return <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-gray-500"></span>
          <span className="text-xs text-gray-500 font-medium">Inactive</span>
        </div>;
      case "deploying": 
        return <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-xs text-blue-500 font-medium">Deploying</span>
        </div>;
      case "failed": 
        return <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500"></span>
          <span className="text-xs text-red-500 font-medium">Failed</span>
        </div>;
      default: return null;
    }
  };

  const handleCopyEndpoint = (endpoint: string) => {
    navigator.clipboard.writeText(endpoint);
    toast.success("API endpoint copied to clipboard");
  };

  const deployToAgentTemplate = (modelId: string) => {
    toast.success("Model connected to agent template", {
      description: "You can now use this model in the Agent Builder."
    });
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">Deployed Models</h2>
          <p className="text-muted-foreground">Manage your fine-tuned models deployed in production</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deployedModels.map(model => (
          <Card key={model.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <Server className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>{model.name}</CardTitle>
                    <CardDescription>
                      v{model.version} • Deployed {formatDate(model.deployedAt)}
                    </CardDescription>
                  </div>
                </div>
                {getStatusIndicator(model.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              {model.status === "deploying" && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Deployment Progress</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              )}
              
              <div className="space-y-3">
                {model.endpoint && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">API Endpoint</span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <Badge variant="outline" className="font-mono text-xs">{model.endpoint}</Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => handleCopyEndpoint(model.endpoint as string)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-sm">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Usage</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={model.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : ""}
                  >
                    {model.status === "active" ? "245 requests/day" : "N/A"}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Used By</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={model.status === "active" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" : ""}
                  >
                    {model.status === "active" ? "3 Agents" : "None"}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-sm">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Status</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    {model.status === "active" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : model.status === "deploying" ? (
                      <span className="h-4 w-4 flex items-center justify-center">
                        <span className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full"></span>
                      </span>
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm capitalize">{model.status}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                disabled={model.status !== "active"}
              >
                <BarChart className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                disabled={model.status !== "active"}
                onClick={() => deployToAgentTemplate(model.id)}
              >
                <Rocket className="h-4 w-4 mr-2" />
                Use in Agent
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {deployedModels.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg">
          <Server className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No deployed models</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            After completing a fine-tuning job, you can deploy your model for use in agents
          </p>
          <Button onClick={() => window.history.back()}>
            Return to Training Jobs
          </Button>
        </div>
      )}
    </div>
  );
};

export default FineTuningDeployed;
