import { IncomingRequest } from '@frenchpastries/millefeuille'
import { Handler } from '@frenchpastries/assemble'
import chalk from 'chalk'

const strDate = () => {
  const date = new Date()
  return date.toISOString()
}

export const arrow = () => {
  const message = [`[${strDate()}]`, '-----> '].join(' ')
  return chalk.bold.grey(message)
}

export const log = (...message: any) => {
  console.log(arrow(), ...message)
}

const colorError = (value: string | Error) => {
  if (typeof value === 'string') {
    return chalk.bold.red(value)
  } else if (value instanceof Error) {
    return chalk.bold.red(value.stack)
  } else {
    return value
  }
}

export const warn = (...message: any) => {
  console.log(arrow(), ...message.map(colorError))
}

export const prependBlock = (json: string) => {
  const [first, ...rest] = json.split('\n')
  const r = rest.map(t => `${arrow()}   ${t}`)
  return [first, ...r].join('\n')
}

const bodyToString = (request: IncomingRequest) => {
  const { method } = request
  const colorBody = () => prependBlock(JSON.stringify(request.body, null, 2))
  const str = method !== 'GET' ? `  request.body = ${colorBody()}` : ''
  return chalk.bold.yellow(str)
}

const selectStatusCodeColor = (statusCode: number) => {
  const int = Math.floor(statusCode / 100)
  switch (int) {
    case 1:
    case 2:
      return '#01FF70'
    case 3:
      return '#F012BE'
    case 4:
      return '#FF851B'
    case 5:
      return '#FF4136'
    default:
      return '#FFFFFF'
  }
}

const selectCustomClaimStatus = async (request: IncomingRequest) => {
  if (process.env.NODE_ENV === 'development' || process.env.VERBOSE) {
    const status = request.authorized ? 'user' : 'disconnected'
    return [',', chalk.yellowBright(status)].join(' ')
  } else {
    return ''
  }
}

type Log = { type: 'log'; message: any } | { type: 'warn'; message: any }
const generateLogger = () => {
  const log = function (...message: any) {
    // @ts-expect-errors
    this._data.push({ type: 'log', message })
  }
  const warn = function (...message: any) {
    // @ts-expect-errors
    this._data.push({ type: 'warn', message })
  }
  const logger = { _data: [], log, warn }
  logger.log = log.bind(logger)
  logger.warn = warn.bind(logger)
  return logger
}

export const onRequest = <Body>(handler: Handler<Body, string>) => {
  return async (request: IncomingRequest<Body>) => {
    request.logger = generateLogger()
    const result = await handler(request)
    const pathname = request.location?.pathname
    if (pathname) {
      const body = bodyToString(request)
      const prefix = `${request.method?.toLowerCase()}#${chalk.white(pathname)}`
      const { statusCode } = result
      const loggedState = await selectCustomClaimStatus(request)
      const color = selectStatusCodeColor(statusCode)
      const codeStatus = chalk.hex(color)(`[${statusCode}${loggedState}]`)
      console.log(arrow(), codeStatus, chalk.bold.grey(`[${prefix}]`))
      request.logger._data.forEach((logs: Log) => {
        if (logs.type === 'log') log(...logs.message)
        if (logs.type === 'warn') warn(...logs.message)
      })
      if (request.method !== 'GET') console.log(arrow(), body)
      if (process.env.VERBOSE) {
        const title = chalk.bold.yellow('response.body =')
        const parsed = result.body ? JSON.parse(result.body) : null
        const body = prependBlock(JSON.stringify(parsed, null, 2))
        console.log(arrow(), `  ${title} ${body}`)
      }
    }
    return result
  }
}
