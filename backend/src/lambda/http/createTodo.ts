import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import { createLogger } from "../../utils/logger";

const logger = createLogger('CreateTodo');

// export const handler = middy(
 export const handler =  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    //  Implement creating a new TODO item
    try {
      const userId = getUserId(event)
      const result = await createTodo({ ...newTodo, userId })

      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
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
//);

// handler
//   .use(httpErrorHandler())
//   .use(
//     cors({
//       credentials: true,
//       origin: '*'
//     })
//   )