import { Calendar, MessageSquare, History, CheckCircle2, GripVertical, Clock } from 'lucide-react';

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  date?: string;
  assignees: string[];
  progress?: number;
  comments?: number;
  completed?: boolean;
  statusText?: string;
  onClick?: () => void;
}

export default function TaskCard({
  title,
  description,
  priority,
  date,
  assignees,
  progress,
  comments,
  completed,
  statusText,
  onClick,
}: TaskCardProps) {
  const priorityStyles = {
    High: 'bg-[#5e0022] text-[#ffb2be]',
    Medium: 'bg-[#c6e4f4] text-[#4a6774]',
    Low: 'bg-[#e1e3e4] text-[#43474f]',
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-[1.25rem] shadow-[0_8px_24px_rgba(0,23,54,0.04)] border border-transparent hover:border-primary/10 transition-all group cursor-pointer ${completed ? 'opacity-80' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md ${priorityStyles[priority]}`}>
          {priority}
        </span>
        {!completed && (
          <GripVertical size={18} className="text-outline-variant/30 group-hover:text-primary/40 transition-colors" />
        )}
        {completed && (
          <CheckCircle2 size={18} className="text-green-500 fill-green-50" />
        )}
      </div>

      <h4 className={`font-bold text-primary mb-2 leading-snug text-[15px] ${completed ? 'line-through opacity-50' : ''}`}>
        {title}
      </h4>
      <p className="text-[13px] text-on-surface-variant/80 mb-5 line-clamp-2 leading-relaxed">
        {description}
      </p>

      {progress !== undefined && (
        <div className="mb-5">
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-700 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/5">
        <div className="flex items-center gap-1.5 text-on-surface-variant/60 text-[11px] font-bold">
          {completed ? (
            <span className="text-green-600">Completed {date}</span>
          ) : statusText ? (
            <>
              <Clock size={14} className="text-primary/40" />
              {statusText}
            </>
          ) : comments !== undefined ? (
            <>
              <MessageSquare size={14} className="text-primary/40" />
              {comments} comments
            </>
          ) : (
            <>
              <Calendar size={14} className={priority === 'High' ? 'text-red-400' : 'text-primary/40'} />
              <span className={priority === 'High' ? 'text-red-500' : ''}>{date}</span>
            </>
          )}
        </div>
        
        <div className="flex -space-x-2">
          {assignees.length > 0 ? (
            assignees.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Assignee"
                className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
                referrerPolicy="no-referrer"
              />
            ))
          ) : (
            <div className="w-7 h-7 rounded-full bg-surface-container-high border-2 border-white flex items-center justify-center text-[8px] font-bold text-on-surface-variant/40">
              JD
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
