import { response, internalError } from '@frenchpastries/millefeuille/response'
import * as Arrange from '@frenchpastries/arrange'
import {
  get,
  notFound,
  context,
  routes,
  Middleware,
} from '@frenchpastries/assemble'
import { connect } from './db'
import { listenRabbit } from './queue'
import { counterContext } from './counter'
import { log } from './utils/logger'
import { onRequest } from './middleware/logger'

connect()

listenRabbit()

const handler = routes([
  get('/', async () => response('ok')),
  get('/routes', async () => response(handler.routes())),
  counterContext,
  notFound(async () => ({ statusCode: 404 })),
])

export const origin = () => {
  log(process.env.FRONT_HOSTNAME)
  if (process.env.FRONT_HOSTNAME) {
    return process.env.FRONT_HOSTNAME
  } else {
    return 'http://localhost:5173'
  }
}

const catchErrors: Middleware = handler => async request => {
  try {
    return await handler(request)
  } catch (error) {
    return internalError(JSON.stringify(error))
  }
}

const withCatch = catchErrors(handler)
const withLogger = onRequest(withCatch)
const withJSONOut = Arrange.json.response(withLogger)
const withJSONIn = Arrange.json.parse(withJSONOut)
const withCors = Arrange.cors.origin(withJSONIn, origin())

console.log('--> Routes: ', handler.routes())

export default withCors
