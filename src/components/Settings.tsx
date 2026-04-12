import { useState } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Globe, 
  Shield, 
  Save,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [theme, setTheme] = useState('System');

  const tabs = [
    { icon: User, label: 'Profile' },
    { icon: Bell, label: 'Notifications' },
    { icon: Lock, label: 'Security' },
    { icon: Palette, label: 'Appearance' },
    { icon: Globe, label: 'Language' },
    { icon: Shield, label: 'Privacy' },
  ];

  return (
    <section className="p-10 flex-1 flex flex-col gap-10 overflow-hidden">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-extrabold text-primary tracking-tight font-headline">Settings</h2>
          <p className="text-on-surface-variant font-medium mt-2 opacity-70">Manage your account and application preferences.</p>
        </div>
      </div>

      <div className="flex flex-1 gap-10 overflow-hidden">
        {/* Settings Navigation */}
        <div className="w-64 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center gap-3 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all text-left ${
                activeTab === tab.label
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-on-surface-variant/60 hover:bg-surface-container-high hover:text-primary'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-[2.5rem] shadow-[0_8px_24px_rgba(0,23,54,0.04)] border border-outline-variant/5 overflow-y-auto p-10 scrollbar-hide">
          {activeTab === 'Profile' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div>
                <h3 className="text-xl font-bold text-primary mb-6">Profile Information</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 ml-4">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-primary font-bold focus:ring-2 focus:ring-primary/10"
                      defaultValue="Alex Rivera"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 ml-4">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-primary font-bold focus:ring-2 focus:ring-primary/10"
                      defaultValue="alex.rivera@monolith.com"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 ml-4">Biography</label>
                    <textarea 
                      className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-on-surface-variant text-sm focus:ring-2 focus:ring-primary/10 min-h-[120px]"
                      defaultValue="Passionate about sustainable urban design and brutalist aesthetics."
                    />
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-outline-variant/10">
                <h3 className="text-xl font-bold text-primary mb-6">Profile Picture</h3>
                <div className="flex items-center gap-8">
                  <img 
                    src="https://picsum.photos/seed/alex/200/200" 
                    alt="Avatar" 
                    className="w-24 h-24 rounded-[2rem] object-cover shadow-xl"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-3">
                    <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-container transition-all">
                      Upload New Photo
                    </button>
                    <p className="text-xs text-on-surface-variant/40 font-medium">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Appearance' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">Interface Theme</h3>
                <p className="text-sm text-on-surface-variant/60 mb-8">Customize how Monolith Task looks on your device.</p>
                
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { id: 'Light', icon: Sun, desc: 'Classic bright look' },
                    { id: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
                    { id: 'System', icon: Monitor, desc: 'Follows OS settings' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setTheme(item.id)}
                      className={`p-6 rounded-[2rem] border-2 transition-all text-left ${
                        theme === item.id
                          ? 'border-primary bg-primary/5'
                          : 'border-surface-container-high hover:border-primary/30'
                      }`}
                    >
                      <item.icon size={24} className={theme === item.id ? 'text-primary' : 'text-on-surface-variant/40'} />
                      <p className="font-bold text-primary mt-4">{item.id}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest mt-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-outline-variant/10">
                <h3 className="text-xl font-bold text-primary mb-6">Accent Color</h3>
                <div className="flex gap-4">
                  {['#001736', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
                    <button
                      key={color}
                      className="w-12 h-12 rounded-2xl shadow-lg transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {['Notifications', 'Security', 'Language', 'Shield'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-40 animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-surface-container-low rounded-3xl flex items-center justify-center mb-6">
                <Shield size={40} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">{activeTab} Settings</h3>
              <p className="text-sm font-medium">This section is coming soon in the next architectural update.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-outline-variant/10 flex justify-end">
        <button className="flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-container transition-all shadow-xl shadow-primary/20">
          <Save size={20} />
          Save All Changes
        </button>
      </div>
    </section>
  );
}
