import { Todo } from '../types';

interface Props {
  currentFilter: 'all' | 'active' | 'completed';
  setFilter: (f: 'all' | 'active' | 'completed') => void;
  todos: Todo[];
}

export function TodoFilter({ currentFilter, setFilter, todos }: Props) {
  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 text-sm text-slate-400 gap-4 pb-4 border-b border-slate-800">
      <span data-testid="todo-count" className="font-medium text-cyan-400/70">
        [{activeCount}] processo(s) pendente(s)
      </span>
      <div className="flex gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800">
        {(['all', 'active', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md transition-all ${currentFilter === f ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
            data-testid={`filter-${f}`}
          >
            {f === 'all' ? 'Todas' : f === 'active' ? 'Pendentes' : 'Concluídas'}
          </button>
        ))}
      </div>
    </div>
  );
}