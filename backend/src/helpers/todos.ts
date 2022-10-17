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

export function fetchTodos(): Promise<TodoItem[]> {
    return todoAccess.fetchTodos()
}

export function fetchTodo(id: string): Promise<TodoItem> {
    return todoAccess.fetchTodo(id)
}

export function updateTodo(id: string, todo: UpdateTodoRequest): Promise<TodoUpdate> {
    return todoAccess.updateTodo(id, todo)
}

export function deleteTodo(id: string): Promise<boolean> {
    return todoAccess.deleteTodo(id)
}

export function createTodo(todo: CreateTodoRequest): Promise<TodoItem> {
    return todoAccess.createTodo(todo)
}

export function uploadTodoImage(todoId: string): Promise<string> {
    return AttachmentUtils.uploadTodoImage(todoId)
}