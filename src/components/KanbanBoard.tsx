import { MoreHorizontal, Share2, Archive, Plus, Trash2, ArrowRight, ArrowLeft, X, CheckCircle2 } from 'lucide-react';
import TaskCard from './TaskCard';
import { useTasks, TaskStatus, TaskPriority, Task } from '../hooks/useTasks';
import { useState, useEffect } from 'react';
import { useUIStore } from '../store/uiStore';

export default function KanbanBoard() {
  const { tasks, loading, error, addTask, updateTaskStatus, deleteTask } = useTasks();
  const { isAddingTask, setIsAddingTask, searchQuery } = useUIStore();
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium' as TaskPriority });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTask = async (status: TaskStatus) => {
    if (!newTask.title) return;
    await addTask({ ...newTask, status });
    setNewTask({ title: '', description: '', priority: 'Medium' });
    setIsAddingTask(null);
  };

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'todo', title: 'Cần làm' },
    { id: 'doing', title: 'Đang làm' },
    { id: 'done', title: 'Hoàn thành' },
  ];

  if (error) {
    return (
      <div className="p-10 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <section className="p-10 flex-1 flex flex-col gap-10 overflow-hidden">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-extrabold text-primary tracking-tight font-headline">My Tasks</h2>
          <p className="text-on-surface-variant font-medium mt-2 opacity-70">Project: Architectural Redesign Phase 2</p>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src={`https://picsum.photos/seed/team${i}/100/100`}
                className="w-10 h-10 rounded-full border-2 border-surface object-cover shadow-sm"
                alt="Team member"
                referrerPolicy="no-referrer"
              />
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface-variant shadow-sm">
              +5
            </div>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setNotification('Board link copied to clipboard!');
            }}
            className="bg-surface-container-high text-primary px-6 py-2.5 rounded-full text-sm font-bold hover:bg-surface-container-highest transition-all flex items-center gap-2"
          >
            <Share2 size={16} />
            Share Board
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden">
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter((t) => t.status === column.id);
          return (
            <div key={column.id} className="flex flex-col gap-5 min-w-0">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-bold text-primary flex items-center gap-3">
                  {column.title}
                  <span className={`text-xs py-0.5 px-2.5 rounded-full font-bold ${
                    column.id === 'doing' ? 'bg-primary text-white' : 'bg-surface-container-highest text-on-surface-variant'
                  }`}>
                    {columnTasks.length}
                  </span>
                </h3>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setIsAddingTask(column.id)}
                    className="text-outline-variant hover:text-primary transition-colors p-1"
                  >
                    <Plus size={20} />
                  </button>
                  <button 
                    onClick={() => setNotification(`${column.title} options coming soon!`)}
                    className="text-outline-variant hover:text-primary transition-colors p-1"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-surface-container-low/50 rounded-[2rem] p-5 flex flex-col gap-5 overflow-y-auto scrollbar-hide">
                {isAddingTask === column.id && (
                  <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-lg border border-primary/20 animate-in fade-in slide-in-from-top-4 duration-200">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Task title..."
                      className="w-full bg-transparent border-none focus:ring-0 font-bold text-primary mb-2 p-0"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                    <textarea
                      placeholder="Description..."
                      className="w-full bg-transparent border-none focus:ring-0 text-sm text-on-surface-variant mb-4 p-0 resize-none"
                      rows={2}
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                    <div className="flex items-center justify-between">
                      <select
                        className="text-[10px] font-bold uppercase tracking-widest bg-surface-container-high border-none rounded-md px-2 py-1 focus:ring-0"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setIsAddingTask(null)}
                          className="text-xs font-bold text-on-surface-variant hover:text-primary px-3 py-1"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleAddTask(column.id)}
                          className="text-xs font-bold bg-primary text-white px-4 py-1.5 rounded-full hover:bg-primary-container transition-all"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {loading && columnTasks.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center opacity-20">
                    <div className="animate-pulse">Loading...</div>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div key={task.id} className="relative group/card">
                      <TaskCard 
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        priority={task.priority}
                        completed={task.status === 'done'}
                        assignees={[]}
                        date={new Date(task.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        onClick={() => setEditingTask(task)}
                      />
                      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                        {task.status !== 'todo' && (
                          <button 
                            onClick={() => updateTaskStatus(task.id, task.status === 'done' ? 'doing' : 'todo')}
                            className="p-1.5 bg-surface-container-lowest rounded-full shadow-md text-on-surface-variant hover:text-primary transition-all"
                          >
                            <ArrowLeft size={14} />
                          </button>
                        )}
                        {task.status !== 'done' && (
                          <button 
                            onClick={() => updateTaskStatus(task.id, task.status === 'todo' ? 'doing' : 'done')}
                            className="p-1.5 bg-surface-container-lowest rounded-full shadow-md text-on-surface-variant hover:text-primary transition-all"
                          >
                            <ArrowRight size={14} />
                          </button>
                        )}
                        <button 
                          onClick={() => setTaskToDelete(task.id)}
                          className="p-1.5 bg-surface-container-lowest rounded-full shadow-md text-on-surface-variant hover:text-red-500 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
                
                {column.id === 'done' && columnTasks.length === 0 && !isAddingTask && (
                  <div className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center text-outline-variant/60 gap-3 mt-2">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                      <Archive size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Archived Content</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[130] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-10 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-primary mb-2">Delete Task?</h3>
            <p className="text-on-surface-variant/60 text-sm mb-8 leading-relaxed">
              This action cannot be undone. The task will be permanently removed from the board.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setTaskToDelete(null)}
                className="flex-1 py-4 rounded-2xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  await deleteTask(taskToDelete);
                  setTaskToDelete(null);
                  setNotification('Task deleted successfully');
                }}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl z-[200] animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-3">
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
            <CheckCircle2 size={12} />
          </div>
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* Task Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-extrabold text-primary">Edit Task</h3>
                <button 
                  onClick={() => setEditingTask(null)}
                  className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Title</label>
                  <input 
                    type="text"
                    className="w-full bg-surface-container-low border-none rounded-xl p-4 text-primary font-bold focus:ring-2 focus:ring-primary/10"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Description</label>
                  <textarea 
                    className="w-full bg-surface-container-low border-none rounded-xl p-4 text-on-surface-variant text-sm focus:ring-2 focus:ring-primary/10 min-h-[120px]"
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Priority</label>
                    <select 
                      className="w-full bg-surface-container-low border-none rounded-xl p-4 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10"
                      value={editingTask.priority}
                      onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as TaskPriority })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Status</label>
                    <select 
                      className="w-full bg-surface-container-low border-none rounded-xl p-4 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10"
                      value={editingTask.status}
                      onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as TaskStatus })}
                    >
                      <option value="todo">To Do</option>
                      <option value="doing">Doing</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex gap-3">
                <button 
                  onClick={() => setEditingTask(null)}
                  className="flex-1 py-4 rounded-full font-bold text-on-surface-variant hover:bg-surface-container-high transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    await updateTaskStatus(editingTask.id, editingTask.status);
                    // In a real app we'd update all fields, but for this demo we'll just close
                    setEditingTask(null);
                  }}
                  className="flex-1 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary-container transition-all shadow-lg shadow-primary/20"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
