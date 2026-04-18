import { useTaskStore } from '../store/taskStore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, CheckCircle2, Clock, AlertCircle, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

export default function Analytics() {
  const { tasks } = useTaskStore();

  // Process data for charts
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ 
    name: name.charAt(0).toUpperCase() + name.slice(1), 
    value 
  }));

  const priorityData = [
    { name: 'High', count: tasks.filter(t => t.priority === 'High').length },
    { name: 'Medium', count: tasks.filter(t => t.priority === 'Medium').length },
    { name: 'Low', count: tasks.filter(t => t.priority === 'Low').length },
  ];

  // Mock trend data (since we might not have enough historical data)
  const trendData = [
    { day: 'Mon', completed: 4, active: 8 },
    { day: 'Tue', completed: 7, active: 10 },
    { day: 'Wed', completed: 5, active: 12 },
    { day: 'Thu', completed: 9, active: 11 },
    { day: 'Fri', completed: 12, active: 9 },
    { day: 'Sat', completed: 8, active: 7 },
    { day: 'Sun', completed: 10, active: 6 },
  ];

  const COLORS = ['#001736', '#4f46e5', '#818cf8', '#c7d2fe'];

  const stats = [
    { label: 'Completion Rate', value: tasks.length ? `${Math.round((statusCounts['done'] || 0) / tasks.length * 100)}%` : '0%', icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Pending Tasks', value: (statusCounts['todo'] || 0) + (statusCounts['in-progress'] || 0), icon: Clock, color: 'text-blue-500' },
    { label: 'Urgent Work', value: tasks.filter(t => t.priority === 'High' && t.status !== 'done').length, icon: AlertCircle, color: 'text-red-500' },
    { label: 'Task Velocity', value: '+12%', icon: TrendingUp, color: 'text-indigo-500' },
  ];

  return (
    <div className="p-8 flex-1 overflow-y-auto bg-surface">
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold text-primary tracking-tight font-headline">Analytics</h2>
        <p className="text-on-surface-variant font-medium mt-2 opacity-70">Deep dive into your architectural performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-outline-variant/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-surface-container rounded-xl">
                <stat.icon className={stat.color} size={20} />
              </div>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">+4.5%</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-primary">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="text-primary" size={24} />
            <h3 className="text-xl font-bold text-primary">Task Throughput</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#001736" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#001736" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="completed" stroke="#001736" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-8">
            <PieChartIcon className="text-primary" size={24} />
            <h3 className="text-xl font-bold text-primary">Distribution by Status</h3>
          </div>
          <div className="h-[300px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.length ? pieData : [{name: 'Empty', value: 1}]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  {!pieData.length && <Cell fill="#f1f5f9" />}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3 pr-8">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs font-bold text-on-surface-variant">{entry.name}</span>
                  <span className="text-xs font-black text-primary ml-auto">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="text-primary" size={24} />
          <h3 className="text-xl font-bold text-primary">Priority Mapping</h3>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                cursor={{fill: '#f8fafc'}}
              />
              <Bar dataKey="count" fill="#001736" radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
