import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Search, 
  SlidersHorizontal, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Download,
  Sparkles
} from 'lucide-react';
import { TaskRecord, TaskCategory, TaskPriority, TaskStatus } from '../types';
import { createTask, updateTask, deleteTask } from '../services/db';

interface TaskLoggerGridProps {
  userId: string;
  tasks: TaskRecord[];
  onTasksUpdated: (tasks: TaskRecord[]) => void;
  onTaskAddedFeedback?: () => void;
}

const CATEGORIES: TaskCategory[] = [
  'Model Fine-tuning',
  'Vector Indexing',
  'API Audit',
  'Prompt Eval',
  'Latency Optimization'
];

const PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES: TaskStatus[] = ['Pending', 'In Progress', 'Completed', 'Failed'];

export const TaskLoggerGrid: React.FC<TaskLoggerGridProps> = ({
  userId,
  tasks,
  onTasksUpdated,
  onTaskAddedFeedback,
}) => {
  // Input form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('Model Fine-tuning');
  const [newPriority, setNewPriority] = useState<TaskPriority>('High');
  const [newStatus, setNewStatus] = useState<TaskStatus>('Pending');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter and search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Inline editing state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<TaskCategory>('Model Fine-tuning');
  const [editPriority, setEditPriority] = useState<TaskPriority>('Medium');
  const [editStatus, setEditStatus] = useState<TaskStatus>('Pending');
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle Save to DB
  const handleSaveToDb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || isSaving) return;

    try {
      setIsSaving(true);
      const created = await createTask(userId, {
        title: newTitle.trim(),
        category: newCategory,
        priority: newPriority,
        status: newStatus,
      });

      // Update state instantly
      onTasksUpdated([created, ...tasks]);
      setNewTitle('');
      setSaveSuccess(true);
      if (onTaskAddedFeedback) onTaskAddedFeedback();

      setTimeout(() => setSaveSuccess(false), 2200);
    } catch (err) {
      console.error('Failed to save task:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Start edit
  const startEditing = (task: TaskRecord) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditPriority(task.priority);
    setEditStatus(task.status);
  };

  // Cancel edit
  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  // Save edit
  const handleUpdateTask = async (taskId: string) => {
    if (!editTitle.trim() || isUpdating) return;
    try {
      setIsUpdating(true);
      const updated = await updateTask(userId, taskId, {
        title: editTitle.trim(),
        category: editCategory,
        priority: editPriority,
        status: editStatus,
      });

      onTasksUpdated(tasks.map(t => (t.id === taskId ? updated : t)));
      setEditingTaskId(null);
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task record?')) return;
    try {
      await deleteTask(userId, taskId);
      onTasksUpdated(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  // Export tasks as JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vibemetrics_tasks_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getPriorityBadgeClass = (priority: TaskPriority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'High':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Medium':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'Low':
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusBadgeClass = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'In Progress':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 animate-pulse';
      case 'Pending':
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
      case 'Failed':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div id="vibemetrics-task-logger" className="glass-panel rounded-2xl border border-white/10 p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background neon flair */}
      <div className="absolute top-0 right-0 w-96 h-40 bg-gradient-to-bl from-cyan-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-950">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-wide">Live Task Logger & Orchestration Grid</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                CRUD Synchronized
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct pipeline execution tasks mapped to database collections with instant state reactivity
            </p>
          </div>
        </div>

        {/* Stats summary & export */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 transition-colors"
            title="Export Records to JSON"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-xs font-mono text-cyan-300">
            {tasks.length} total • {tasks.filter(t => t.status === 'Completed').length} done
          </div>
        </div>
      </div>

      {/* Create Task Input Form */}
      <form onSubmit={handleSaveToDb} className="mt-5 p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 shadow-inner">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Dispatch New Pipeline Task</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Title input */}
          <div className="md:col-span-6">
            <input
              id="new-task-title-input"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="E.g., Fine-tune Gemma-2 on support dialogues or reindex PgVector..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 font-sans transition-all"
            />
          </div>

          {/* Category */}
          <div className="md:col-span-2">
            <select
              id="new-task-category-select"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 transition-all font-sans"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="md:col-span-2">
            <select
              id="new-task-priority-select"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 transition-all font-sans"
            >
              {PRIORITIES.map(prio => (
                <option key={prio} value={prio}>{prio} Priority</option>
              ))}
            </select>
          </div>

          {/* Save to DB Button */}
          <div className="md:col-span-2 flex items-center">
            <button
              id="save-to-db-button"
              type="submit"
              disabled={!newTitle.trim() || isSaving}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
                saveSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-900/50'
                  : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-cyan-950/60 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved to DB!</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save to DB</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Filter and search controls */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/60 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-200 text-xs focus:outline-none"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-200 text-xs focus:outline-none"
            >
              <option value="all">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Grid Table */}
      <div className="mt-4 rounded-xl border border-white/10 overflow-hidden bg-slate-950/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/80 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Task Details</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Compute Usage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              <AnimatePresence>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No tasks found matching current filters. Type above and click "Save to DB" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {
                    const isEditing = editingTaskId === task.id;

                    return (
                      <motion.tr
                        key={task.id}
                        id={`task-row-${task.id}`}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="hover:bg-slate-900/50 transition-colors group"
                      >
                        {/* Title & Date */}
                        <td className="py-3 px-4 max-w-xs sm:max-w-md">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/50 text-xs text-white focus:outline-none"
                            />
                          ) : (
                            <div>
                              <div className="font-medium text-slate-100 group-hover:text-cyan-300 transition-colors">
                                {task.title}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                Created {new Date(task.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {isEditing ? (
                            <select
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value as TaskCategory)}
                              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-200"
                            >
                              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono">
                              {task.category}
                            </span>
                          )}
                        </td>

                        {/* Priority */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {isEditing ? (
                            <select
                              value={editPriority}
                              onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-200"
                            >
                              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                          ) : (
                            <span className={`px-2 py-0.5 rounded-md border text-[11px] font-mono ${getPriorityBadgeClass(task.priority)}`}>
                              {task.priority}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {isEditing ? (
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
                              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-200"
                            >
                              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          ) : (
                            <span className={`px-2 py-0.5 rounded-md border text-[11px] font-mono ${getStatusBadgeClass(task.status)}`}>
                              {task.status}
                            </span>
                          )}
                        </td>

                        {/* Compute Usage */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-mono text-slate-300 text-[11px]">
                            {(task.tokensConsumed || 0).toLocaleString()} tok
                          </div>
                          <div className="text-[10px] font-mono text-emerald-400">
                            ${(task.cost || 0).toFixed(2)}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleUpdateTask(task.id)}
                                disabled={isUpdating}
                                className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40"
                                title="Save changes to DB"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => startEditing(task)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                                title="Edit row"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                title="Delete task from DB"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
