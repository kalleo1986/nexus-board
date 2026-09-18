import { useState, useEffect } from 'react';
import { Todo, Status } from './types';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoModal } from './components/TodoModal';
import { MetricsDashboard } from './components/MetricsDashboard';
import { KanbanSquare, Cloud, CloudOff } from 'lucide-react';
import { supabase } from './lib/supabaseClient';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [isCloudSync, setIsCloudSync] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar dados iniciais do Supabase ou localStorage
  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: true });

        if (error || !data) {
          throw error;
        }

        const mapped: Todo[] = data.map((item: any) => ({
          id: item.id,
          text: item.text,
          status: item.status as Status,
          priority: item.priority,
          createdAt: Number(item.created_at),
          checklist: item.checklist || [],
          comments: item.comments || []
        }));

        setTodos(mapped);
        setIsCloudSync(true);
      } catch (err) {
        console.warn('Fallback para LocalStorage devido a erro no Supabase:', err);
        const saved = localStorage.getItem('todos');
        if (saved) {
          try { setTodos(JSON.parse(saved)); } catch (e) { setTodos([]); }
        }
        setIsCloudSync(false);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Persistir no localStorage como backup offline
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, loading]);

  const addTodo = async (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      status: 'pending',
      priority: 'medium',
      createdAt: Date.now(),
      checklist: [],
      comments: []
    };

    setTodos(prev => [...prev, newTodo]);

    if (isCloudSync) {
      await supabase.from('todos').insert([{
        id: newTodo.id,
        text: newTodo.text,
        status: newTodo.status,
        priority: newTodo.priority,
        created_at: newTodo.createdAt,
        checklist: newTodo.checklist,
        comments: newTodo.comments
      }]);
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, ...updates } : todo));

    if (isCloudSync) {
      const dbUpdates: any = {};
      if (updates.text !== undefined) dbUpdates.text = updates.text;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.checklist !== undefined) dbUpdates.checklist = updates.checklist;
      if (updates.comments !== undefined) dbUpdates.comments = updates.comments;

      await supabase.from('todos').update(dbUpdates).eq('id', id);
    }
  };

  const moveTodo = (id: string, newStatus: Status) => {
    updateTodo(id, { status: newStatus });
  };

  const deleteTodo = async (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    if (editingTodoId === id) setEditingTodoId(null);

    if (isCloudSync) {
      await supabase.from('todos').delete().eq('id', id);
    }
  };

  const pendingTodos = todos.filter(t => t.status === 'pending');
  const inProgressTodos = todos.filter(t => t.status === 'in-progress');
  const completedTodos = todos.filter(t => t.status === 'completed');

  const editingTodo = todos.find(t => t.id === editingTodoId);

  return (
    <div className="min-h-screen py-8 px-4 bg-slate-950 text-slate-300 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <KanbanSquare className="text-cyan-400" size={40} />
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-widest">
                NEXUS BOARD
              </h1>
              <p className="text-slate-500 text-sm mt-1">Nuvem Supabase PostgreSQL + Drag & Drop</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs self-start sm:self-auto bg-slate-900 border-slate-800">
            {isCloudSync ? (
              <>
                <Cloud size={16} className="text-cyan-400 animate-pulse" />
                <span className="text-cyan-400">Nuvem Conectada</span>
              </>
            ) : (
              <>
                <CloudOff size={16} className="text-amber-400" />
                <span className="text-amber-400">Modo Local (Offline)</span>
              </>
            )}
          </div>
        </div>

        {/* Dashboard de Métricas / Telemetria */}
        <MetricsDashboard todos={todos} />

        {/* Input de Novo Card */}
        <div className="max-w-2xl">
          <TodoInput onAdd={addTodo} />
        </div>

        {/* Colunas Kanban */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <TodoList
            title="PENDENTES"
            todos={pendingTodos}
            onMove={moveTodo}
            onDelete={deleteTodo}
            onOpen={(id) => setEditingTodoId(id)}
            type="pending"
          />
          <TodoList
            title="EM ANDAMENTO"
            todos={inProgressTodos}
            onMove={moveTodo}
            onDelete={deleteTodo}
            onOpen={(id) => setEditingTodoId(id)}
            type="in-progress"
          />
          <TodoList
            title="FINALIZADOS"
            todos={completedTodos}
            onMove={moveTodo}
            onDelete={deleteTodo}
            onOpen={(id) => setEditingTodoId(id)}
            type="completed"
          />
        </div>
      </div>

      {editingTodo && (
        <TodoModal 
          todo={editingTodo} 
          onClose={() => setEditingTodoId(null)} 
          onUpdate={(updates) => updateTodo(editingTodo.id, updates)} 
        />
      )}
    </div>
  );
}
export default App;