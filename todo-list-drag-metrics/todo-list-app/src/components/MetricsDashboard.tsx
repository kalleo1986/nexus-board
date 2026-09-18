import { Todo } from '../types';
import { Activity, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface Props {
  todos: Todo[];
}

export function MetricsDashboard({ todos }: Props) {
  const total = todos.length;
  const completed = todos.filter(t => t.status === 'completed').length;
  const inProgress = todos.filter(t => t.status === 'in-progress').length;
  const pending = todos.filter(t => t.status === 'pending').length;
  const highPriority = todos.filter(t => t.priority === 'high' && t.status !== 'completed').length;

  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="metrics-dashboard">
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-4 shadow-md">
        <div className="p-3 bg-cyan-950/60 text-cyan-400 rounded-lg border border-cyan-800/40">
          <Activity size={22} />
        </div>
        <div>
          <span className="text-xs text-slate-500 uppercase tracking-wider block">Conclusão Total</span>
          <span className="text-xl font-bold text-slate-100">{completionRate}%</span>
          <div className="w-24 bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-cyan-400 h-full transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-4 shadow-md">
        <div className="p-3 bg-blue-950/60 text-blue-400 rounded-lg border border-blue-800/40">
          <Clock size={22} />
        </div>
        <div>
          <span className="text-xs text-slate-500 uppercase tracking-wider block">Em Execução</span>
          <span className="text-xl font-bold text-blue-400">{inProgress}</span>
          <span className="text-[10px] text-slate-500 font-mono block">de {total} processos</span>
        </div>
      </div>

      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-4 shadow-md">
        <div className="p-3 bg-purple-950/60 text-purple-400 rounded-lg border border-purple-800/40">
          <CheckCircle2 size={22} />
        </div>
        <div>
          <span className="text-xs text-slate-500 uppercase tracking-wider block">Finalizados</span>
          <span className="text-xl font-bold text-purple-400">{completed}</span>
          <span className="text-[10px] text-slate-500 font-mono block">{pending} aguardando</span>
        </div>
      </div>

      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-4 shadow-md">
        <div className="p-3 bg-red-950/60 text-red-400 rounded-lg border border-red-800/40">
          <AlertTriangle size={22} />
        </div>
        <div>
          <span className="text-xs text-slate-500 uppercase tracking-wider block">Prioridade Alta</span>
          <span className={`text-xl font-bold ${highPriority > 0 ? 'text-red-400' : 'text-slate-400'}`}>{highPriority}</span>
          <span className="text-[10px] text-slate-500 font-mono block">críticos pendentes</span>
        </div>
      </div>
    </div>
  );
}