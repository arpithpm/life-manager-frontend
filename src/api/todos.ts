import apiClient from "./client";
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from "../types";

export const todoApi = {
  // Get all todos
  getAllTodos: async (completed?: boolean): Promise<Todo[]> => {
    const params = completed !== undefined ? { completed } : {};
    const response = await apiClient.get("/api/todos", { params });
    return response.data;
  },

  // Get a single todo by ID
  getTodoById: async (id: string): Promise<Todo> => {
    const response = await apiClient.get(`/api/todos/${id}`);
    return response.data;
  },

  // Create a new todo
  createTodo: async (data: CreateTodoRequest): Promise<Todo> => {
    const response = await apiClient.post("/api/todos", data);
    return response.data;
  },

  // Update a todo
  updateTodo: async (id: string, data: UpdateTodoRequest): Promise<Todo> => {
    const response = await apiClient.put(`/api/todos/${id}`, data);
    return response.data;
  },

  // Toggle todo completion status
  toggleTodoCompletion: async (id: string): Promise<Todo> => {
    const response = await apiClient.patch(`/api/todos/${id}/toggle`);
    return response.data;
  },

  // Delete a todo
  deleteTodo: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/todos/${id}`);
  },
};
