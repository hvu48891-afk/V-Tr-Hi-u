import { Search, Bell, Settings, LogOut, Plus } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function TopBar() {
  const { searchQuery, setSearchQuery, setIsGlobalAddingTask, setCurrentView } = useUIStore();
  const { showNotification } = useNotificationStore();
  const { user: customUser, logout: customLogout } = useAuthStore();
  const [supabaseUser, setSupabaseUser] = useState(null);

  const user = supabaseUser || customUser;

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setSupabaseUser(user));
  }, []);

  const handleSignOut = async () => {
    if (supabaseUser) {
      await supabase.auth.signOut();
    }
    if (customUser) {
      customLogout();
    }
    window.location.reload(); // Refresh to clear all states
  };

  return (
    <header className="flex justify-between items-center px-8 w-full sticky top-0 z-40 bg-surface/80 backdrop-blur-md h-20 border-b border-outline-variant/5">
      <div className="flex items-center gap-8 flex-1">
        <span className="text-2xl font-bold text-primary tracking-tight font-headline">Monolith Task</span>
        <div className="hidden lg:flex items-center bg-surface-container-low rounded-full px-5 py-2.5 w-full max-md border border-transparent focus-within:border-outline-variant/30 transition-all">
          <Search size={18} className="text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Search tasks, teams, or documents..."
            className="bg-transparent border-none focus:ring-0 text-sm w-full text-on-surface ml-3 placeholder:text-on-surface-variant/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button 
          onClick={() => setIsGlobalAddingTask(true)}
          className="hidden md:flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary-container transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={18} />
          New Task
        </button>
        <div className="h-8 w-px bg-outline-variant/20 mx-1 hidden md:block"></div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => showNotification('No new notifications', 'info')}
            className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-all"
          >
            <Bell size={20} />
          </button>
          <button 
            onClick={() => setCurrentView('Settings')}
            className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-all"
          >
            <Settings size={20} />
          </button>
        </div>
        <div className="h-8 w-px bg-outline-variant/20 mx-1"></div>
        <div className="flex items-center gap-4 pl-4 border-l border-outline-variant/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-primary leading-none mb-1">
              {supabaseUser?.user_metadata?.full_name || customUser?.name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
              Architect
            </p>
          </div>
          <div className="relative group">
            <img
              src={customUser?.picture || `https://ui-avatars.com/api/?name=${user?.email}&background=001736&color=fff`}
              alt="User"
              className="w-10 h-10 rounded-2xl object-cover border-2 border-surface-container-high cursor-pointer"
              referrerPolicy="no-referrer"
            />
            <button 
              onClick={handleSignOut}
              className="absolute top-full right-0 mt-2 bg-white shadow-xl rounded-xl p-2 border border-outline-variant/10 opacity-0 group-hover:opacity-100 transition-all invisible group-hover:visible min-w-[120px]"
            >
              <div className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors text-xs font-bold">
                <LogOut size={14} />
                Sign Out
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
