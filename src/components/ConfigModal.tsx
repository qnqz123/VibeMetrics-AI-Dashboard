import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Key, 
  Globe, 
  Copy, 
  Check, 
  Github, 
  Database, 
  Server, 
  Save, 
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { VIBEMETRICS_CONFIG } from '../config';
import { getActiveSupabaseConfig, saveCustomSupabaseConfig, clearCustomSupabaseConfig } from '../services/db';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const active = getActiveSupabaseConfig();
  const [url, setUrl] = useState(active.supabaseUrl);
  const [key, setKey] = useState(active.supabaseAnonKey);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomSupabaseConfig(url, key);
    setSaveMessage('Credentials saved! Reloading connection...');
    setTimeout(() => {
      setSaveMessage(null);
      onConfigSaved();
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    clearCustomSupabaseConfig();
    setUrl(VIBEMETRICS_CONFIG.supabaseUrl);
    setKey(VIBEMETRICS_CONFIG.supabaseAnonKey);
    setSaveMessage('Reset to defaults in src/config.ts');
    setTimeout(() => setSaveMessage(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl rounded-2xl glass-panel-cyan p-6 relative overflow-hidden shadow-2xl border border-cyan-500/30 text-xs"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Database & Deployment Configuration</h2>
              <p className="text-slate-400 text-[11px]">
                Cleanly extracted credentials from <code className="text-cyan-300 font-mono">src/config.ts</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {saveMessage && (
          <div className="my-3 p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-center">
            {saveMessage}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-mono text-[11px] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Supabase Project URL (VITE_SUPABASE_URL)</span>
              </label>
              <button
                type="button"
                onClick={() => handleCopy(url, 'url')}
                className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 text-[10px] font-mono"
              >
                {copiedField === 'url' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === 'url' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project-id.supabase.co"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-mono text-[11px] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-400" />
                <span>Supabase Anon Public Key (VITE_SUPABASE_ANON_KEY)</span>
              </label>
              <button
                type="button"
                onClick={() => handleCopy(key, 'key')}
                className="text-slate-400 hover:text-purple-300 flex items-center gap-1 text-[10px] font-mono"
              >
                {copiedField === 'key' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedField === 'key' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-xs shadow-md shadow-cyan-950/50 hover:opacity-90 transition-opacity"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply Credentials</span>
            </button>
          </div>
        </form>

        {/* 1-Click Hosting Guide */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-950/70 border border-white/10 font-mono space-y-2">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Github className="w-4 h-4" />
              <span>1-Click GitHub & Cloud Hosting</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Zero Lock-In
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            All credentials are fully decoupled in <code className="text-cyan-300 font-mono">/src/config.ts</code>. Simply link this repository to GitHub, configure environment variables in your hosting provider (Vercel, Netlify, Cloud Run), and launch!
          </p>
          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 overflow-x-auto">
            VITE_SUPABASE_URL="{url || 'https://your-project.supabase.co'}"<br />
            VITE_SUPABASE_ANON_KEY="{key ? key.substring(0, 20) + '...' : 'eyJhbGci...'}"
          </div>
        </div>
      </motion.div>
    </div>
  );
};
