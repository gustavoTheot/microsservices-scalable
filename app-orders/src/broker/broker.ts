import amqp from 'amqplib';

if (!process.env.BROKER_URL) {
  throw new Error('BROKER_URL is not defined in the environment variables');
}

const brokerUrl = process.env.BROKER_URL;

// conexão com o RabbitMQ
export const broker = await amqp.connect(brokerUrl);
