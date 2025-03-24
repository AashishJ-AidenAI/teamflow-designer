
export type ModelProvider = "openai" | "anthropic" | "meta" | "mistral" | "custom";

export type ModelSize = "small" | "medium" | "large";

export interface FineTuningModel {
  id: string;
  name: string;
  provider: ModelProvider;
  size: ModelSize;
  description: string;
  parameters: string;
  supportsTraining: boolean;
  requiredDataFormat: string;
  baseModel: string;
}

export interface DatasetFile {
  id: string;
  name: string;
  size: number;
  format: string;
  status: "processing" | "ready" | "error";
  recordCount?: number;
  createdAt: Date;
  lastModified: Date;
}

export interface TrainingJob {
  id: string;
  modelId: string;
  datasetId: string;
  status: "queued" | "running" | "completed" | "failed" | "canceled";
  progress: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  metrics?: {
    loss?: number;
    accuracy?: number;
    [key: string]: number | undefined;
  };
  parameters: TrainingParameters;
}

export interface TrainingParameters {
  learningRate: number;
  epochs: number;
  batchSize: number;
  validationSplit: number;
  earlyStoppingPatience?: number;
  customParameters?: Record<string, any>;
}

export interface TrainingLog {
  id: string;
  jobId: string;
  timestamp: Date;
  message: string;
  level: "info" | "warning" | "error";
  metadata?: Record<string, any>;
}

export interface DeployedModel {
  id: string;
  name: string;
  trainingJobId: string;
  deployedAt: Date;
  status: "deploying" | "active" | "inactive" | "failed";
  endpoint?: string;
  version: string;
}
