"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTodoSchema } from '@/app/schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

import { hc } from "hono/client";
import type { AppType } from "@/app/api/[[...route]]/route";
import { useSession } from '@hono/auth-js/react';

export const client = hc<AppType>("/");

interface Todo {
  id: number;
  description: string;
  userId: string;
  completed: boolean | null;
  createdAt: string | null;
}

interface TodoFormData {
  description: string;
}

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();

  const fetchTodos = useCallback(async () => {
    if (!session) return;
    try {
      const response = await client.api.todos.$get();
      const data: Todo[] | { error: string } = await response.json();
      if ('error' in data) {
        console.error('Error fetching todos:', data.error);
        return;
      }
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchTodos();
    }
  }, [session, fetchTodos]);

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const form = useForm<TodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      description: "",
    },
  });

  const addTodo = async (data: TodoFormData) => {
    if (!session) return;
    try {
      await client.api.todos.$post({
        json: { description: data.description }
      });
      form.reset();
      fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const startEditing = (id: number) => {
    setEditingId(id);
  };

  const finishEditing = async (id: number, newDescription: string) => {
    if (!session) return;
    try {
      await client.api.todos[':id'].$put({
        param: { id: id.toString() },
        json: { description: newDescription }
      });

      setEditingId(null);
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    if (!session) return;
    try {
      await client.api.todos[':id'].toggle.$put({
        param: { id: id.toString() },
        json: { id, completed: !completed }
      });
      fetchTodos();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    if (!session) return;
    try {
      await client.api.todos[':id'].$delete({
        param: { id: id.toString() },
      });
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  if (!session) {
    return null; // or a loading indicator
  }

  return (
    <div className="w-full max-w-3xl pb-16 mx-auto mt-10">
      <h1 className="mb-4 text-2xl font-bold">Todo List</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(addTodo)} className="flex items-start gap-2 mb-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="タスクを追加"
                    className="w-full p-2 border rounded"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button type="submit" className="self-start px-4 py-2 text-white bg-blue-500 rounded">
            Add Todo
          </button>
        </form>
      </Form>
      <ul className="w-full">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between w-full p-2 mb-2 border-b">
            <div className="flex items-center flex-grow">
              <Checkbox
                checked={todo.completed ?? false}
                onCheckedChange={() => toggleTodo(todo.id, todo.completed ?? false)}
                className="mr-2"
              />
              {editingId === todo.id ? (
                <Input
                  ref={editInputRef}
                  type="text"
                  defaultValue={todo.description}
                  onBlur={(e) => finishEditing(todo.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      finishEditing(todo.id, e.currentTarget.value);
                    }
                  }}
                  className="flex-grow"
                />
              ) : (
                <span
                  className={`flex-grow cursor-pointer ${todo.completed ? 'line-through' : ''}`}
                  onClick={() => startEditing(todo.id)}
                  onKeyDown={(e) => e.key === 'Enter' && startEditing(todo.id)}
                  tabIndex={0}
                  role="button"
                >
                  {todo.description}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => deleteTodo(todo.id)}
              className="ml-2 text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
