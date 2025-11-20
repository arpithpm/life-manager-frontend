import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todos";
import type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  Priority,
  Category,
} from "../types";
import TodoItem from "../components/TodoItem";
import "../styles/TodoPage.css";

const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [sortBy, setSortBy] = useState<"date" | "priority" | "title">("date");

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "MEDIUM" as Priority,
    category: "PERSONAL" as Category,
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoApi.getAllTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch todos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const request: CreateTodoRequest = {
        title: formData.title,
        description: formData.description || undefined,
        dueDate: formData.dueDate || undefined,
        priority: formData.priority,
        category: formData.category,
      };
      const newTodo = await todoApi.createTodo(request);
      setTodos([newTodo, ...todos]);
      resetForm();
      setError(null);
    } catch (err) {
      setError("Failed to create todo");
      console.error(err);
    }
  };

  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo) return;

    try {
      const request: UpdateTodoRequest = {
        title: formData.title,
        description: formData.description || undefined,
        dueDate: formData.dueDate || undefined,
        priority: formData.priority,
        category: formData.category,
      };
      const updatedTodo = await todoApi.updateTodo(editingTodo.id, request);
      setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
      resetForm();
      setError(null);
    } catch (err) {
      setError("Failed to update todo");
      console.error(err);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const updatedTodo = await todoApi.toggleTodoCompletion(id);
      setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
      setError(null);
    } catch (err) {
      setError("Failed to toggle todo");
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;

    try {
      await todoApi.deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete todo");
      console.error(err);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description || "",
      dueDate: todo.dueDate
        ? new Date(todo.dueDate).toISOString().slice(0, 16)
        : "",
      priority: todo.priority,
      category: todo.category,
    });
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      priority: "MEDIUM",
      category: "PERSONAL",
    });
    setEditingTodo(null);
    setIsFormOpen(false);
  };

  const getFilteredTodos = () => {
    let filtered = todos;

    // Apply completion filter
    switch (filter) {
      case "active":
        filtered = filtered.filter((t) => !t.completed);
        break;
      case "completed":
        filtered = filtered.filter((t) => t.completed);
        break;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((t) => t.priority === priorityFilter);
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((t) => t.category === categoryFilter);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "priority": {
          const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case "title":
          return a.title.localeCompare(b.title);
        case "date":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return filtered;
  };

  const filteredTodos = getFilteredTodos();
  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  if (loading) {
    return (
      <div className="todo-page">
        <div className="loading">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="todo-page">
      <div className="todo-header">
        <h1>My Todos</h1>
        <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
          + New Todo
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="todo-stats">
        <div className="stat-item">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.active}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="search-sort-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search todos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "date" | "priority" | "title")
          }
        >
          <option value="date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      {/* Advanced Filters */}
      <div className="advanced-filters">
        <select
          className="filter-select"
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value as Priority | "all")
          }
        >
          <option value="all">All Priorities</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </select>
        <select
          className="filter-select"
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as Category | "all")
          }
        >
          <option value="all">All Categories</option>
          <option value="WORK">Work</option>
          <option value="PERSONAL">Personal</option>
          <option value="SHOPPING">Shopping</option>
          <option value="HEALTH">Health</option>
          <option value="FINANCE">Finance</option>
          <option value="EDUCATION">Education</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div className="todo-filters">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === "active" ? "active" : ""}`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {isFormOpen && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTodo ? "Edit Todo" : "Create New Todo"}</h2>
              <button className="modal-close" onClick={resetForm}>
                ×
              </button>
            </div>
            <form onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  maxLength={200}
                  placeholder="Enter todo title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  maxLength={1000}
                  rows={4}
                  placeholder="Enter todo description (optional)"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="priority">Priority *</label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as Priority,
                      })
                    }
                    required
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as Category,
                      })
                    }
                    required
                  >
                    <option value="WORK">Work</option>
                    <option value="PERSONAL">Personal</option>
                    <option value="SHOPPING">Shopping</option>
                    <option value="HEALTH">Health</option>
                    <option value="FINANCE">Finance</option>
                    <option value="EDUCATION">Education</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="dueDate">Due Date (Optional)</label>
                <input
                  type="datetime-local"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTodo ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <p>No todos found</p>
            {(filter !== "all" ||
              searchQuery ||
              priorityFilter !== "all" ||
              categoryFilter !== "all") && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setFilter("all");
                  setSearchQuery("");
                  setPriorityFilter("all");
                  setCategoryFilter("all");
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              onEdit={handleEditTodo}
              onDelete={handleDeleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoPage;
