
import { useState } from "react";
import { 
  Send, 
  Bot, 
  RotateCw, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Clipboard
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
  
  const handleSubmit = () => {
    if (!input.trim()) return;
    
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
          setResult("Background task completed successfully! Here are the results of the analysis performed by the agent.");
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
        <CardContent>
          <div className="space-y-3">
            <Textarea
              placeholder="Enter your request for the background agent..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={5}
              disabled={status === "processing"}
              className="resize-none"
            />
            
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
          </div>
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
            disabled={!input.trim() || status === "processing"}
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
