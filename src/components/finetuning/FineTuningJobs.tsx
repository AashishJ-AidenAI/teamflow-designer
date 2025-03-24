
import { useState } from "react";
import { PlayCircle, ClockIcon, Cpu, CheckCircle, XCircle, PauseCircle, BarChart, Send } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TrainingJob, TrainingLog } from "@/types/finetuning";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface FineTuningJobsProps {
  onDeploySuccess: () => void;
}

const FineTuningJobs = ({ onDeploySuccess }: FineTuningJobsProps) => {
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([
    {
      id: "job-1",
      modelId: "model-1",
      datasetId: "ds-1",
      status: "completed",
      progress: 100,
      createdAt: new Date("2023-10-12"),
      startedAt: new Date("2023-10-12"),
      completedAt: new Date("2023-10-12"),
      metrics: {
        loss: 0.1245,
        accuracy: 0.9245
      },
      parameters: {
        learningRate: 0.001,
        epochs: 3,
        batchSize: 8,
        validationSplit: 0.2
      }
    },
    {
      id: "job-2",
      modelId: "model-3",
      datasetId: "ds-2",
      status: "running",
      progress: 67,
      createdAt: new Date("2023-10-15"),
      startedAt: new Date("2023-10-15"),
      parameters: {
        learningRate: 0.002,
        epochs: 5,
        batchSize: 16,
        validationSplit: 0.15
      }
    },
    {
      id: "job-3",
      modelId: "model-2",
      datasetId: "ds-1",
      status: "failed",
      progress: 35,
      createdAt: new Date("2023-10-14"),
      startedAt: new Date("2023-10-14"),
      error: "Out of memory error during training step 245",
      parameters: {
        learningRate: 0.003,
        epochs: 10,
        batchSize: 32,
        validationSplit: 0.2
      }
    }
  ]);

  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>([
    {
      id: "log-1",
      jobId: "job-2",
      timestamp: new Date(Date.now() - 350000),
      message: "Starting fine-tuning job with LLama 2 model",
      level: "info"
    },
    {
      id: "log-2",
      jobId: "job-2",
      timestamp: new Date(Date.now() - 300000),
      message: "Preprocessing dataset ds-2, found 1203 training examples",
      level: "info"
    },
    {
      id: "log-3",
      jobId: "job-2",
      timestamp: new Date(Date.now() - 250000),
      message: "Epoch 1/5, Batch 1/75, Loss: 2.5421, Accuracy: 0.3245",
      level: "info"
    },
    {
      id: "log-4",
      jobId: "job-2",
      timestamp: new Date(Date.now() - 200000),
      message: "Epoch 1/5 completed, Loss: 2.1245, Accuracy: 0.5642",
      level: "info"
    },
    {
      id: "log-5",
      jobId: "job-2",
      timestamp: new Date(Date.now() - 150000),
      message: "Epoch 2/5, Batch 1/75, Loss: 1.8542, Accuracy: 0.6124",
      level: "info"
    },
    {
      id: "log-6",
      jobId: "job-2",
      timestamp: new Date(Date.now() - 100000),
      message: "Epoch 2/5 completed, Loss: 1.5214, Accuracy: 0.7245",
      level: "info"
    },
    {
      id: "log-7",
      jobId: "job-2",
      timestamp: new Date(Date.now() - 50000),
      message: "Epoch 3/5, Batch 1/75, Loss: 1.2574, Accuracy: 0.7845",
      level: "info"
    },
    {
      id: "log-8",
      jobId: "job-2",
      timestamp: new Date(Date.now() - 30000),
      message: "Epoch 3/5 completed, Loss: 0.9845, Accuracy: 0.8342",
      level: "info"
    },
    {
      id: "log-9",
      jobId: "job-2",
      timestamp: new Date(Date.now() - 10000),
      message: "Epoch 4/5 in progress, 35% complete...",
      level: "info"
    }
  ]);

  const [selectedJob, setSelectedJob] = useState<string | null>("job-2");
  const [showNewJobForm, setShowNewJobForm] = useState(false);

  const form = useForm({
    defaultValues: {
      model: "",
      dataset: "",
      learningRate: "0.001",
      epochs: "3",
      batchSize: "8",
      validationSplit: "0.2"
    }
  });

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    });
  };

  const formatLogTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "queued": return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case "running": return <PlayCircle className="h-5 w-5 text-amber-500" />;
      case "completed": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed": return <XCircle className="h-5 w-5 text-red-500" />;
      case "canceled": return <PauseCircle className="h-5 w-5 text-gray-500" />;
      default: return <Cpu className="h-5 w-5" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "queued": return "text-blue-500";
      case "running": return "text-amber-500";
      case "completed": return "text-green-500";
      case "failed": return "text-red-500";
      case "canceled": return "text-gray-500";
      default: return "";
    }
  };

  const handleDeployModel = (jobId: string) => {
    toast.success("Model deployment initiated", {
      description: "Your model is being prepared for deployment."
    });
    
    // Simulate deployment progress
    setTimeout(() => {
      toast.success("Model deployed successfully", {
        description: "Your fine-tuned model is now available for use in agents."
      });
      onDeploySuccess();
    }, 2000);
  };

  const onSubmit = (data: any) => {
    // Create a new training job
    const newJob: TrainingJob = {
      id: `job-${trainingJobs.length + 1}`,
      modelId: data.model,
      datasetId: data.dataset,
      status: "queued",
      progress: 0,
      createdAt: new Date(),
      parameters: {
        learningRate: parseFloat(data.learningRate),
        epochs: parseInt(data.epochs),
        batchSize: parseInt(data.batchSize),
        validationSplit: parseFloat(data.validationSplit)
      }
    };
    
    setTrainingJobs(prev => [newJob, ...prev]);
    setSelectedJob(newJob.id);
    setShowNewJobForm(false);
    
    toast.success("Training job created", {
      description: "Your model fine-tuning job has been queued and will start soon."
    });
    
    // Simulate job starting
    setTimeout(() => {
      setTrainingJobs(prev => 
        prev.map(job => 
          job.id === newJob.id 
            ? { ...job, status: "running", startedAt: new Date() } 
            : job
        )
      );
      
      // Add initial log
      const initialLog: TrainingLog = {
        id: `log-${trainingLogs.length + 1}`,
        jobId: newJob.id,
        timestamp: new Date(),
        message: "Starting fine-tuning job...",
        level: "info"
      };
      
      setTrainingLogs(prev => [...prev, initialLog]);
    }, 2000);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">Training Jobs</h2>
          <p className="text-muted-foreground">Manage and monitor your model fine-tuning jobs</p>
        </div>
        
        <Button onClick={() => setShowNewJobForm(true)}>
          <PlayCircle className="mr-2 h-4 w-4" />
          Start New Training
        </Button>
      </div>
      
      {showNewJobForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Start New Fine-Tuning Job</CardTitle>
            <CardDescription>Configure parameters for your model training</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Model</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="model-1">GPT-3.5 Turbo</SelectItem>
                            <SelectItem value="model-2">Claude Instant</SelectItem>
                            <SelectItem value="model-3">Llama 2 (7B)</SelectItem>
                            <SelectItem value="model-4">Mistral 7B</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dataset"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Dataset</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a dataset" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ds-1">Customer Support Conversations</SelectItem>
                            <SelectItem value="ds-2">Product Documentation</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="learningRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Learning Rate</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Recommended: 0.001-0.003
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="epochs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Epochs</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Recommended: 3-5
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="batchSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch Size</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Recommended: 8-32
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="validationSplit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Validation Split</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Recommended: 0.1-0.2
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowNewJobForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Start Training</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          <div className="lg:col-span-1 h-full overflow-auto">
            <div className="space-y-3">
              {trainingJobs.map(job => (
                <Card 
                  key={job.id} 
                  className={`cursor-pointer transition hover:shadow-md ${selectedJob === job.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedJob(job.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <CardTitle className="text-base">
                          {job.modelId === "model-1" ? "GPT-3.5 Turbo" : 
                           job.modelId === "model-2" ? "Claude Instant" : 
                           job.modelId === "model-3" ? "Llama 2 (7B)" : "Mistral 7B"}
                        </CardTitle>
                      </div>
                      <span className={`text-xs font-medium ${getStatusClass(job.status)} uppercase`}>
                        {job.status}
                      </span>
                    </div>
                    <CardDescription>
                      Dataset: {job.datasetId === "ds-1" ? "Customer Support Conversations" : 
                              job.datasetId === "ds-2" ? "Product Documentation" : 
                              "Sales Conversations"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {job.status === "running" && (
                      <>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      Created: {formatDate(job.createdAt)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2 h-full flex flex-col">
            {selectedJob ? (
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>
                        {selectedJob} Details
                      </CardTitle>
                      <CardDescription>
                        {trainingJobs.find(job => job.id === selectedJob)?.status === "completed" 
                          ? "Training completed successfully"
                          : trainingJobs.find(job => job.id === selectedJob)?.status === "failed"
                          ? "Training failed with errors"
                          : "View real-time training progress and logs"}
                      </CardDescription>
                    </div>
                    
                    {trainingJobs.find(job => job.id === selectedJob)?.status === "completed" && (
                      <Button onClick={() => handleDeployModel(selectedJob)}>
                        <Send className="mr-2 h-4 w-4" />
                        Deploy Model
                      </Button>
                    )}
                    
                    {trainingJobs.find(job => job.id === selectedJob)?.status === "running" && (
                      <Button variant="outline" className="text-red-500 hover:text-red-700">
                        Stop Training
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2 flex items-center">
                      <BarChart className="h-4 w-4 mr-1" />
                      Metrics
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {trainingJobs.find(job => job.id === selectedJob)?.metrics ? (
                        <>
                          <Card className="p-3">
                            <div className="text-xs text-muted-foreground">Loss</div>
                            <div className="text-lg font-semibold">
                              {trainingJobs.find(job => job.id === selectedJob)?.metrics?.loss?.toFixed(4)}
                            </div>
                          </Card>
                          
                          <Card className="p-3">
                            <div className="text-xs text-muted-foreground">Accuracy</div>
                            <div className="text-lg font-semibold">
                              {trainingJobs.find(job => job.id === selectedJob)?.metrics?.accuracy?.toFixed(4)}
                            </div>
                          </Card>
                          
                          <Card className="p-3">
                            <div className="text-xs text-muted-foreground">Epochs</div>
                            <div className="text-lg font-semibold">
                              {trainingJobs.find(job => job.id === selectedJob)?.parameters.epochs}
                            </div>
                          </Card>
                          
                          <Card className="p-3">
                            <div className="text-xs text-muted-foreground">Learning Rate</div>
                            <div className="text-lg font-semibold">
                              {trainingJobs.find(job => job.id === selectedJob)?.parameters.learningRate}
                            </div>
                          </Card>
                        </>
                      ) : (
                        <>
                          <Card className="p-3">
                            <div className="text-xs text-muted-foreground">Learning Rate</div>
                            <div className="text-lg font-semibold">
                              {trainingJobs.find(job => job.id === selectedJob)?.parameters.learningRate}
                            </div>
                          </Card>
                          
                          <Card className="p-3">
                            <div className="text-xs text-muted-foreground">Epochs</div>
                            <div className="text-lg font-semibold">
                              {trainingJobs.find(job => job.id === selectedJob)?.parameters.epochs}
                            </div>
                          </Card>
                          
                          <Card className="p-3">
                            <div className="text-xs text-muted-foreground">Batch Size</div>
                            <div className="text-lg font-semibold">
                              {trainingJobs.find(job => job.id === selectedJob)?.parameters.batchSize}
                            </div>
                          </Card>
                          
                          <Card className="p-3">
                            <div className="text-xs text-muted-foreground">Validation Split</div>
                            <div className="text-lg font-semibold">
                              {trainingJobs.find(job => job.id === selectedJob)?.parameters.validationSplit}
                            </div>
                          </Card>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-hidden flex flex-col">
                    <h4 className="text-sm font-semibold mb-2">Training Logs</h4>
                    <div className="flex-1 overflow-y-auto bg-secondary/50 rounded p-2 font-mono text-xs">
                      {trainingLogs
                        .filter(log => log.jobId === selectedJob)
                        .map(log => (
                          <div key={log.id} className="mb-1">
                            <span className="text-muted-foreground">[{formatLogTime(log.timestamp)}]</span>{" "}
                            <span className={log.level === "error" ? "text-red-500" : log.level === "warning" ? "text-amber-500" : ""}>{log.message}</span>
                          </div>
                        ))
                      }
                      
                      {trainingLogs.filter(log => log.jobId === selectedJob).length === 0 && (
                        <div className="text-muted-foreground italic">No logs available for this job</div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Textarea 
                    placeholder="Send instructions or commands to the training job..."
                    className="text-sm"
                    disabled={trainingJobs.find(job => job.id === selectedJob)?.status !== "running"}
                  />
                </CardFooter>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-border rounded-lg p-8">
                <div className="text-center">
                  <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No job selected</h3>
                  <p className="text-muted-foreground mb-4">
                    Select a training job from the list or start a new fine-tuning job
                  </p>
                  <Button onClick={() => setShowNewJobForm(true)}>
                    Start New Training
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FineTuningJobs;
