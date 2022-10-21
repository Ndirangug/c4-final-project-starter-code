import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { AttachmentUtils } from '../../helpers/attachmentUtils'
import { createLogger } from "../../utils/logger";

const logger = createLogger('DeleteTodo');

//export const handler = middy(
export const handler =  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    try {
      const attachmentUtils = new AttachmentUtils()
      const uploadUrl = await attachmentUtils.getSignedUrl(todoId)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          uploadUrl
        })
      }
    }
    catch (error) {
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


    return undefined
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
