import { todoAccess, TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { TodoUpdate } from '../models/TodoUpdate';

const todoAccess = new TodosAccess()

export async function fetchTodos(userId: string): Promise<TodoItem[]> {
    return todoAccess.fetchTodos(userId)
}

export async function fetchTodo(id: string): Promise<TodoItem> {
    return todoAccess.fetchTodo(id)
}

export async function updateTodo(id: string, todo: UpdateTodoRequest): Promise<void> {
    return todoAccess.updateTodo(id, todo)
}

export async function deleteTodo(id: string): Promise<void> {
    return todoAccess.deleteTodo(id)
}

export async function createTodo(todo: CreateTodoRequest): Promise<TodoItem> {
    return todoAccess.createTodo(todo)
}

export async function uploadTodoImage(todoId: string): Promise<string> {
    return AttachmentUtils.uploadTodoImage(todoId)
}