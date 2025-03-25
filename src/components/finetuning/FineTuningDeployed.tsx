
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  Search, 
  Server, 
  Trash2, 
  BarChart, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  RefreshCw,
  Users
} from "lucide-react";

// Sample deployed models data
const initialDeployedModels = [
  {
    id: "dm001",
    name: "Customer Service Assistant",
    baseModel: "gpt-3.5-turbo",
    fineTunedOn: "2024-02-15",
    deployedOn: "2024-02-20",
    status: "active",
    usageCount: 4528,
    responseTimeMs: 240,
    assignedClients: ["Client A", "Client B", "Client C"],
    description: "Fine-tuned for handling customer service queries with product knowledge"
  },
  {
    id: "dm002",
    name: "Legal Document Analyzer",
    baseModel: "gpt-4",
    fineTunedOn: "2024-01-10",
    deployedOn: "2024-01-15",
    status: "inactive",
    usageCount: 876,
    responseTimeMs: 450,
    assignedClients: ["Client D"],
    description: "Specialized in analyzing legal documents and contracts"
  },
  {
    id: "dm003",
    name: "Sales Call Assistant",
    baseModel: "claude-3-opus",
    fineTunedOn: "2024-03-01",
    deployedOn: "2024-03-05",
    status: "active",
    usageCount: 2134,
    responseTimeMs: 320,
    assignedClients: ["Client B", "Client E"],
    description: "Assists sales representatives during calls with product information and competitive analysis"
  },
  {
    id: "dm004",
    name: "Technical Support Bot",
    baseModel: "gpt-4",
    fineTunedOn: "2024-02-20",
    deployedOn: "2024-02-25",
    status: "active",
    usageCount: 3298,
    responseTimeMs: 380,
    assignedClients: ["Client A", "Client F"],
    description: "Handles technical support queries for software products"
  },
  {
    id: "dm005",
    name: "Financial Advisor",
    baseModel: "claude-3-opus",
    fineTunedOn: "2024-01-25",
    deployedOn: "2024-02-01",
    status: "inactive",
    usageCount: 542,
    responseTimeMs: 400,
    assignedClients: [],
    description: "Provides financial advice and analysis based on market trends"
  }
];

const FineTuningDeployed = () => {
  const [deployedModels, setDeployedModels] = useState(initialDeployedModels);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [expandedModelId, setExpandedModelId] = useState<string | null>(null);
  
  const handleModelToggle = (modelId: string, newStatus: boolean) => {
    setDeployedModels(models => 
      models.map(model => 
        model.id === modelId ? 
          { ...model, status: newStatus ? "active" : "inactive" } : 
          model
      )
    );
    
    const model = deployedModels.find(m => m.id === modelId);
    toast.success(`${model?.name} ${newStatus ? "activated" : "deactivated"} successfully`);
  };
  
  const handleDeleteModel = (modelId: string) => {
    setDeployedModels(models => models.filter(model => model.id !== modelId));
    toast.success("Model removed from deployment successfully");
  };
  
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    
    return sortConfig.direction === "ascending" ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };
  
  const toggleModelDetails = (modelId: string) => {
    setExpandedModelId(expandedModelId === modelId ? null : modelId);
  };
  
  // Filter and sort the models
  const filteredAndSortedModels = [...deployedModels]
    .filter(model => 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.baseModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.assignedClients.some(client => 
        client.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (!sortConfig) return 0;
      
      const key = sortConfig.key as keyof typeof a;
      
      if (a[key] < b[key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Deployed Models</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deployed models..."
              className="pl-8 w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Deployment Management</CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer w-[250px]" onClick={() => requestSort("name")}>
                  <div className="flex items-center gap-2">
                    Model Name
                    {getSortIndicator("name")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort("baseModel")}>
                  <div className="flex items-center gap-2">
                    Base Model
                    {getSortIndicator("baseModel")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort("deployedOn")}>
                  <div className="flex items-center gap-2">
                    Deployed On
                    {getSortIndicator("deployedOn")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort("usageCount")}>
                  <div className="flex items-center gap-2">
                    Usage
                    {getSortIndicator("usageCount")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => requestSort("responseTimeMs")}>
                  <div className="flex items-center gap-2">
                    Response Time
                    {getSortIndicator("responseTimeMs")}
                  </div>
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedModels.length > 0 ? (
                filteredAndSortedModels.map((model) => (
                  <>
                    <TableRow key={model.id} className="cursor-pointer hover:bg-accent/50" onClick={() => toggleModelDetails(model.id)}>
                      <TableCell className="font-medium">{model.name}</TableCell>
                      <TableCell>{model.baseModel}</TableCell>
                      <TableCell>{model.deployedOn}</TableCell>
                      <TableCell>{model.usageCount.toLocaleString()}</TableCell>
                      <TableCell>{model.responseTimeMs}ms</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                          <Switch
                            checked={model.status === "active"}
                            onCheckedChange={(checked) => handleModelToggle(model.id, checked)}
                            aria-label="Toggle model status"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <BarChart className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Deployed Model</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {model.name} from deployment? This won't delete the fine-tuned model itself, just its deployment.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteModel(model.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {expandedModelId === model.id && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-accent/30 p-4">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-1">Description</h4>
                              <p className="text-sm text-muted-foreground">{model.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <h4 className="font-medium mb-1 flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  Fine-Tuned On
                                </h4>
                                <p className="text-sm">{model.fineTunedOn}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-1 flex items-center gap-2">
                                  <Server className="h-4 w-4 text-muted-foreground" />
                                  Deployment Status
                                </h4>
                                <Badge variant={model.status === "active" ? "default" : "secondary"}>
                                  {model.status === "active" ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-1 flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  Assigned Clients
                                </h4>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {model.assignedClients.length > 0 ? (
                                    model.assignedClients.map((client, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {client}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-sm text-muted-foreground">None assigned</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-4">
                              <Button size="sm">View Usage Analytics</Button>
                              <Button size="sm" variant="outline">Edit Deployment</Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <Server className="h-10 w-10 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No deployed models found matching your search</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setSearchTerm("")}
                      >
                        Clear search
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6">
          <div className="text-sm text-muted-foreground">
            Showing {filteredAndSortedModels.length} of {deployedModels.length} deployed models
          </div>
          <Button>
            Deploy New Model
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FineTuningDeployed;
