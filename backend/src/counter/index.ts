import { get, post, patch, context } from '@frenchpastries/assemble'
import {
  createCounterHandler,
  deleteCounterHandler,
  getCounterHandler,
  addCounterHandler,
  resetCounterHandler,
  listCounter,
} from './handlers'

export const counterContext = context('/count', [
  get('/', listCounter),
  context('/:id', [
    get('/', getCounterHandler),
    post('/add', addCounterHandler),
    post('/reset', resetCounterHandler),
  ]),
  post('/create', createCounterHandler),
  patch('/delete', deleteCounterHandler),
])
