import { IOrder } from "../models/Order";
import { orderRepository } from "../dataAccess/orderRepository";

export const orderService = {
  async createOrder(data: Partial<IOrder>): Promise<IOrder> {
    return orderRepository.createOrder(data);
  },

  async getOrderById(id: string): Promise<IOrder | null> {
    return orderRepository.findOrderById(id);
  },

  async getOrderByClientOrderId(clientOrderId: string): Promise<IOrder | null> {
    return orderRepository.findOrderByClientOrderId(clientOrderId);
  },
};
