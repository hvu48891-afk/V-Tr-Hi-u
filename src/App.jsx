import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import KanbanBoard from './components/KanbanBoard';
import Dashboard from './components/Dashboard';
import Team from './components/Team';
import Settings from './components/Settings';
import Analytics from './components/Analytics';
import CreateTaskModal from './components/CreateTaskModal';
import Auth from './components/Auth';
import { useAuth } from './hooks/useAuth';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';
import { useTaskStore } from './store/taskStore';
import { useNotificationStore } from './store/notificationStore';
import { Plus, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function App() {
  const { user: supabaseUser, loading: supabaseLoading } = useAuth();
  const { user: customUser } = useAuthStore();
  const { currentView, setIsGlobalAddingTask } = useUIStore();
  const { fetchTasks } = useTaskStore();
  const { message, type, hideNotification } = useNotificationStore();

  const user = supabaseUser || customUser;
  const loading = supabaseLoading && !customUser;

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-on-surface-variant font-bold animate-pulse">Initializing Monolith...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Team':
        return <Team />;
      case 'Analytics':
        return <Analytics />;
      case 'Settings':
        return <Settings />;
      case 'My Tasks':
      default:
        return <KanbanBoard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <CreateTaskModal />
      
      {message && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl z-[200] flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 ${
          type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-primary'
        } text-white`}>
          <span className="text-sm font-bold">{message}</span>
          <button 
            onClick={hideNotification}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <Plus size={14} className="rotate-45" />
          </button>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <TopBar />
        {renderView()}
      </main>

      <button 
        onClick={() => setIsGlobalAddingTask(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 md:hidden"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
