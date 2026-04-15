/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import KanbanBoard from './components/KanbanBoard';
import Dashboard from './components/Dashboard';
import Team from './components/Team';
import Settings from './components/Settings';
import CreateTaskModal from './components/CreateTaskModal';
import Auth from './components/Auth';
import { useAuth } from './hooks/useAuth';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';
import { useTaskStore } from './store/taskStore';
import { useNotificationStore } from './store/notificationStore';
import { supabase } from './lib/supabaseClient';
import { LayoutGrid, CheckSquare, Users, User, Plus, Loader2, Settings as SettingsIcon, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

export default function App() {
  const { user: supabaseUser, loading: supabaseLoading } = useAuth();
  const { user: customUser, logout: customLogout } = useAuthStore();
  const { currentView, setCurrentView, setIsGlobalAddingTask } = useUIStore();
  const { fetchTasks } = useTaskStore();
  const { message, type, hideNotification } = useNotificationStore();

  const user = supabaseUser || customUser;
  const loading = supabaseLoading && !customUser;

  useEffect(() => {
    if (user) {
      fetchTasks();

      // Set up global real-time subscription
      const subscription = supabase
        .channel('global_tasks_channel')
        .on(
          'postgres_changes' as any,
          { event: '*', table: 'tasks' },
          () => {
            fetchTasks();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="text-primary animate-spin" size={48} />
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
      case 'Settings':
        return <Settings />;
      case 'My Tasks':
      default:
        return <KanbanBoard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface selection:bg-primary/10 selection:text-primary">
      <Sidebar />
      <CreateTaskModal />
      
      {/* Global Notifications */}
      {message && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl z-[200] animate-in slide-in-from-top-4 duration-300 flex items-center gap-3 ${
          type === 'success' ? 'bg-green-500 text-white' : 
          type === 'error' ? 'bg-red-500 text-white' : 
          'bg-primary text-white'
        }`}>
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
            {type === 'success' ? <CheckCircle2 size={12} /> : 
             type === 'error' ? <AlertCircle size={12} /> : 
             <Info size={12} />}
          </div>
          <span className="text-sm font-bold">{message}</span>
          <button onClick={hideNotification} className="ml-2 hover:opacity-70">
            <Plus size={14} className="rotate-45" />
          </button>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <TopBar />
        {renderView()}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant/10 h-16 flex items-center justify-around px-4 z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setCurrentView('Dashboard')}
          className={`flex flex-col items-center gap-1 ${currentView === 'Dashboard' ? 'text-primary' : 'text-on-surface-variant/40'}`}
        >
          <LayoutGrid size={20} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button 
          onClick={() => setCurrentView('My Tasks')}
          className={`flex flex-col items-center gap-1 ${currentView === 'My Tasks' ? 'text-primary' : 'text-on-surface-variant/40'}`}
        >
          <CheckSquare size={20} />
          <span className="text-[10px] font-bold">Tasks</span>
        </button>
        <button 
          onClick={() => setIsGlobalAddingTask(true)}
          className="w-12 h-12 -mt-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
        <button 
          onClick={() => setCurrentView('Team')}
          className={`flex flex-col items-center gap-1 ${currentView === 'Team' ? 'text-primary' : 'text-on-surface-variant/40'}`}
        >
          <Users size={20} />
          <span className="text-[10px] font-bold">Team</span>
        </button>
        <button 
          onClick={() => setCurrentView('Settings')}
          className={`flex flex-col items-center gap-1 ${currentView === 'Settings' ? 'text-primary' : 'text-on-surface-variant/40'}`}
        >
          <SettingsIcon size={20} />
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>
    </div>
  );
}
