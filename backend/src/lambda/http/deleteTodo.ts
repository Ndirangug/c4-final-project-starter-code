//@ts-nocheck
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../helpers/todos'

import { createLogger } from "../../utils/logger";

const logger = createLogger('DeleteTodo');

// export const handler = middy(
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  try {
    const todoId = event.pathParameters.todoId
    const result = await deleteTodo(todoId)
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 200,
      body: JSON.stringify(result)
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
//)

// handler
//   .use(httpErrorHandler())
//   .use(
//     cors({
//       credentials: true,
//       origin: '*'
//     })
//   )
