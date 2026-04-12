import { LayoutGrid, CheckSquare, Users, BarChart3, Archive, HelpCircle, LogOut, Plus, DraftingCompass, Settings as SettingsIcon } from 'lucide-react';
import { useUIStore, ViewType } from '../store/uiStore';
import { useState } from 'react';

export default function Sidebar() {
  const setIsAddingTask = useUIStore((state) => state.setIsAddingTask);
  const { currentView, setCurrentView } = useUIStore();

  const navItems: { icon: any; label: ViewType }[] = [
    { icon: LayoutGrid, label: 'Dashboard' },
    { icon: CheckSquare, label: 'My Tasks' },
    { icon: Users, label: 'Team' },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Archive, label: 'Archive' },
    { icon: SettingsIcon, label: 'Settings' },
  ];

  const bottomItems = [
    { icon: HelpCircle, label: 'Help' },
    { icon: LogOut, label: 'Sign Out' },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 sticky top-0 py-8 px-6 gap-8 bg-surface border-r border-outline-variant/10">
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <DraftingCompass size={24} />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-primary leading-tight tracking-tight">Architectural Hub</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">Enterprise Workspace</p>
        </div>
      </div>

      <button 
        onClick={() => setIsAddingTask('todo')}
        className="w-full py-3.5 px-4 bg-primary text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-md shadow-primary/10"
      >
        <Plus size={18} />
        New Project
      </button>

      <nav className="flex-1 flex flex-col gap-1.5">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setCurrentView(item.label)}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 w-full text-left ${
              currentView === item.label
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <item.icon size={20} />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 flex flex-col gap-1 border-t border-outline-variant/20">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              if (item.label === 'Sign Out') {
                console.log('Signing out...');
                alert('Signing out functionality would go here.');
              } else {
                alert(`${item.label} clicked`);
              }
            }}
            className="flex items-center gap-3 py-3 px-4 text-on-surface-variant hover:bg-surface-container-high transition-all rounded-xl w-full text-left"
          >
            <item.icon size={20} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
