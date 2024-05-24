import amqplib from 'amqplib'

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672'
const QUEUE = process.env.QUEUE || 'count'
const INTERVAL = process.env.INTERVAL || '1000'
const COUNTER = process.env.COUNT || '2a2f6cd4-92ce-4708-89d4-15387a665b34'

const run = async () => {
  const queue = QUEUE
  console.log('trying to connect to ', RABBITMQ_URL)
  const conn = await amqplib.connect(RABBITMQ_URL)
  const ch2 = await conn.createChannel()

  setInterval(() => {
    console.log('send')
    ch2.sendToQueue(queue, Buffer.from(COUNTER))
  }, parseInt(INTERVAL))
}

run()
