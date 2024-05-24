import amqplib from 'amqplib'
import { addValue } from './counter/queries'
import { client } from './db'
import { log } from './utils/logger'

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672'
const QUEUE = process.env.QUEUE || 'count'

export const listenRabbit = async () => {
  const queue = QUEUE
  log('trying to connect to ', RABBITMQ_URL)
  const conn = await amqplib.connect(RABBITMQ_URL)

  log('connected to ', RABBITMQ_URL)

  const ch1 = await conn.createChannel()
  await ch1.assertQueue(queue)

  // Listener
  ch1.consume(queue, async msg => {
    if (msg !== null) {
      log('Received:', msg.content.toString())
      const id = msg.content.toString()
      const query = addValue({ id })
      const res = await client.query(query)
      log(res.rows)
    } else {
      log('Consumer cancelled by server')
    }
  })
}
