// toda vez que um pedido for criado

export interface OrderCreatedMessage {
  orderId: string
  customer: {
    id: string
  }
  amount: number
}