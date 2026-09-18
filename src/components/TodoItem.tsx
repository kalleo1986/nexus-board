import { Todo, Status } from '../types';
import { Trash2, MessageSquare, CheckSquare, ArrowRight, ArrowLeft, Flag, GripVertical } from 'lucide-react';

interface Props {
  todo: Todo;
  onMove: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}

export function TodoItem({ todo, onMove, onDelete, onOpen }: Props) {
  const completedChecklist = todo.checklist.filter(c => c.done).length;
  const hasChecklist = todo.checklist.length > 0;
  const hasComments = todo.comments.length > 0;

  const priorityColors = {
    low: 'text-slate-500',
    medium: 'text-blue-400',
    high: 'text-red-400'
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', todo.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      className={`group relative flex flex-col p-4 rounded-lg border transition-all duration-200 shadow-md hover:shadow-lg bg-slate-800 border-slate-700 hover:border-cyan-500/50 cursor-grab active:cursor-grabbing ${
        todo.status === 'completed' ? 'opacity-60 hover:opacity-100' : ''
      }`}
      onClick={() => onOpen(todo.id)}
      data-testid="todo-item"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <GripVertical size={14} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
          <Flag size={14} className={priorityColors[todo.priority]} />
          <span className="text-[10px] font-mono text-slate-500">ID: {todo.id.split('-')[0]}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}
          className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
          data-testid="delete-button"
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      <span className={`text-sm font-sans leading-relaxed mb-4 ${todo.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-200'}`} data-testid="todo-text">
        {todo.text}
      </span>

      <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-700/50">
        <div className="flex gap-3 text-xs text-slate-400">
          {hasChecklist && (
            <div className="flex items-center gap-1" title="Checklist" data-testid="badge-checklist">
              <CheckSquare size={14} className={completedChecklist === todo.checklist.length ? 'text-green-400' : ''} />
              <span>{completedChecklist}/{todo.checklist.length}</span>
            </div>
          )}
          {hasComments && (
            <div className="flex items-center gap-1" title="Comentários" data-testid="badge-comments">
              <MessageSquare size={14} />
              <span>{todo.comments.length}</span>
            </div>
          )}
        </div>

        {/* Setas auxiliares mantidas para agilidade rápida */}
        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
          {todo.status !== 'pending' && (
            <button 
              onClick={() => onMove(todo.id, todo.status === 'completed' ? 'in-progress' : 'pending')}
              className="p-1.5 bg-slate-700/50 hover:bg-slate-600 rounded text-slate-300"
              data-testid="move-left"
              title="Voltar etapa"
            >
              <ArrowLeft size={14} />
            </button>
          )}
          {todo.status !== 'completed' && (
            <button 
              onClick={() => onMove(todo.id, todo.status === 'pending' ? 'in-progress' : 'completed')}
              className="p-1.5 bg-cyan-900/50 hover:bg-cyan-800 rounded text-cyan-300"
              data-testid="move-right"
              title="Avançar etapa"
            >
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}