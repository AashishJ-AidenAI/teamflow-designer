
import { useState } from "react";
import { 
  Send, 
  Bot, 
  RotateCw, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Clipboard,
  Upload,
  FileText,
  Database,
  Search
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "sonner";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export type BackgroundAgentType = "text" | "file" | "data" | "search";

interface BackgroundAgentProps {
  agentName: string;
  agentType: string;
}

type Status = "idle" | "processing" | "completed" | "error";

const BackgroundAgent: React.FC<BackgroundAgentProps> = ({ agentName, agentType }) => {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState("");
  const [submitTime, setSubmitTime] = useState<Date | null>(null);
  const [completeTime, setCompleteTime] = useState<Date | null>(null);
  const [taskType, setTaskType] = useState<BackgroundAgentType>("text");
  const [file, setFile] = useState<File | null>(null);
  
  const handleSubmit = () => {
    if (taskType === "text" && !input.trim()) return;
    if (taskType === "file" && !file) return;
    
    setStatus("processing");
    setProgress(0);
    setSubmitTime(new Date());
    setCompleteTime(null);
    
    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setStatus("completed");
          setProgress(100);
          
          // Generate different results based on task type
          let resultText = "";
          
          switch (taskType) {
            case "text":
              resultText = `Text processing completed! Analysis of your input: "${input.substring(0, 50)}${input.length > 50 ? '...' : ''}"`;
              break;
            case "file":
              resultText = `File processing completed! Analyzed file: ${file?.name} (${formatFileSize(file?.size || 0)})`;
              break;
            case "data":
              resultText = "Data extraction completed! Retrieved 15 records from the database matching your criteria.";
              break;
            case "search":
              resultText = `Search completed! Found 27 results matching "${input.substring(0, 30)}${input.length > 30 ? '...' : ''}"`;
              break;
          }
          
          setResult(resultText);
          setCompleteTime(new Date());
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };
  
  const resetForm = () => {
    setInput("");
    setStatus("idle");
    setProgress(0);
    setResult("");
    setSubmitTime(null);
    setCompleteTime(null);
    setFile(null);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success("Result copied to clipboard");
  };
  
  const formatTime = (date: Date | null) => {
    if (!date) return "--:--";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case "idle":
        return <Clock className="h-5 w-5" />;
      case "processing":
        return <RotateCw className="h-5 w-5 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case "idle":
        return "Ready to process";
      case "processing":
        return "Processing request...";
      case "completed":
        return "Task completed";
      case "error":
        return "Error occurred";
    }
  };

  const getTaskTypeIcon = () => {
    switch (taskType) {
      case "text":
        return <FileText className="h-5 w-5" />;
      case "file":
        return <Upload className="h-5 w-5" />;
      case "data":
        return <Database className="h-5 w-5" />;
      case "search":
        return <Search className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="flex flex-col h-full space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>{agentName}</CardTitle>
                <CardDescription>{agentType}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">{getStatusText()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              {getTaskTypeIcon()}
            </div>
            <Select
              value={taskType}
              onValueChange={(value) => {
                setTaskType(value as BackgroundAgentType);
                resetForm();
              }}
              disabled={status === "processing"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Processing</SelectItem>
                <SelectItem value="file">File Analysis</SelectItem>
                <SelectItem value="data">Data Extraction</SelectItem>
                <SelectItem value="search">Search Task</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {taskType === "text" && (
            <Textarea
              placeholder="Enter your request for the background agent..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={5}
              disabled={status === "processing"}
              className="resize-none"
            />
          )}
          
          {taskType === "file" && (
            <div className="space-y-2">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/40 hover:bg-secondary/60 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-1 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Document, image, or CSV (MAX. 10MB)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={status === "processing"}
                  />
                </label>
              </div>
              
              {file && (
                <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-md">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                </div>
              )}
            </div>
          )}
          
          {taskType === "data" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Data Source</label>
                  <Select defaultValue="customer">
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer Database</SelectItem>
                      <SelectItem value="product">Product Catalog</SelectItem>
                      <SelectItem value="order">Order History</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Record Limit</label>
                  <Input type="number" placeholder="100" min="1" max="1000" defaultValue="100" />
                </div>
              </div>
              <Textarea
                placeholder="Enter SQL-like query or filters..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
                disabled={status === "processing"}
                className="resize-none font-mono text-sm"
              />
            </div>
          )}
          
          {taskType === "search" && (
            <div className="space-y-3">
              <Input
                placeholder="Enter search query..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={status === "processing"}
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Search In</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="docs">Documentation</SelectItem>
                      <SelectItem value="kb">Knowledge Base</SelectItem>
                      <SelectItem value="web">Web Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Sort By</label>
                  <Select defaultValue="relevance">
                    <SelectTrigger>
                      <SelectValue placeholder="Sort results" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="date">Date (Newest)</SelectItem>
                      <SelectItem value="popularity">Popularity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          
          {status !== "idle" && (
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div className="text-muted-foreground">Submitted:</div>
                <div>{formatTime(submitTime)}</div>
                
                <div className="text-muted-foreground">Completed:</div>
                <div>{formatTime(completeTime)}</div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={resetForm}
            disabled={status === "processing"}
          >
            Reset
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={(taskType === "text" && !input.trim()) || 
                     (taskType === "file" && !file) || 
                     (taskType === "data" && !input.trim()) || 
                     (taskType === "search" && !input.trim()) || 
                     status === "processing"}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit
          </Button>
        </CardFooter>
      </Card>
      
      {status === "completed" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Result</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={copyToClipboard}>
                    Copy to clipboard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-secondary rounded-md whitespace-pre-wrap">
              {result}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BackgroundAgent;
