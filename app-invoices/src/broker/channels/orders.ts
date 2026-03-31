// criação de um canal

import { broker } from '../broker.ts';

export const orders = await broker.createChannel();

// nomeando a fila
await orders.assertQueue('orders');
