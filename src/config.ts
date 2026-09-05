/**
 * =========================================================================
 * VIBEMETRICS PLATFORM CONFIGURATION
 * =========================================================================
 * Cleanly extracted deployment credentials for Supabase, API endpoints,
 * and SaaS parameters. Swap in your own Supabase credentials below or set
 * them via environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY).
 * 
 * Ready for 1-click GitHub hosting, Cloud Run, Vercel, or Netlify deployment!
 */

export const VIBEMETRICS_CONFIG = {
  // Supabase / Database Configuration (swap with your project keys)
  supabaseUrl: (import.meta as any).env?.VITE_SUPABASE_URL || "https://your-project-id.supabase.co",
  supabaseAnonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-token-here",
  
  // Platform Identifiers & Meta
  appName: "VibeMetrics",
  appTagline: "Next-Gen AI Observability & Operations Engine",
  version: "v2.4.0-pro",
  environment: "production",

  // Real-time Database Options
  enableMockFallback: true, // Seamless local DB persistence if live Supabase keys aren't configured yet
  syncIntervalMs: 5000,     // Real-time polling fallback sync interval (ms)
  
  // AI Chatbot Defaults
  defaultSimulationDelayMs: 650, // Simulated network/streaming delay
  maxChatHistory: 50,
  
  // SaaS Thresholds & Limits
  freeTierTokenLimit: 500000,
  proTierTokenLimit: 20000000,
} as const;

export type VibeMetricsConfig = typeof VIBEMETRICS_CONFIG;
