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
        logger.info(`query params table ${this.todosTable} and userId ${userId}`)
        let result;
        try {
            result = await this.docClient.query({
                TableName: this.todosTable,
                ExpressionAttributeNames: {
                    "#userId": "userId",
                },
                KeyConditionExpression: '#userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                },
            }).promise()

        } catch (err) {
            logger.info(`error querying todos ${err}`, err)
        }

        logger.info('BEOFRE items', result)
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

        let updateExpression = 'set';
        let ExpressionAttributeNames = {};
        let ExpressionAttributeValues = {};
        for (const property in todo) {
            updateExpression += ` #${property} = :${property} ,`;
            ExpressionAttributeNames['#' + property] = property;
            ExpressionAttributeValues[':' + property] = todo[property];
        }


        console.log(ExpressionAttributeNames);


        updateExpression = updateExpression.slice(0, -1);

        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId: id
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: ExpressionAttributeNames,
            ExpressionAttributeValues: ExpressionAttributeValues,
            ReturnValues: "ALL_NEW"
        }).promise()

        return
    }

    async deleteTodo(todoId: string, userId: string): Promise<void> {
        logger.info(`attempt to delete todo with todo id ${todoId} user ${userId} `)
        const result = await this.docClient.delete({ TableName: this.todosTable, Key: { todoId, userId } }).promise()
        const isSuccess = !!result.$response.error

        logger.info(`deleted successfully id todo with id ${todoId} `, isSuccess)
        return
    }

    async createTodo(todo: CreateTodoRequest): Promise<TodoItem> {
        logger.info('Creating todo with data: ', todo)
        const result = await this.docClient.put({
            TableName: this.todosTable,
            Item: { ...todo, todoId: todo.userId + Date.now() }
        }).promise()

        return result.$response.data as TodoItem
    }
}


function createDynamoDBClient() {
    console.log(`Creating a local DynamoDB instance ${process.env.IS_OFFLINE}`)
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}
