import { response, forbidden } from '@frenchpastries/millefeuille/response'
import {
  selectById,
  create,
  list,
  addValue,
  resetCounter,
  deleteCounter,
} from './queries'
import { IncomingRequest } from '@frenchpastries/millefeuille'
import { log } from '../utils/logger'
import { client } from '../db'
import { CounterInfo } from './types'
let cpt = 0

const getCounter = async ({ id }: { id: string }) => {
  log({ id })
  const query = selectById(id)
  const { rows } = await client.query(query)
  log(rows)
  if (rows.length === 1) return { ...rows[0], cpt }
  else return null
}

export const listCounter = async (request: IncomingRequest) => {
  const query = list()
  const res = await client.query(query)
  const counterRows = res.rows

  return response(counterRows)
}

export const createCounterHandler = async (request: IncomingRequest) => {
  const id = request.context.id
  const query = create({ id })
  const res = await client.query(query)
  const counterRows = res.rows
  if (counterRows && counterRows.length > 0) {
    const counter = counterRows[0]
    return response(counter)
  }
  return response(null)
}

export const getCounterHandler = async (request: IncomingRequest) => {
  const id = request.context.id
  if (id && typeof id === 'string') {
    return response(await getCounter({ id }))
  } else {
    return forbidden('no id')
  }
}

export const resetCounterHandler = async (request: IncomingRequest) => {
  const id = request.context.id
  if (id) {
    const query = resetCounter({ id })
    const res = await client.query(query)
    const counterRows = res.rows
    if (counterRows && counterRows.length > 0) {
      const counter = counterRows[0]
      return response(counter)
    }
    return response(null)
  } else return forbidden('no id')
}
export const addCounterHandler = async (request: IncomingRequest) => {
  cpt++
  const id = request.context.id
  if (id) {
    // await client.query('BEGIN')
    const query = addValue({ id })
    const res = await client.query(query)
    // await client.query('COMMIT')
    const counterRows = res.rows
    if (counterRows && counterRows.length > 0) {
      const counter = counterRows[0]
      return response(counter)
    }
    return response(null)
  } else return forbidden('no id')
}

export const deleteCounterHandler = async (request: IncomingRequest) => {
  const id = request.context.id
  if (id) {
    const query = deleteCounter({ id })
    const res = await client.query(query)
    const counterRows = res.rows
    if (counterRows && counterRows.length > 0) {
      const counter = counterRows[0]
      return response(counter)
    }
    return response(null)
  } else return forbidden('no id')
}
