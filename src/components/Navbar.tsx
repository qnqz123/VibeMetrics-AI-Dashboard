import React from 'react';
import { 
  Sparkles, 
  Database, 
  Settings, 
  LogOut, 
  User, 
  ExternalLink,
  Shield,
  Activity
} from 'lucide-react';
import { AuthUser } from '../types';
import { getDatabaseStatus } from '../services/db';

interface NavbarProps {
  user: AuthUser;
  onLogout: () => void;
  onOpenConfig: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onOpenConfig,
}) => {
  const dbStatus = getDatabaseStatus();

  return (
    <header className="sticky top-0 z-30 w-full px-4 sm:px-8 py-3.5 glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/25 border border-cyan-300/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">
                Vibe<span className="text-cyan-400">Metrics</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                PRO ENGINE
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 font-sans">
              Full-Stack AI Observability & Serverless Telemetry
            </p>
          </div>
        </div>

        {/* Center/Right Status Badges & User Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live DB indicator */}
          <button
            onClick={onOpenConfig}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-mono transition-colors"
            title="Click to view or edit Supabase credentials"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                dbStatus.isConfigured ? 'bg-emerald-400' : 'bg-cyan-400'
              } animate-pulse`}
            />
            <span className="text-slate-300">
              {dbStatus.mode === 'supabase-live' ? 'Supabase Connected' : 'DB Engine Active'}
            </span>
          </button>

          {/* Config & Deploy Button */}
          <button
            id="open-config-modal-button"
            onClick={onOpenConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-colors"
            title="Deployment & Database Credentials"
          >
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Config & Deploy</span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold font-mono border border-purple-400/30 shadow-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-white tracking-wide leading-tight">
                {user.name || user.email.split('@')[0]}
              </div>
              <div className="text-[10px] font-mono text-cyan-400 leading-tight">
                {user.role}
              </div>
            </div>

            {/* Logout button */}
            <button
              id="vibemetrics-logout-button"
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
