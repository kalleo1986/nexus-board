import { useState, useEffect } from 'react';
import { Todo, Status } from './types';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoModal } from './components/TodoModal';
import { MetricsDashboard } from './components/MetricsDashboard';
import { KanbanSquare } from 'lucide-react';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });
  
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      status: 'pending',
      priority: 'medium',
      createdAt: Date.now(),
      checklist: [],
      comments: []
    };
    setTodos([...todos, newTodo]);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, ...updates } : todo));
  };

  const moveTodo = (id: string, newStatus: Status) => {
    updateTodo(id, { status: newStatus });
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    if (editingTodoId === id) setEditingTodoId(null);
  };

  const pendingTodos = todos.filter(t => t.status === 'pending');
  const inProgressTodos = todos.filter(t => t.status === 'in-progress');
  const completedTodos = todos.filter(t => t.status === 'completed');

  const editingTodo = todos.find(t => t.id === editingTodoId);

  return (
    <div className="min-h-screen py-8 px-4 bg-slate-950 text-slate-300 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <KanbanSquare className="text-cyan-400" size={40} />
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-widest">
              NEXUS BOARD
            </h1>
            <p className="text-slate-500 text-sm mt-1">Painel Tático: Métricas em Tempo Real e Drag & Drop</p>
          </div>
        </div>

        {/* Dashboard de Métricas / Telemetria */}
        <MetricsDashboard todos={todos} />

        {/* Input de Novo Card */}
        <div className="max-w-2xl">
          <TodoInput onAdd={addTodo} />
        </div>

        {/* Colunas Kanban com Drag and Drop */}
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