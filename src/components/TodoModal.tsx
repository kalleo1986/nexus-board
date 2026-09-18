import { useState } from 'react';
import { Todo, Priority, ChecklistItem } from '../types';
import { X, CheckSquare, MessageSquare, Flag, Plus } from 'lucide-react';

interface Props {
  todo: Todo;
  onClose: () => void;
  onUpdate: (updates: Partial<Todo>) => void;
}

export function TodoModal({ todo, onClose, onUpdate }: Props) {
  const [newChecklist, setNewChecklist] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklist.trim()) return;
    const item: ChecklistItem = { id: crypto.randomUUID(), text: newChecklist.trim(), done: false };
    onUpdate({ checklist: [...todo.checklist, item] });
    setNewChecklist('');
  };

  const toggleChecklist = (id: string) => {
    const updated = todo.checklist.map(c => c.id === id ? { ...c, done: !c.done } : c);
    onUpdate({ checklist: updated });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment = { id: crypto.randomUUID(), text: newComment.trim(), createdAt: Date.now() };
    onUpdate({ comments: [...todo.comments, comment] });
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start p-5 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-xl font-bold text-slate-100 pr-8">{todo.text}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800" data-testid="close-modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
          
          {/* Priority */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-wider">
              <Flag size={16} /> Prioridade
            </div>
            <select 
              value={todo.priority}
              onChange={(e) => onUpdate({ priority: e.target.value as Priority })}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5"
              data-testid="modal-priority"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>

          {/* Checklist */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-wider">
              <CheckSquare size={16} /> Checklist
            </div>
            
            <div className="space-y-2" data-testid="checklist-items">
              {todo.checklist.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded hover:bg-slate-800/50">
                  <input 
                    type="checkbox" 
                    checked={item.done}
                    onChange={() => toggleChecklist(item.id)}
                    className="w-4 h-4 text-cyan-600 bg-slate-800 border-slate-600 rounded focus:ring-cyan-600 focus:ring-2 cursor-pointer"
                  />
                  <span className={`text-sm ${item.done ? 'line-through text-slate-500' : 'text-slate-300'}`}>{item.text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddChecklist} className="flex gap-2">
              <input
                type="text"
                value={newChecklist}
                onChange={(e) => setNewChecklist(e.target.value)}
                placeholder="Adicionar item..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 text-slate-200"
                data-testid="input-checklist"
              />
              <button type="submit" disabled={!newChecklist.trim()} className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-md disabled:opacity-50">
                Adicionar
              </button>
            </form>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-wider">
              <MessageSquare size={16} /> Comentários
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escreva um comentário..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 text-slate-200"
                data-testid="input-comment"
              />
              <button type="submit" disabled={!newComment.trim()} className="bg-cyan-700 hover:bg-cyan-600 text-slate-100 px-3 py-2 rounded-md disabled:opacity-50 flex items-center gap-1">
                <Plus size={16} /> Enviar
              </button>
            </form>

            <div className="space-y-3" data-testid="comments-list">
              {todo.comments.map(comment => (
                <div key={comment.id} className="bg-slate-800/80 rounded-lg p-3 border border-slate-700">
                  <p className="text-sm text-slate-300">{comment.text}</p>
                  <span className="text-[10px] text-slate-500 mt-2 block font-mono">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}