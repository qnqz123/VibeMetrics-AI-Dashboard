export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Failed';
export type TaskCategory = 'Model Fine-tuning' | 'Vector Indexing' | 'API Audit' | 'Prompt Eval' | 'Latency Optimization';

export interface TaskRecord {
  id: string;
  userId: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  tokensConsumed: number;
  cost: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserMetrics {
  userId: string;
  userEmail: string;
  totalTokens: number;
  requestsPerMinute: number;
  avgLatencyMs: number;
  activePipelines: number;
  costBalance: number;
  creditsRemaining: number;
  errorRatePercent: number;
  lastSyncedAt: string;
  dailyUsage: Array<{
    time: string;
    tokens: number;
    requests: number;
    latency: number;
  }>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  category?: 'api_keys' | 'pricing' | 'database_sync' | 'general';
  tokensUsed?: number;
  latencyMs?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  createdAt: string;
}
