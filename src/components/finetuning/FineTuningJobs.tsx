
import { useState } from "react";
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
import { 
  Clock, 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Terminal,
  Rocket
} from "lucide-react";
import { TrainingJob } from "@/types/finetuning";
import { toast } from "sonner";

interface FineTuningJobsProps {
  onDeploySuccess?: () => void;
}

const FineTuningJobs = ({ onDeploySuccess }: FineTuningJobsProps) => {
  const [jobs, setJobs] = useState<TrainingJob[]>([
    {
      id: "job-1",
      modelId: "model-1",
      datasetId: "dataset-1",
      status: "completed",
      progress: 100,
      createdAt: new Date("2023-10-10"),
      startedAt: new Date("2023-10-10"),
      completedAt: new Date("2023-10-11"),
      metrics: {
        loss: 0.087,
        accuracy: 0.923
      },
      parameters: {
        learningRate: 0.0001,
        epochs: 3,
        batchSize: 16,
        validationSplit: 0.2
      }
    },
    {
      id: "job-2",
      modelId: "model-2",
      datasetId: "dataset-2",
      status: "running",
      progress: 45,
      createdAt: new Date("2023-10-14"),
      startedAt: new Date("2023-10-14"),
      parameters: {
        learningRate: 0.0002,
        epochs: 5,
        batchSize: 8,
        validationSplit: 0.15
      }
    },
    {
      id: "job-3",
      modelId: "model-1",
      datasetId: "dataset-3",
      status: "queued",
      progress: 0,
      createdAt: new Date("2023-10-15"),
      parameters: {
        learningRate: 0.0001,
        epochs: 2,
        batchSize: 32,
        validationSplit: 0.1
      }
    },
    {
      id: "job-4",
      modelId: "model-3",
      datasetId: "dataset-1",
      status: "failed",
      progress: 78,
      createdAt: new Date("2023-10-08"),
      startedAt: new Date("2023-10-08"),
      completedAt: new Date("2023-10-09"),
      error: "Out of memory error at epoch 2",
      parameters: {
        learningRate: 0.0003,
        epochs: 4,
        batchSize: 16,
        validationSplit: 0.2
      }
    }
  ]);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>;
      case "running":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Running</Badge>;
      case "queued":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Queued</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Failed</Badge>;
      case "canceled":
        return <Badge variant="outline">Canceled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "running":
        return <Activity className="h-5 w-5 text-blue-500 animate-pulse" />;
      case "queued":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "canceled":
        return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
      default:
        return null;
    }
  };
  
  const viewLogs = (jobId: string) => {
    toast.info("Viewing logs is not implemented in this demo", {
      description: "In a real application, this would show training logs for job " + jobId
    });
  };
  
  const deployModel = (jobId: string) => {
    toast.success("Model deployed successfully", {
      description: "Your fine-tuned model is now available for use in agents."
    });
    
    if (onDeploySuccess) {
      onDeploySuccess();
    }
  };
  
  const cancelJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { ...job, status: "canceled" }
        : job
    ));
    
    toast.success("Job canceled successfully");
  };
  
  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">Training Jobs</h2>
          <p className="text-muted-foreground">Manage your model fine-tuning jobs</p>
        </div>
        
        <Button>
          Create New Job
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map(job => (
          <Card key={job.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <CardTitle>Training Job #{job.id.replace("job-", "")}</CardTitle>
                  <CardDescription>
                    Created {formatDate(job.createdAt)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(job.status)}
                  {getStatusBadge(job.status)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="space-y-4">
                {job.status === "running" && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-muted-foreground">Model</span>
                  <span>Model #{job.modelId.replace("model-", "")}</span>
                  
                  <span className="text-muted-foreground">Dataset</span>
                  <span>Dataset #{job.datasetId.replace("dataset-", "")}</span>
                  
                  <span className="text-muted-foreground">Epochs</span>
                  <span>{job.parameters.epochs}</span>
                  
                  <span className="text-muted-foreground">Batch Size</span>
                  <span>{job.parameters.batchSize}</span>
                </div>
                
                {job.status === "completed" && job.metrics && (
                  <div className="border-t pt-2">
                    <p className="text-sm font-medium mb-1">Training Metrics</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col items-center justify-center p-2 bg-secondary rounded-md">
                        <span className="text-xs text-muted-foreground">Loss</span>
                        <span className="text-lg font-medium">{job.metrics.loss?.toFixed(4)}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 bg-secondary rounded-md">
                        <span className="text-xs text-muted-foreground">Accuracy</span>
                        <span className="text-lg font-medium">{job.metrics.accuracy?.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {job.status === "failed" && job.error && (
                  <div className="border-t pt-2">
                    <p className="text-sm font-medium text-destructive mb-1">Error</p>
                    <div className="text-sm bg-destructive/10 p-2 rounded-md text-destructive">
                      {job.error}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex gap-2">
              {job.status === "completed" && (
                <Button 
                  variant="default" 
                  className="flex-1 gap-1"
                  onClick={() => deployModel(job.id)}
                >
                  <Rocket className="h-4 w-4" />
                  Deploy Model
                </Button>
              )}
              
              {(job.status === "running" || job.status === "queued") && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => cancelJob(job.id)}
                >
                  Cancel
                </Button>
              )}
              
              <Button 
                variant={job.status === "completed" ? "outline" : "default"} 
                className="flex-1 gap-1"
                onClick={() => viewLogs(job.id)}
              >
                <Terminal className="h-4 w-4" />
                View Logs
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {jobs.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg">
          <Activity className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No training jobs</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Start fine-tuning a model by creating a new training job.
          </p>
          <Button>
            Create New Job
          </Button>
        </div>
      )}
    </div>
  );
};

export default FineTuningJobs;
