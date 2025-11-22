import { IOrder, OrderModel } from "../models/Order";

export const orderRepository = {
  async createOrder(data: Partial<IOrder>): Promise<IOrder> {
    const doc = new OrderModel(data);
    return doc.save();
  },

  async findOrderById(id: string): Promise<IOrder | null> {
    return OrderModel.findById(id)
      .populate("user", "name email")
      .populate("items.product", "name slug")
      .exec();
  },

  async findOrderByClientOrderId(
    clientOrderId: string
  ): Promise<IOrder | null> {
    return OrderModel.findOne({ clientOrderId })
      .populate("user", "name email")
      .populate("items.product", "name slug")
      .exec();
  },
};
