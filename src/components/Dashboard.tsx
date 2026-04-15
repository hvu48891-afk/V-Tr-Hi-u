import { LayoutGrid, CheckSquare, Users, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';

export default function Dashboard() {
  const { tasks } = useTaskStore();

  const stats = [
    { label: 'Total Tasks', value: tasks.length, icon: CheckSquare, color: 'bg-blue-500' },
    { label: 'Active Team', value: '12', icon: Users, color: 'bg-purple-500' },
    { label: 'Completion Rate', value: '84%', icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Avg. Cycle Time', value: '3.2d', icon: Clock, color: 'bg-orange-500' },
  ];

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="p-8 flex-1 overflow-y-auto">
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold text-primary tracking-tight font-headline">Dashboard</h2>
        <p className="text-on-surface-variant font-medium mt-2 opacity-70">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-outline-variant/10 flex items-center gap-5">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-current/20`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-primary leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-primary">Recent Tasks</h3>
            <button className="text-sm font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-transparent hover:border-primary/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="font-bold text-primary text-sm">{task.title}</p>
                    <p className="text-xs text-on-surface-variant/60 truncate max-w-[200px]">{task.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${
                    task.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
            {recentTasks.length === 0 && (
              <div className="text-center py-10">
                <AlertCircle className="mx-auto text-on-surface-variant/20 mb-3" size={48} />
                <p className="text-on-surface-variant/40 font-bold">No tasks found</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-primary text-white rounded-[2.5rem] p-8 shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">Project Health</h3>
            <p className="text-white/60 text-sm mb-8 leading-relaxed">Your team is performing 15% better than last week. Keep up the great work!</p>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span>Design Phase</span>
                  <span>90%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[90%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span>Development</span>
                  <span>45%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[45%]" />
                </div>
              </div>
            </div>
          </div>
          <LayoutGrid className="absolute -bottom-10 -right-10 text-white/5" size={200} />
        </div>
      </div>
    </div>
  );
}
