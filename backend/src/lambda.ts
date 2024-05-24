//@ts-nocheck
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import { log } from './utils/logger'
import handler, { origin } from './handler'

export const main = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  log(event)
  event.location = new URL(event.rawPath, origin())
  if (!event.method) event.method = event.requestContext.http.method
  const res = (await handler(event)) || {}
  log(JSON.stringify(res))
  res.multiValueHeaders = {
    'Access-Control-Allow-Origin': res.headers['Access-Control-Allow-Origin'],
  }
  delete res.headers['Access-Control-Allow-Origin']
  if (!res.body) res.body = ''
  return res
}
