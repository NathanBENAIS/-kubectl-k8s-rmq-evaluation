import { Client } from 'pg'
import { log, error } from './utils/logger'

log({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  password: process.env.PGPASSWORD,
})

export const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : undefined,
  password: process.env.PGPASSWORD,
  ssl: false,
})

export const connect = async () => {
  return client
    .connect()
    .then(() => console.log('Postgres: Connection success'))
    .catch(err => {
      const add = err.address + ':' + err.port
      const msg = `Postgres: Connection refused to ${add}: ${err.message}`
      error(msg)
    })
}

export const end = async () => {
  await client.end()
}
