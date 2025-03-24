
import { useState } from "react";
import { 
  Upload, 
  FileUp, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Database 
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
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { DatasetFile } from "@/types/finetuning";
import { toast } from "sonner";

const FineTuningUpload = () => {
  const [datasets, setDatasets] = useState<DatasetFile[]>([
    {
      id: "ds-1",
      name: "Customer Support Conversations",
      size: 2560000,
      format: "JSONL",
      status: "ready",
      recordCount: 5249,
      createdAt: new Date("2023-09-15"),
      lastModified: new Date("2023-09-15")
    },
    {
      id: "ds-2",
      name: "Product Documentation",
      size: 4850000,
      format: "JSONL",
      status: "ready",
      recordCount: 1203,
      createdAt: new Date("2023-10-01"),
      lastModified: new Date("2023-10-01")
    },
    {
      id: "ds-3",
      name: "Sales Conversations",
      size: 3200000,
      format: "CSV",
      status: "processing",
      createdAt: new Date("2023-10-10"),
      lastModified: new Date("2023-10-10")
    }
  ]);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          
          // Add the uploaded file to datasets
          const newDataset: DatasetFile = {
            id: `ds-${datasets.length + 1}`,
            name: file.name,
            size: file.size,
            format: file.name.split('.').pop()?.toUpperCase() || "Unknown",
            status: "processing",
            createdAt: new Date(),
            lastModified: new Date()
          };
          
          setDatasets(prev => [...prev, newDataset]);
          
          // Simulate processing completion after 2 seconds
          setTimeout(() => {
            setDatasets(prev => 
              prev.map(ds => 
                ds.id === newDataset.id 
                  ? { 
                      ...ds, 
                      status: "ready", 
                      recordCount: Math.floor(Math.random() * 10000) + 500 
                    } 
                  : ds
              )
            );
            toast.success("Dataset processing completed", {
              description: `${file.name} is now ready for fine-tuning.`
            });
          }, 2000);
          
          return 0;
        }
        return prev + 5;
      });
    }, 200);
    
    return () => clearInterval(interval);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">Datasets</h2>
          <p className="text-muted-foreground">Upload and manage your training datasets</p>
        </div>
        
        <div className="relative">
          <Input
            type="file"
            id="fileUpload"
            className="hidden"
            onChange={handleUpload}
            accept=".csv,.jsonl,.json,.txt"
          />
          <Button 
            onClick={() => document.getElementById("fileUpload")?.click()}
            disabled={uploading}
          >
            <FileUp className="mr-2 h-4 w-4" />
            Upload Dataset
          </Button>
        </div>
      </div>
      
      {uploading && (
        <Card className="bg-accent/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Uploading dataset...</p>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </CardContent>
        </Card>
      )}
      
      {datasets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No datasets uploaded yet</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Upload your first dataset to start fine-tuning your AI models. Supported formats: CSV, JSONL, JSON, TXT
          </p>
          <Button 
            onClick={() => document.getElementById("fileUpload")?.click()}
            variant="outline"
          >
            <FileUp className="mr-2 h-4 w-4" />
            Browse Files
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {datasets.map(dataset => (
            <Card key={dataset.id} className="overflow-hidden">
              <CardHeader className="bg-accent/30 pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <FileText className="h-10 w-10 text-primary" />
                    <div>
                      <CardTitle className="text-base">{dataset.name}</CardTitle>
                      <CardDescription>
                        {formatFileSize(dataset.size)} • {dataset.format}
                      </CardDescription>
                    </div>
                  </div>
                  {dataset.status === "processing" ? (
                    <div className="flex items-center text-amber-500 text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Processing
                    </div>
                  ) : dataset.status === "ready" ? (
                    <div className="flex items-center text-green-500 text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Ready
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Error
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Uploaded on</span>
                    <span>{formatDate(dataset.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last modified</span>
                    <span>{formatDate(dataset.lastModified)}</span>
                  </div>
                  {dataset.recordCount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Records</span>
                      <span>{dataset.recordCount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    disabled={dataset.status !== "ready"}
                  >
                    Preview
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1"
                    disabled={dataset.status !== "ready"}
                  >
                    Use Dataset
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FineTuningUpload;
