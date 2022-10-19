import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
//import { getUserId } from '../utils'

import { createLogger } from "../../utils/logger";

const logger = createLogger('UpdateTodos');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)


    try {
      //const userId = getUserId(event)
      const result = await updateTodo(todoId, updatedTodo)

      return {
        statusCode: 200, headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }, body: JSON.stringify(result)
      }

    } catch (error) {
      logger.error(error)
      return {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        statusCode: 500,
        body: JSON.stringify(error)
      }
    }
  }
);

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
      origin: '*'
    })
  )
