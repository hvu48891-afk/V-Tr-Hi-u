import { useState, FormEvent } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useTasks } from '../hooks/useTasks';

export default function CreateTaskModal() {
  const { isGlobalAddingTask, setIsGlobalAddingTask } = useUIStore();
  const { addTask } = useTasks();
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'todo'
  });
  const [loading, setLoading] = useState(false);

  if (!isGlobalAddingTask) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.title) return;
    
    setLoading(true);
    try {
      await addTask(task);
      setTask({ title: '', description: '', priority: 'Medium', status: 'todo' });
      setIsGlobalAddingTask(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <form onSubmit={handleSubmit} className="p-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-extrabold text-primary">Create New Task</h3>
            <button 
              type="button"
              onClick={() => setIsGlobalAddingTask(false)}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Task Title</label>
              <input 
                autoFocus
                type="text"
                required
                className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-primary font-bold focus:ring-2 focus:ring-primary/10"
                placeholder="What needs to be done?"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Description</label>
              <textarea 
                className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-on-surface-variant text-sm focus:ring-2 focus:ring-primary/10 min-h-[120px]"
                placeholder="Add more details..."
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Priority</label>
                <select 
                  className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10"
                  value={task.priority}
                  onChange={(e) => setTask({ ...task, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 block mb-2">Initial Status</label>
                <select 
                  className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10"
                  value={task.status}
                  onChange={(e) => setTask({ ...task, status: e.target.value })}
                >
                  <option value="todo">To Do</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-10 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-container transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Creating...' : (
              <>
                <Plus size={20} />
                Create Task
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
