import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { VIBEMETRICS_CONFIG } from '../config';
import { AuthUser, TaskRecord, UserMetrics, ChatMessage, TaskCategory, TaskPriority, TaskStatus } from '../types';

const STORAGE_KEY_AUTH = 'vibemetrics_auth_session';
const STORAGE_KEY_TASKS = 'vibemetrics_tasks_data';
const STORAGE_KEY_METRICS = 'vibemetrics_metrics_data';
const STORAGE_KEY_CHAT = 'vibemetrics_chat_history';
const STORAGE_KEY_CUSTOM_CONFIG = 'vibemetrics_custom_supabase_config';

// Retrieve configured or dynamically updated Supabase credentials
export function getActiveSupabaseConfig() {
  const savedCustom = localStorage.getItem(STORAGE_KEY_CUSTOM_CONFIG);
  if (savedCustom) {
    try {
      const parsed = JSON.parse(savedCustom);
      if (parsed.supabaseUrl && parsed.supabaseAnonKey) {
        return {
          supabaseUrl: parsed.supabaseUrl,
          supabaseAnonKey: parsed.supabaseAnonKey,
          isCustom: true
        };
      }
    } catch {
      // ignore
    }
  }
  return {
    supabaseUrl: VIBEMETRICS_CONFIG.supabaseUrl,
    supabaseAnonKey: VIBEMETRICS_CONFIG.supabaseAnonKey,
    isCustom: false
  };
}

export function saveCustomSupabaseConfig(url: string, key: string) {
  localStorage.setItem(STORAGE_KEY_CUSTOM_CONFIG, JSON.stringify({
    supabaseUrl: url.trim(),
    supabaseAnonKey: key.trim(),
  }));
  // Reset client
  cachedClient = null;
}

export function clearCustomSupabaseConfig() {
  localStorage.removeItem(STORAGE_KEY_CUSTOM_CONFIG);
  cachedClient = null;
}

// Initialize Supabase Client
let cachedClient: SupabaseClient | null = null;
export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const { supabaseUrl, supabaseAnonKey } = getActiveSupabaseConfig();
  const isDefaultPlaceholder =
    !supabaseUrl ||
    supabaseUrl.includes('your-project-id') ||
    !supabaseAnonKey ||
    supabaseAnonKey.includes('your-anon-token-here');

  if (isDefaultPlaceholder) {
    return null;
  }

  try {
    // Check if CDN window.supabase is available, or use imported createClient
    const factory = (window as any).supabase?.createClient || createClient;
    cachedClient = factory(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
    return cachedClient;
  } catch (err) {
    console.warn('[VibeMetrics DB] Failed to initialize Supabase client:', err);
    return null;
  }
}

// Check database status
export function getDatabaseStatus(): {
  mode: 'supabase-live' | 'local-fallback';
  url: string;
  isConfigured: boolean;
} {
  const { supabaseUrl } = getActiveSupabaseConfig();
  const client = getSupabaseClient();
  if (client) {
    return {
      mode: 'supabase-live',
      url: supabaseUrl,
      isConfigured: true,
    };
  }
  return {
    mode: 'local-fallback',
    url: 'Browser Storage + Virtual Serverless Engine',
    isConfigured: false,
  };
}

// Initial mock tasks generator
function getInitialTasks(userId: string): TaskRecord[] {
  return [
    {
      id: 'task-101',
      userId,
      title: 'Llama-3-70B LoRA Fine-Tuning on Financial Corpus',
      category: 'Model Fine-tuning',
      priority: 'High',
      status: 'In Progress',
      tokensConsumed: 482000,
      cost: 14.46,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'task-102',
      userId,
      title: 'PgVector Hybrid Semantic Indexing (dim=1536)',
      category: 'Vector Indexing',
      priority: 'Medium',
      status: 'Completed',
      tokensConsumed: 125000,
      cost: 3.75,
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'task-103',
      userId,
      title: 'Prompt Injection Security Firewall Audit',
      category: 'API Audit',
      priority: 'Critical',
      status: 'Pending',
      tokensConsumed: 62000,
      cost: 1.86,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'task-104',
      userId,
      title: 'KV-Cache & Speculative Decoding Latency Optimization',
      category: 'Latency Optimization',
      priority: 'High',
      status: 'Completed',
      tokensConsumed: 310000,
      cost: 9.30,
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    }
  ];
}

// Initial mock metrics generator
function getInitialMetrics(userId: string, email: string): UserMetrics {
  return {
    userId,
    userEmail: email,
    totalTokens: 1482900,
    requestsPerMinute: 3420,
    avgLatencyMs: 138,
    activePipelines: 12,
    costBalance: 44.40,
    creditsRemaining: 455.60,
    errorRatePercent: 0.04,
    lastSyncedAt: new Date().toISOString(),
    dailyUsage: [
      { time: '00:00', tokens: 42000, requests: 380, latency: 145 },
      { time: '04:00', tokens: 28000, requests: 210, latency: 132 },
      { time: '08:00', tokens: 195000, requests: 1420, latency: 156 },
      { time: '12:00', tokens: 430000, requests: 3100, latency: 162 },
      { time: '16:00', tokens: 520000, requests: 3950, latency: 140 },
      { time: '20:00', tokens: 267900, requests: 2100, latency: 138 },
    ],
  };
}

// Initial Chat History
function getInitialChatMessages(): ChatMessage[] {
  return [
    {
      id: 'msg-init-1',
      sender: 'system',
      text: 'VibeMetrics Neural Assistant online. Ready to answer questions on API Keys, SaaS Pricing, Database Sync, and pipeline optimizations.',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      category: 'general',
    },
    {
      id: 'msg-init-2',
      sender: 'assistant',
      text: 'Welcome to VibeMetrics! How can I assist your AI infrastructure today? Try clicking one of the quick prompts below or type your inquiry.',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      category: 'general',
    }
  ];
}

/* =========================================================================
   AUTHENTICATION APIS
   ========================================================================= */

export async function getCurrentUser(): Promise<AuthUser | null> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data: { session } } = await client.auth.getSession();
      if (session?.user) {
        return {
          id: session.user.id,
          email: session.user.email || 'user@vibemetrics.ai',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'AI Engineer',
          role: 'Architect',
          createdAt: session.user.created_at,
        };
      }
    } catch (e) {
      console.warn('[VibeMetrics Auth] Supabase getSession error:', e);
    }
  }

  // Fallback to local session
  const stored = localStorage.getItem(STORAGE_KEY_AUTH);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    if (data.user) {
      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.full_name || email.split('@')[0],
        role: 'Architect',
        createdAt: data.user.created_at,
      };
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
      return user;
    }
  }

  // Local authentication simulation with realistic delay
  await new Promise((r) => setTimeout(r, 450));
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const user: AuthUser = {
    id: 'user_' + btoa(email.toLowerCase()).slice(0, 12),
    email,
    name: email.split('@')[0].replace(/[._-]/g, ' '),
    role: 'Lead AI Engineer',
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
  return user;
}

export async function signupUser(email: string, password: string, name?: string): Promise<AuthUser> {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name || email.split('@')[0] }
      }
    });
    if (error) throw new Error(error.message);
    if (data.user) {
      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email || email,
        name: name || data.user.user_metadata?.full_name || email.split('@')[0],
        role: 'Pro Member',
        createdAt: data.user.created_at,
      };
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
      return user;
    }
  }

  // Local sign-up simulation
  await new Promise((r) => setTimeout(r, 550));
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const user: AuthUser = {
    id: 'user_' + Math.random().toString(36).substring(2, 9),
    email,
    name: name || email.split('@')[0],
    role: 'Pro Member',
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
  return user;
}

export async function loginAsDemo(): Promise<AuthUser> {
  await new Promise((r) => setTimeout(r, 300));
  const demoUser: AuthUser = {
    id: 'vm_demo_882190',
    email: 'demo.engineer@vibemetrics.ai',
    name: 'Alex Vance',
    role: 'Staff ML Systems Architect',
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
  };
  localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(demoUser));
  return demoUser;
}

export async function logoutUser(): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn('[VibeMetrics Auth] Supabase logout warning:', e);
    }
  }
  localStorage.removeItem(STORAGE_KEY_AUTH);
}

/* =========================================================================
   USER METRICS APIS
   ========================================================================= */

export async function fetchUserMetrics(userId: string, email: string): Promise<UserMetrics> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('user_metrics')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (!error && data) {
        return {
          userId: data.user_id,
          userEmail: email,
          totalTokens: data.total_tokens || 1482900,
          requestsPerMinute: data.requests_per_minute || 3420,
          avgLatencyMs: data.avg_latency_ms || 138,
          activePipelines: data.active_pipelines || 12,
          costBalance: data.cost_balance || 44.40,
          creditsRemaining: data.credits_remaining || 455.60,
          errorRatePercent: data.error_rate_percent || 0.04,
          lastSyncedAt: new Date().toISOString(),
          dailyUsage: data.daily_usage || getInitialMetrics(userId, email).dailyUsage,
        };
      }
    } catch (e) {
      console.warn('[VibeMetrics DB] Supabase fetchUserMetrics fallback:', e);
    }
  }

  // Fallback to local storage or generated baseline
  const stored = localStorage.getItem(`${STORAGE_KEY_METRICS}_${userId}`);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      parsed.lastSyncedAt = new Date().toISOString();
      return parsed;
    } catch {
      // ignore
    }
  }

  const initial = getInitialMetrics(userId, email);
  localStorage.setItem(`${STORAGE_KEY_METRICS}_${userId}`, JSON.stringify(initial));
  return initial;
}

/* =========================================================================
   CRUD TASK LOGGER APIS
   ========================================================================= */

export async function fetchTasks(userId: string): Promise<TaskRecord[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          title: d.title,
          category: d.category,
          priority: d.priority,
          status: d.status,
          tokensConsumed: d.tokens_consumed || 0,
          cost: d.cost || 0,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch (e) {
      console.warn('[VibeMetrics DB] Supabase fetchTasks fallback:', e);
    }
  }

  // Fallback to local storage
  const stored = localStorage.getItem(`${STORAGE_KEY_TASKS}_${userId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  const initial = getInitialTasks(userId);
  localStorage.setItem(`${STORAGE_KEY_TASKS}_${userId}`, JSON.stringify(initial));
  return initial;
}

export async function createTask(
  userId: string,
  data: {
    title: string;
    category: TaskCategory;
    priority: TaskPriority;
    status?: TaskStatus;
  }
): Promise<TaskRecord> {
  const estimatedTokens = Math.floor(Math.random() * 450000) + 50000;
  const cost = parseFloat(((estimatedTokens / 1000000) * 30).toFixed(2));

  const newTask: TaskRecord = {
    id: 'task-' + Math.random().toString(36).substring(2, 8),
    userId,
    title: data.title,
    category: data.category,
    priority: data.priority,
    status: data.status || 'Pending',
    tokensConsumed: estimatedTokens,
    cost,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('tasks').insert([
        {
          id: newTask.id,
          user_id: userId,
          title: newTask.title,
          category: newTask.category,
          priority: newTask.priority,
          status: newTask.status,
          tokens_consumed: newTask.tokensConsumed,
          cost: newTask.cost,
          created_at: newTask.createdAt,
          updated_at: newTask.updatedAt,
        }
      ]);
      if (error) console.warn('[VibeMetrics DB] Supabase insert warning:', error);
    } catch (e) {
      console.warn('[VibeMetrics DB] Supabase insert task error:', e);
    }
  }

  // Update local store
  const existing = await fetchTasks(userId);
  const updated = [newTask, ...existing];
  localStorage.setItem(`${STORAGE_KEY_TASKS}_${userId}`, JSON.stringify(updated));

  // Increment metrics
  updateMetricsTokens(userId, estimatedTokens, cost);

  return newTask;
}

export async function updateTask(
  userId: string,
  taskId: string,
  updates: Partial<Omit<TaskRecord, 'id' | 'userId' | 'createdAt'>>
): Promise<TaskRecord> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.status !== undefined) dbUpdates.status = updates.status;

      const { error } = await client
        .from('tasks')
        .update(dbUpdates)
        .eq('id', taskId)
        .eq('user_id', userId);
      if (error) console.warn('[VibeMetrics DB] Supabase update warning:', error);
    } catch (e) {
      console.warn('[VibeMetrics DB] Supabase update task error:', e);
    }
  }

  const existing = await fetchTasks(userId);
  let updatedTask: TaskRecord | null = null;
  const newTasks = existing.map(task => {
    if (task.id === taskId) {
      updatedTask = {
        ...task,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return updatedTask;
    }
    return task;
  });

  if (!updatedTask) throw new Error('Task not found');
  localStorage.setItem(`${STORAGE_KEY_TASKS}_${userId}`, JSON.stringify(newTasks));
  return updatedTask;
}

export async function deleteTask(userId: string, taskId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId);
      if (error) console.warn('[VibeMetrics DB] Supabase delete warning:', error);
    } catch (e) {
      console.warn('[VibeMetrics DB] Supabase delete task error:', e);
    }
  }

  const existing = await fetchTasks(userId);
  const filtered = existing.filter(t => t.id !== taskId);
  localStorage.setItem(`${STORAGE_KEY_TASKS}_${userId}`, JSON.stringify(filtered));
  return true;
}

function updateMetricsTokens(userId: string, tokens: number, cost: number) {
  const stored = localStorage.getItem(`${STORAGE_KEY_METRICS}_${userId}`);
  if (stored) {
    try {
      const metrics: UserMetrics = JSON.parse(stored);
      metrics.totalTokens += tokens;
      metrics.costBalance = parseFloat((metrics.costBalance + cost).toFixed(2));
      metrics.creditsRemaining = Math.max(0, parseFloat((metrics.creditsRemaining - cost).toFixed(2)));
      metrics.lastSyncedAt = new Date().toISOString();
      localStorage.setItem(`${STORAGE_KEY_METRICS}_${userId}`, JSON.stringify(metrics));
    } catch {
      // ignore
    }
  }
}

/* =========================================================================
   AI CHATBOT HISTORY APIS
   ========================================================================= */

export async function fetchChatHistory(userId: string): Promise<ChatMessage[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true })
        .limit(VIBEMETRICS_CONFIG.maxChatHistory);
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          sender: d.sender,
          text: d.text,
          timestamp: d.timestamp,
          category: d.category,
          tokensUsed: d.tokens_used,
          latencyMs: d.latency_ms,
        }));
      }
    } catch (e) {
      console.warn('[VibeMetrics DB] Supabase fetchChatHistory fallback:', e);
    }
  }

  const stored = localStorage.getItem(`${STORAGE_KEY_CHAT}_${userId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  const initial = getInitialChatMessages();
  localStorage.setItem(`${STORAGE_KEY_CHAT}_${userId}`, JSON.stringify(initial));
  return initial;
}

export async function saveChatMessage(userId: string, message: ChatMessage): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('chat_history').insert([
        {
          id: message.id,
          user_id: userId,
          sender: message.sender,
          text: message.text,
          timestamp: message.timestamp,
          category: message.category,
          tokens_used: message.tokensUsed,
          latency_ms: message.latencyMs,
        }
      ]);
    } catch (e) {
      console.warn('[VibeMetrics DB] Supabase saveChatMessage fallback:', e);
    }
  }

  const existing = await fetchChatHistory(userId);
  const updated = [...existing, message].slice(-VIBEMETRICS_CONFIG.maxChatHistory);
  localStorage.setItem(`${STORAGE_KEY_CHAT}_${userId}`, JSON.stringify(updated));
}

export async function clearChatHistory(userId: string): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('chat_history').delete().eq('user_id', userId);
    } catch (e) {
      // ignore
    }
  }
  const reset = getInitialChatMessages();
  localStorage.setItem(`${STORAGE_KEY_CHAT}_${userId}`, JSON.stringify(reset));
}
