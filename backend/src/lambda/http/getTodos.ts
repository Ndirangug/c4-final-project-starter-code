import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { fetchTodos as getTodosForUser } from '../../helpers/todos'
import { getUserId } from '../utils';

import { createLogger } from "../../utils/logger";

const logger = createLogger('GetTodos');
// Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here

    try {
      const userId = getUserId(event)
      const result = await getTodosForUser(userId)

      return { statusCode: 200, body: JSON.stringify(result) }

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