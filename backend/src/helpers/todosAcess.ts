import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
    ) { }


    async fetchTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all todos')

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: "userId",
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            Limit: 1,
        }).promise()

        const items = result.Items
        logger.info('items', items)
        return items as TodoItem[]
    }

    async fetchTodo(id: string): Promise<TodoItem> {
        logger.info('Getting todo with id ', id)

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: "todoId",
            KeyConditionExpression: 'todoId = :todoId',
            ExpressionAttributeValues: {
                ':todoId': id
            },
            Limit: 1,
        }).promise()

        const items = result.Items

        return items[0] as TodoItem
    }

    async updateTodo(id: string, todo: UpdateTodoRequest): Promise<void> {
        logger.info(`Updating todo with id ${id} with data: `, todo)
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId: id
            },
            ReturnValues: "ALL_NEW"
        }).promise()

        return
    }

    async deleteTodo(id: string): Promise<void> {
        const result = await this.docClient.delete({ TableName: this.todosTable, Key: { todoId: id } }).promise()
        const isSuccess = !!result.$response.error

        logger.info(`deleted successfully id todo with id ${id} `, isSuccess)
        return
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
