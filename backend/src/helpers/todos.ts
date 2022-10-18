import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

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
    return attachmentUtils.getSignedUrl(todoId)
}