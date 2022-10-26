//@ts-nocheck
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { fetchTodos as getTodosForUser } from '../../helpers/todos'
import { getUserId } from '../utils';

import { createLogger } from "../../utils/logger";

const logger = createLogger('GetTodos');
// Get all TODO items for a current user
//const handler = middy(
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Write your code here

  try {
    const userId = getUserId(event)
    const result = await getTodosForUser(userId)
    
    return {
      statusCode: 200,
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
// ).use(httpErrorHandler())
//   .use(
//     cors()
//   )

