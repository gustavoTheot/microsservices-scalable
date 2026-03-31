/*
  Utiliza o padrão publisher-subscriber para lidar com eventos de mensagens
  O rabbitmq e o kafka salvam as mensagens em filas, e os consumidores podem ler essas mensagens de forma assíncrona.
  O publisher-subscriber é um padrão de design de software que permite que os componentes se comuniquem de forma assíncrona, onde os publishers enviam mensagens para um tópico e os subscribers se inscrevem nesse tópico para receber as mensagens.
*/

import { orders } from "./channels/orders.ts";

orders.consume('orders', async message => {
  if (!message) {
    return null;
  }

  try {
    // O conteúdo vem em buffer; converte para string e JSON antes de processar
    const payload = JSON.parse(message.content.toString());

    console.log('[Invoices] Received message:', payload);

    // TODO: processar regra de negócio de invoices aqui

    // Como noAck=false, o ack manual finaliza o processamento da mensagem
    orders.ack(message);
  } catch (error) {
    console.error('[Invoices] Failed to process message:', {
      error,
      rawMessage: message.content.toString(),
    });

    // Descarta a mensagem inválida para evitar loop infinito de reprocessamento
    orders.nack(message, false, false);
  }
}, {
  /* 
    acknowledge => reconhecer, identificar que a mensagem foi reconhecida com sucesso,
    mas não quero que ele verifique auomatica se a mensagem foi recebida com sucesso do segundo params paassado nesse consume
  */
  noAck: false
})