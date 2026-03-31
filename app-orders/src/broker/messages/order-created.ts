// Quais mensagens esse serviço expõe para outros serviços

import { channels } from "../channels/index.ts";
import type { OrderCreatedMessage } from "../../../../contracts/messages/order-created-message.ts"

export function dispatchOrderCreated(data: OrderCreatedMessage){
  // envia para fila de order e ela é trafegada através do buffer (representação binária de alguma string, hexadecimal, etc) e é necessário transformar o objeto em string para poder trafegar pela fila, e depois transformar a string em objeto novamente para poder utilizar os dados.
  channels.orders.sendToQueue('orders', Buffer.from(JSON.stringify(data)))
}