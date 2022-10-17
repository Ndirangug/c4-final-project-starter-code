import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.TODOS_ID_INDEX,) { }


    async fetchTodos(): Promise<TodoItem[]> {
        console.log('Getting all todos')

        const result = await this.docClient.query({
            TableName: this.todosTable
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async fetchTodo(id: string): Promise<TodoItem> {
        console.log('Getting todo with id ', id)

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: `todoId = :${id}`,
            Limit: 1,
        }).promise()

        const items = result.Items

        return items[0] as TodoItem
    }

    async updateTodo(id: string, todo: UpdateTodoRequest): Promise<TodoUpdate> {
        console.log(`Updating todo with id ${id} with data: `, todo)
        const result = await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId: id
            },
            ReturnValues: "ALL_NEW"
        }).promise()

        return result.Attributes as TodoUpdate
    }

    async deleteTodo(id: string): Promise<boolean> {
        const result = await this.docClient.delete({ TableName: this.todosTable, Key: { todoId: id } }).promise()
        const isSuccess = !!result.$response.error

        console.log(`deleted successfully id todo with id ${id} `, isSuccess)
        return isSuccess
    }

    async createTodo(todo: CreateTodoRequest): Promise<TodoItem> {
        const result = await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()

        return result.$response.data as TodoItem
    }
}


function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}
