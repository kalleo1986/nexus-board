import { useState } from 'react';
import { Todo, Status } from '../types';
import { TodoItem } from './TodoItem';
import { DatabaseBackup } from 'lucide-react';

interface Props {
  title: string;
  todos: Todo[];
  onMove: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
  type: Status;
}

export function TodoList({ title, todos, onMove, onDelete, onOpen, type }: Props) {
  const [isDragOver, setIsDragOver] = useState(false);

  const getHeaderStyle = () => {
    if (type === 'pending') return 'text-slate-400 border-slate-500/30 bg-slate-900/50 text-slate-300';
    if (type === 'in-progress') return 'text-cyan-400 border-cyan-500/30 bg-cyan-900/50 text-cyan-300';
    return 'text-purple-400 border-purple-500/30 bg-purple-900/50 text-purple-300';
  };

  const headerColors = getHeaderStyle().split(' ');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const todoId = e.dataTransfer.getData('text/plain');
    if (todoId) {
      onMove(todoId, type);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-slate-900/40 rounded-xl border p-4 min-h-[600px] flex flex-col shadow-lg transition-colors duration-200 ${
        isDragOver ? 'border-cyan-500 bg-cyan-950/20 shadow-[0_0_25px_rgba(6,182,212,0.2)]' : 'border-slate-800'
      }`}
      data-testid={`column-${type}`}
    >
      <div className={`flex justify-between items-center pb-3 mb-4 border-b ${headerColors[1]}`}>
        <h2 className={`font-bold tracking-widest text-sm ${headerColors[0]}`}>{title}</h2>
        <span className={`px-2.5 py-1 rounded text-xs font-bold ${headerColors[2]} ${headerColors[3]}`} data-testid={`${type}-count`}>
          {todos.length}
        </span>
      </div>

      {todos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-600 space-y-4" data-testid={`empty-state-${type}`}>
          <DatabaseBackup size={32} className="opacity-20" />
          <p className="font-mono text-xs uppercase tracking-wider">Solte cards aqui</p>
        </div>
      ) : (
        <div className="space-y-3 flex-1" data-testid={`todo-list-${type}`}>
          {todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} onMove={onMove} onDelete={onDelete} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  );
}