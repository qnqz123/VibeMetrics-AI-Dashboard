import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  X, 
  Trash2, 
  Sparkles, 
  Clock, 
  ChevronDown, 
  Key, 
  CreditCard, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  Sliders
} from 'lucide-react';
import { ChatMessage } from '../types';
import { fetchChatHistory, saveChatMessage, clearChatHistory } from '../services/db';

interface AIChatbotWidgetProps {
  userId: string;
}

// Delay wheel / simulator presets
const LATENCY_PRESETS = [
  { label: 'Instant', delayMs: 80, badge: '80ms', desc: 'Local Cache' },
  { label: 'Fast Stream', delayMs: 350, badge: '350ms', desc: 'Edge CDN' },
  { label: 'Standard', delayMs: 750, badge: '750ms', desc: 'Regional Gateway' },
  { label: 'Realistic Cloud', delayMs: 1400, badge: '1.4s', desc: 'Cloud LLM Cluster' },
  { label: 'Heavy Compute', delayMs: 2500, badge: '2.5s', desc: 'Multi-Step Agent' },
];

export const AIChatbotWidget: React.FC<AIChatbotWidgetProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activePresetIndex, setActivePresetIndex] = useState(2); // Standard 750ms default
  const [showDelaySelector, setShowDelaySelector] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history from DB / storage
  useEffect(() => {
    if (userId) {
      fetchChatHistory(userId).then((history) => {
        setMessages(history);
      });
    }
  }, [userId]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // Rule-based router script
  const routePrompt = (prompt: string): { reply: string; category: ChatMessage['category'] } => {
    const query = prompt.toLowerCase().trim();

    // 1. API Keys Rule
    if (
      query.includes('api key') || 
      query.includes('api keys') || 
      query.includes('apikey') || 
      query.includes('token') || 
      query.includes('bearer') ||
      query.includes('credentials')
    ) {
      return {
        category: 'api_keys',
        reply: `### 🔑 VibeMetrics API Key Management

Your API keys authenticate requests to the VibeMetrics Inference Engine and Telemetry Stream:

- **Format**: \`Authorization: Bearer vm_live_8f3a9e...e2\`
- **Default Permissions**: \`metrics:read\`, \`tasks:write\`, \`inference:stream\`
- **Rate Limit**: 10,000 req/min on Pro Tier (burst allowed up to 15,000 req/min).
- **Key Rotation**: You can generate ephemeral or zero-trust keys with IP CIDR whitelisting under **Settings > Credentials**.
- **Header Example**:
\`\`\`http
POST /v1/chat/completions
Authorization: Bearer vm_live_key_99x28...
Content-Type: application/json
\`\`\`
All keys are hashed using SHA-256 before storage.`
      };
    }

    // 2. Pricing Rule
    if (
      query.includes('pricing') || 
      query.includes('price') || 
      query.includes('cost') || 
      query.includes('plan') || 
      query.includes('subscription') || 
      query.includes('tier') || 
      query.includes('billing')
    ) {
      return {
        category: 'pricing',
        reply: `### 💳 VibeMetrics SaaS Tier Architecture

Transparent pricing scaled to AI tokens and GPU hours:

- **🌱 Starter (Free)**:
  - 500,000 tokens/month
  - Single-cluster metrics, 1 API key
  - Standard community SLA ($0/mo)

- **⚡ Pro ($49/mo)** — *Most Popular*:
  - **20,000,000 tokens/month**
  - Dedicated Supabase Postgres synchronization
  - Sub-50ms telemetry streaming & Task Logger CRUD
  - Priority multi-model routing & 99.95% uptime SLA

- **🏢 Enterprise (Custom)**:
  - Unlimited tokens with volume tiered discounts ($0.0015 / 1k tokens)
  - Dedicated VPC peering, isolated H100 GPU clusters
  - Custom SLA (99.99%) with 24/7 dedicated support.`
      };
    }

    // 3. Database Sync Rule
    if (
      query.includes('database sync') || 
      query.includes('sync') || 
      query.includes('database') || 
      query.includes('supabase') || 
      query.includes('postgres') || 
      query.includes('cdc') || 
      query.includes('websocket')
    ) {
      return {
        category: 'database_sync',
        reply: `### ⚡ Live Database Synchronization Engine

VibeMetrics features a dual-layer synchronization pipeline:

1. **Serverless Primary (Supabase/PostgreSQL)**:
   - Real-time Change Data Capture (CDC) via WebSocket channels.
   - User tasks and metrics persist to tables: \`tasks\`, \`user_metrics\`, and \`chat_history\`.
2. **Resilient Local Offline Cache**:
   - If network drops or credentials aren't set, the engine seamlessly mirrors state to encrypted local storage.
3. **Conflict Resolution**:
   - Timestamp-based Last-Write-Wins (LWW) with client-side monotonic sequence verification.
4. **Current Status**:
   - Connected to active pipeline. All changes in your **Task Logger** reflect in less than 32ms.`
      };
    }

    // 4. Latency / Optimization Rule
    if (query.includes('latency') || query.includes('speed') || query.includes('fast') || query.includes('delay')) {
      return {
        category: 'general',
        reply: `### ⚡ Latency Optimization Insights

Current average latency across your active pipelines is **138 ms**.
Recommendations to reduce latency by up to 40%:
- Enable **Speculative Decoding** with small draft models (7B draft -> 70B target).
- Turn on **KV-Cache Reuse** for repeated system prompts.
- Route non-critical batch tasks to off-peak compute hours.`
      };
    }

    // 5. Model Fine-Tuning Rule
    if (query.includes('fine-tuning') || query.includes('lora') || query.includes('training')) {
      return {
        category: 'general',
        reply: `### 🧠 LoRA Fine-Tuning Pipeline
VibeMetrics supports parameter-efficient fine-tuning (PEFT) on Llama-3, Mistral, and Gemma models:
- Upload your JSONL dataset in **Task Logger**.
- Configure rank \`r=16\`, alpha \`32\`, and dropout \`0.05\`.
- Real-time training loss and validation perplexity metrics will be tracked directly on your dashboard.`
      };
    }

    // Default intelligent rule response
    return {
      category: 'general',
      reply: `### 🤖 VibeMetrics Neural Router Response

I have analyzed your inquiry: *"${prompt}"*.

Here is how you can achieve this within the VibeMetrics platform:
- **Metrics Dashboard**: Monitor real-time throughput, token burn rate, and latency.
- **Task Logger**: Queue and manage operational tasks like fine-tuning, vector indexing, or security audits with immediate DB sync.
- **API & Integrations**: Check **Settings > Config** to plug in your live Supabase credentials for one-click hosting.

Need specific info? Try asking about **"API keys"**, **"Pricing"**, or **"Database sync"**.`
    };
  };

  // Handle message sending with simulated delay wheel and streaming tokens
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputValue).trim();
    if (!prompt || isStreaming) return;

    setInputValue('');

    const userMessage: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: prompt,
      timestamp: new Date().toISOString(),
      category: 'general',
    };

    // Optimistically update message list
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await saveChatMessage(userId, userMessage);

    // Prepare simulated response based on rule router
    setIsStreaming(true);
    const selectedPreset = LATENCY_PRESETS[activePresetIndex];
    const { reply, category } = routePrompt(prompt);

    // Initial response delay (Simulate Live Server Response delay wheel)
    await new Promise((resolve) => setTimeout(resolve, selectedPreset.delayMs));

    // Simulate streaming tokens chunk by chunk
    const assistantMsgId = 'msg_ai_' + Date.now();
    setCurrentStreamId(assistantMsgId);
    setStreamingText('');

    const words = reply.split(' ');
    let currentAccumulated = '';
    const tokenSpeed = Math.max(12, Math.min(38, Math.floor(600 / words.length)));

    for (let i = 0; i < words.length; i++) {
      currentAccumulated += (i === 0 ? '' : ' ') + words[i];
      setStreamingText(currentAccumulated);
      await new Promise((r) => setTimeout(r, tokenSpeed));
    }

    // Complete the message
    const assistantMessage: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      text: reply,
      timestamp: new Date().toISOString(),
      category,
      tokensUsed: Math.floor(reply.length / 4),
      latencyMs: selectedPreset.delayMs,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setStreamingText('');
    setCurrentStreamId(null);
    setIsStreaming(false);

    await saveChatMessage(userId, assistantMessage);
  };

  const handleClearHistory = async () => {
    if (confirm('Clear all conversation history?')) {
      await clearChatHistory(userId);
      const reset = await fetchChatHistory(userId);
      setMessages(reset);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-lg shadow-cyan-950/50 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>AI Router Live</span>
          </motion.div>
        )}

        <motion.button
          id="vibemetrics-chatbot-toggle-button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-3.5 rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center ${
            isOpen 
              ? 'bg-slate-800 text-slate-300 border border-slate-700' 
              : 'bg-gradient-to-tr from-cyan-600 to-purple-600 text-white shadow-cyan-500/25 border border-cyan-300/40 neon-border-pulse'
          }`}
          title="Toggle VibeMetrics AI Assistant"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-slate-950 animate-pulse" />
          )}
        </motion.button>
      </div>

      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="vibemetrics-chatbot-window"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[440px] h-[580px] max-h-[82vh] z-50 flex flex-col rounded-2xl overflow-hidden glass-panel-cyan border border-cyan-500/30 shadow-2xl shadow-cyan-950/60"
          >
            {/* Header */}
            <div className="p-3.5 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-cyan-500/30">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white tracking-wide">VibeMetrics AI Assistant</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                      v2.4
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Neural Router Active</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5">
                {/* Delay Wheel Simulator Selector */}
                <div className="relative">
                  <button
                    id="simulate-delay-wheel-button"
                    onClick={() => setShowDelaySelector(!showDelaySelector)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-[11px] font-mono text-cyan-300 transition-colors"
                    title="Simulate Live Server Response (Delay Wheel)"
                  >
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{LATENCY_PRESETS[activePresetIndex].badge}</span>
                    <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                  </button>

                  {/* Delay Options Dropdown */}
                  {showDelaySelector && (
                    <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-cyan-500/30 rounded-xl shadow-xl p-1.5 z-50">
                      <div className="px-2 py-1 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800 mb-1 flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-cyan-400" />
                        <span>Simulate Server Latency</span>
                      </div>
                      {LATENCY_PRESETS.map((preset, idx) => (
                        <button
                          key={preset.label}
                          onClick={() => {
                            setActivePresetIndex(idx);
                            setShowDelaySelector(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            activePresetIndex === idx
                              ? 'bg-cyan-500/20 text-cyan-200 font-semibold'
                              : 'text-slate-300 hover:bg-slate-800/60'
                          }`}
                        >
                          <div>
                            <div>{preset.label}</div>
                            <span className="text-[10px] text-slate-400 font-mono">{preset.desc}</span>
                          </div>
                          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
                            {preset.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Clear Chat */}
                <button
                  onClick={handleClearHistory}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Clear Conversation History"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl p-3 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-br-none shadow-md shadow-purple-950/40'
                        : msg.sender === 'system'
                        ? 'bg-slate-900/80 border border-slate-800 text-slate-300 rounded-bl-none text-[11px]'
                        : 'bg-slate-900/90 border border-cyan-500/20 text-slate-200 rounded-bl-none shadow-lg'
                    }`}
                  >
                    {/* Render message with markdown formatting */}
                    <div className="space-y-1.5 break-words whitespace-pre-wrap">
                      {msg.text.split('\n').map((line, lineIdx) => {
                        if (line.startsWith('### ')) {
                          return (
                            <h4 key={lineIdx} className="text-xs font-bold text-cyan-300 mt-1 mb-0.5">
                              {line.replace('### ', '')}
                            </h4>
                          );
                        }
                        if (line.startsWith('- ')) {
                          return (
                            <div key={lineIdx} className="flex items-start gap-1.5 pl-1 text-slate-300">
                              <span className="text-cyan-400 font-bold">•</span>
                              <span>{line.replace('- ', '')}</span>
                            </div>
                          );
                        }
                        if (line.startsWith('```')) {
                          return (
                            <div key={lineIdx} className="font-mono text-[10px] text-cyan-200/80 bg-slate-950/70 p-1.5 rounded my-1">
                              {line.replace(/```[a-z]*/g, '')}
                            </div>
                          );
                        }
                        return <p key={lineIdx}>{line}</p>;
                      })}
                    </div>

                    {/* Metadata footer */}
                    {msg.sender === 'assistant' && (msg.tokensUsed || msg.latencyMs) && (
                      <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1 text-cyan-400/80">
                          <Zap className="w-2.5 h-2.5" />
                          {msg.tokensUsed} tokens
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {msg.latencyMs}ms delay
                        </span>
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] text-slate-400 font-mono mt-0.5 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {/* Streaming state simulation */}
              {isStreaming && (
                <div className="flex flex-col items-start">
                  <div className="max-w-[88%] rounded-xl rounded-bl-none p-3 bg-slate-900/90 border border-cyan-500/30 text-slate-200 shadow-lg">
                    {streamingText ? (
                      <div className="space-y-1.5 whitespace-pre-wrap">
                        {streamingText}
                        <span className="inline-block w-1.5 h-3 bg-cyan-400 ml-1 animate-pulse" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-cyan-400">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span className="font-mono text-[11px]">
                          Routing through {LATENCY_PRESETS[activePresetIndex].desc}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Rule-Based Router Prompt Pills */}
            <div className="px-3 py-1.5 bg-slate-950/70 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleSendMessage('API keys')}
                disabled={isStreaming}
                className="flex items-center gap-1 whitespace-nowrap px-2.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[11px] text-cyan-300 transition-colors disabled:opacity-50"
              >
                <Key className="w-2.5 h-2.5" />
                <span>API keys</span>
              </button>
              <button
                onClick={() => handleSendMessage('Pricing')}
                disabled={isStreaming}
                className="flex items-center gap-1 whitespace-nowrap px-2.5 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-[11px] text-purple-300 transition-colors disabled:opacity-50"
              >
                <CreditCard className="w-2.5 h-2.5" />
                <span>Pricing</span>
              </button>
              <button
                onClick={() => handleSendMessage('Database sync')}
                disabled={isStreaming}
                className="flex items-center gap-1 whitespace-nowrap px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-[11px] text-emerald-300 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Database sync</span>
              </button>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                id="vibemetrics-chatbot-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about API keys, Pricing, DB sync..."
                disabled={isStreaming}
                className="flex-1 px-3 py-2 bg-slate-950/80 border border-slate-700/80 focus:border-cyan-500/70 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-sans"
              />
              <button
                id="vibemetrics-chatbot-send-button"
                type="submit"
                disabled={!inputValue.trim() || isStreaming}
                className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shadow-md shadow-cyan-950/50 flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
