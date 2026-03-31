# Contratos

Ponto de verdade entre todos os serviços de quais dados estão trafegando entre os microsserviços

Ele ***não tem a ver com a aplicação em si***. O real motivo da sua existencia, é para menssageria, servindo para ficar um contrato do que aquele broker receber como props para enviar a mensagem

Exemplo:
```ts
import { channels } from "../channels/index.ts";
import type { OrderCreatedMessage } from "../../../../contracts/messages/order-created-message.ts"

export function dispatchOrderCreated(data: OrderCreatedMessage){
  channels.orders.sendToQueue('orders', Buffer.from(JSON.stringify(data)))
}
```
