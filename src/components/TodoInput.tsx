import { useState } from 'react';
import { Plus } from 'lucide-react';

interface Props {
  onAdd: (text: string) => void;
}

export function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-cyan-500 font-bold">{'>'}</span>
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Descreva o novo card..."
          className="w-full pl-8 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 text-cyan-50 placeholder-slate-500 transition-all shadow-inner"
          data-testid="todo-input"
        />
      </div>
      <button
        type="submit"
        disabled={!text.trim()}
        className="px-6 py-3 bg-cyan-600 text-slate-950 font-bold rounded-lg hover:bg-cyan-500 disabled:opacity-50 flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        data-testid="add-button"
      >
        <Plus size={20} strokeWidth={3} />
        <span className="hidden sm:inline">INSERIR</span>
      </button>
    </form>
  );
}