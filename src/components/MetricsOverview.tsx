import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Activity, 
  Clock, 
  DollarSign, 
  Layers, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Cpu,
  ShieldAlert
} from 'lucide-react';
import { UserMetrics } from '../types';

interface MetricsOverviewProps {
  metrics: UserMetrics;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  metrics,
  onRefresh,
  isRefreshing
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  // Compute percentage of credits used
  const totalBudget = metrics.costBalance + metrics.creditsRemaining;
  const creditUsagePct = totalBudget > 0 ? (metrics.costBalance / totalBudget) * 100 : 0;

  return (
    <div id="vibemetrics-metrics-section" className="space-y-6">
      {/* Top Banner with Real-time synchronization badge and time filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Telemetry & AI Ops
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">
              Live Stream
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time inference tokens, latency traces, and cluster health for <span className="text-cyan-400 font-mono">{metrics.userEmail}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Time range pills */}
          <div className="p-1 rounded-xl bg-slate-900/80 border border-white/10 flex items-center text-xs font-mono">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-cyan-400 transition-colors disabled:opacity-50"
            title="Refresh Metrics from Database"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tokens */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-panel-cyan rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-200"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase tracking-wider text-[11px] text-cyan-300">Total AI Tokens</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              {metrics.totalTokens.toLocaleString()}
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span className="flex items-center text-emerald-400 font-mono font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +14.2%
            </span>
            <span className="text-slate-400">vs yesterday</span>
          </div>
        </motion.div>

        {/* Card 2: Requests Per Minute */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-panel-purple rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-200"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase tracking-wider text-[11px] text-purple-300">Throughput (RPM)</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              {metrics.requestsPerMinute.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-mono">req/min</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span className="flex items-center text-emerald-400 font-mono font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +8.6%
            </span>
            <span className="text-slate-400">burst capacity 92%</span>
          </div>
        </motion.div>

        {/* Card 3: Latency */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-200 border-white/10"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase tracking-wider text-[11px] text-slate-300">Avg Response Time</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              {metrics.avgLatencyMs}
            </span>
            <span className="text-xs text-slate-400 font-mono">ms p95</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span className="flex items-center text-emerald-400 font-mono font-medium">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> -12ms
            </span>
            <span className="text-slate-400">KV-cache active</span>
          </div>
        </motion.div>

        {/* Card 4: Spend & Balance */}
        <motion.div
          whileHover={{ y: -2 }}
          className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-200 border-white/10"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono uppercase tracking-wider text-[11px] text-slate-300">Credits Remaining</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              ${metrics.creditsRemaining.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ $500</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (metrics.creditsRemaining / 500) * 100)}%` }}
            />
          </div>
        </motion.div>
      </div>

      {/* Secondary Row: Usage Graph & Operational Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Token Burn & Throughput Histogram Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 sm:p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Intraday Token Burn & Ingestion Wave
              </h3>
              <p className="text-xs text-slate-400">
                Aggregated token consumption across all active inference nodes
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
                Tokens
              </span>
              <span className="flex items-center gap-1.5 text-purple-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
                Requests
              </span>
            </div>
          </div>

          {/* Visual Bar Chart */}
          <div className="h-44 flex items-end gap-3 sm:gap-6 pt-6 px-2 border-b border-white/10">
            {metrics.dailyUsage.map((point, index) => {
              const maxTokens = 550000;
              const heightPct = Math.min(100, Math.max(12, (point.tokens / maxTokens) * 100));
              const reqHeightPct = Math.min(100, Math.max(8, (point.requests / 4500) * 80));

              return (
                <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-cyan-500/40 text-[10px] font-mono text-cyan-200 px-2 py-1 rounded shadow-xl pointer-events-none whitespace-nowrap z-20">
                    {point.tokens.toLocaleString()} tokens • {point.requests} req • {point.latency}ms
                  </div>

                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* Token bar */}
                    <div
                      className="w-1/2 rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:from-cyan-500 group-hover:to-cyan-300 transition-all shadow-sm shadow-cyan-500/20"
                      style={{ height: `${heightPct}%` }}
                    />
                    {/* Request bar */}
                    <div
                      className="w-1/2 rounded-t-md bg-gradient-to-t from-purple-700 to-purple-500 group-hover:from-purple-600 group-hover:to-purple-400 transition-all shadow-sm shadow-purple-500/20"
                      style={{ height: `${reqHeightPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* X Axis labels */}
          <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 px-2">
            {metrics.dailyUsage.map((p, i) => (
              <span key={i}>{p.time}</span>
            ))}
          </div>
        </div>

        {/* System Health & Cluster Indicators */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-wide">Cluster Health & SRE</h3>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                All Systems Normal
              </span>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Active Pipelines</span>
                </div>
                <span className="text-cyan-300 font-bold">{metrics.activePipelines} clusters</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Error Rate</span>
                </div>
                <span className="text-emerald-300 font-bold">{metrics.errorRatePercent}%</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Current Billing Run</span>
                </div>
                <span className="text-purple-300 font-bold">${metrics.costBalance.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Last DB Sync:</span>
            <span className="text-cyan-400">
              {new Date(metrics.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
