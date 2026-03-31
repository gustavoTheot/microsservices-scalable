import "@opentelemetry/auto-instrumentations-node/register"
import { trace } from "@opentelemetry/api"

import fastify from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { 
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { db } from '../db/client.ts'
import { schema } from '../db/schema/index.ts'
import { dispatchOrderCreated } from '../broker/messages/order-created.ts'
import z from 'zod'
import { setTimeout } from 'node:timers/promises'
import { tracer } from "../tracer/tracer.ts"

export const app = fastify()

app.register(fastifyCors, {
  origin: '*'
})
app.withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

/*
  Health check utilizado para:
  - Verificar se o serviço está rodando
  - Monitoramento de saúde do serviço
  - Verificar a conectividade com o serviço

  Utilizado em:
  - Escalonamento horizontal: quando se faz escalonamento horizonatal e sem tem novas máquina nodando na aplicação e para o loadbalance entender que pode mandar tráfego para a nova máquina, é necessário que o serviço esteja saudável, ou seja, respondendo a requisições de saúde.


  - Deploy: blue-green deployment: quando se tem uma nova versão do serviço e quer fazer o deploy sem downtime, é necessário que o serviço esteja saudável para que o tráfego seja redirecionado para a nova versão do serviço. Sendo assim, é verificado se a nova versão está ok, para poder matar a versão antiga do serviço.
*/
app.get('/health', (request, reply) => {
  return reply.send({
    status: 'ok'
  })
})

app.post('/orders', {
  schema: {
    body: z.object({
      amount: z.coerce.number(),
    })
  }
}, async (request, reply) => {
  const { amount } = request.body

  console.log('[Orders] Creating order with amount:', amount)

  const orderId = crypto.randomUUID()

  await db.insert(schema.orders).values({
    id: orderId,
    customerId: '4d3f4a34-54ee-4ba8-8f67-bd3bb7a12b66',
    amount
  })

  // cria um span para medir o tempo de execução da criação do pedido, e verificar se tem algum problema nessa parte do código
  const span = tracer.startSpan('talvez aqui esteja dando merda')

  span.setAttribute('test', 'testando span')
  await setTimeout(2000)

  // finaliza o span, ou seja, para de medir o tempo de execução da criação do pedido
  span.end()
  

  // adição de informação dentro do span do trace
  trace.getActiveSpan()?.setAttribute('order.id', orderId)

  dispatchOrderCreated({
    orderId,
    customer: {
      id: '4d3f4a34-54ee-4ba8-8f67-bd3bb7a12b66'
    },
    amount
  })

  return reply.status(201).send({
    message: 'Order created successfully'
  })
})


app.listen({ 
  port: 3333, 
  host: '0.0.0.0' 
}).then(() => {
  console.log('[Orders] HTTP server running on http://localhost:3333')
})