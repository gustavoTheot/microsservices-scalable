import "@opentelemetry/auto-instrumentations-node/register"

import '../broker/subscriber.ts'

import fastify from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { 
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'


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

app.listen({ 
  port: 3334, 
  host: '0.0.0.0' 
}).then(() => {
  console.log('[Invoices] HTTP server running on http://localhost:3334')
})