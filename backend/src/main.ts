import dotenv from 'dotenv'
dotenv.config()
import * as MilleFeuille from '@frenchpastries/millefeuille'
import handler from './handler'

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
MilleFeuille.create(handler, { port })
