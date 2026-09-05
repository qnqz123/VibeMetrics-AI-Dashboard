/**
 * =========================================================================
 * VIBEMETRICS — PRODUCTION FULL-STACK SAAS DASHBOARD
 * =========================================================================
 * 1. 3D & Trendy UI: Three.js low-poly interactive floating terrain with mouse reactivity
 * 2. Backend & Database: Supabase / Serverless auth & user-specific metrics
 * 3. Complex AI Chatbot: Rule-based router ("API keys", "Pricing", "Database sync") & delay wheel
 * 4. CRUD Task Logger: Add, Edit, Delete tasks with instant data synchronization
 * 5. Ready to Deploy: Clean config extraction in src/config.ts for 1-click hosting
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TerrainBackground } from './components/TerrainBackground';
import { Navbar } from './components/Navbar';
import { MetricsOverview } from './components/MetricsOverview';
import { TaskLoggerGrid } from './components/TaskLoggerGrid';
import { AIChatbotWidget } from './components/AIChatbotWidget';
import { AuthModal } from './components/AuthModal';
import { ConfigModal } from './components/ConfigModal';
import { AuthUser, TaskRecord, UserMetrics } from './types';
import { 
  getCurrentUser, 
  logoutUser, 
  fetchUserMetrics, 
  fetchTasks, 
  loginAsDemo 
} from './services/db';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load user data & metrics
  const loadUserData = useCallback(async (activeUser: AuthUser) => {
    try {
      const [userMetrics, userTasks] = await Promise.all([
        fetchUserMetrics(activeUser.id, activeUser.email),
        fetchTasks(activeUser.id),
      ]);
      setMetrics(userMetrics);
      setTasks(userTasks);
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  }, []);

  // Initialize session
  useEffect(() => {
    async function initAuth() {
      try {
        const existing = await getCurrentUser();
        if (existing) {
          setUser(existing);
          await loadUserData(existing);
        } else {
          // Default to demo session so preview works instantly out of the box,
          // while still allowing the user to sign out and sign in with their own email/password!
          const demo = await loginAsDemo();
          setUser(demo);
          await loadUserData(demo);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, [loadUserData]);

  // Refresh metrics from DB
  const handleRefreshMetrics = async () => {
    if (!user) return;
    setIsRefreshing(true);
    try {
      const freshMetrics = await fetchUserMetrics(user.id, user.email);
      setMetrics(freshMetrics);
      showToast('Telemetry metrics synced with live database');
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setMetrics(null);
    setTasks([]);
  };

  // Login / Signup success
  const handleAuthSuccess = async (authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
    setIsLoading(true);
    await loadUserData(authenticatedUser);
    setIsLoading(false);
    showToast(`Authenticated as ${authenticatedUser.email}`);
  };

  // Handle tasks updated in Task Logger
  const handleTasksUpdated = (updatedTasks: TaskRecord[]) => {
    setTasks(updatedTasks);
    // Also re-fetch metrics as tokens might have been consumed
    if (user) {
      fetchUserMetrics(user.id, user.email).then(setMetrics);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. 3D Floating Low-Poly Terrain Background */}
      <TerrainBackground />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-cyan-500/40 text-xs font-mono text-cyan-200 shadow-2xl backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Authentication Modal if not logged in */}
      {!user && !isLoading && (
        <AuthModal onSuccess={handleAuthSuccess} />
      )}

      {/* Main App Layout */}
      {user && (
        <>
          {/* Top Navbar */}
          <Navbar
            user={user}
            onLogout={handleLogout}
            onOpenConfig={() => setIsConfigOpen(true)}
          />

          {/* Main Container */}
          <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8">
            {/* Top Metrics Section */}
            {metrics ? (
              <MetricsOverview
                metrics={metrics}
                onRefresh={handleRefreshMetrics}
                isRefreshing={isRefreshing}
              />
            ) : (
              <div className="glass-panel p-8 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-mono">
                Loading telemetry data stream...
              </div>
            )}

            {/* Task Logger Grid (CRUD Operations) */}
            <TaskLoggerGrid
              userId={user.id}
              tasks={tasks}
              onTasksUpdated={handleTasksUpdated}
              onTaskAddedFeedback={() => showToast('Task successfully saved to database collection!')}
            />

            {/* Footer Information */}
            <footer className="pt-6 pb-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>VibeMetrics v2.4 Pro • Low-Poly 3D Engine Active</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsConfigOpen(true)}
                  className="hover:text-cyan-400 transition-colors"
                >
                  GitHub Deployment Config
                </button>
                <span>•</span>
                <span>Serverless CDC WebSockets</span>
              </div>
            </footer>
          </main>

          {/* Floating AI Chatbot Widget */}
          <AIChatbotWidget userId={user.id} />

          {/* Configuration & Credentials Modal */}
          <ConfigModal
            isOpen={isConfigOpen}
            onClose={() => setIsConfigOpen(false)}
            onConfigSaved={() => {
              showToast('Database configuration applied');
              if (user) loadUserData(user);
            }}
          />
        </>
      )}
    </div>
  );
}
