import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../helpers/todos'

import { createLogger } from "../../utils/logger";

const logger = createLogger('DeleteTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    try {
      const todoId = event.pathParameters.todoId
      const result = await deleteTodo(todoId)
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      }
    } catch (error) {
      logger.error(error)
      return {
        statusCode: 500,
        body: JSON.stringify(error)
      }
    }



  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
