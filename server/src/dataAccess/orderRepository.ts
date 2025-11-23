import { IOrder, OrderModel } from "../models/Order";

interface AdminOrderListFilter {
  status?: string;
  userId?: string;
  skip?: number;
  limit?: number;
}

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

  async findOrdersByUserId(userId: string): Promise<IOrder[]> {
    return OrderModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.product", "name slug")
      .exec();
  },

  // admin list with optional filters and pagination
  async listAllOrders(filter: AdminOrderListFilter): Promise<IOrder[]> {
    const query: Record<string, any> = {};

    if (filter.status) {
      query.status = filter.status;
    }
    if (filter.userId) {
      query.user = filter.userId;
    }

    const skip = filter.skip ?? 0;
    const limit = filter.limit ?? 50;

    return OrderModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email")
      .populate("items.product", "name slug")
      .exec();
  },

  async updateOrderStatus(id: string, status: string): Promise<IOrder | null> {
    return OrderModel.findByIdAndUpdate(id, { status }, { new: true })
      .populate("user", "name email")
      .populate("items.product", "name slug")
      .exec();
  },

  // overview helpers
  async countAllOrders(): Promise<number> {
    return OrderModel.countDocuments().exec();
  },

  async sumRevenueByPaymentStatus(paymentStatus: string): Promise<number> {
    const result = await OrderModel.aggregate([
      { $match: { paymentStatus } },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]).exec();

    return result[0]?.total ?? 0;
  },

  async findRecentOrders(limit: number): Promise<IOrder[]> {
    return OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user", "name email")
      .populate("items.product", "name slug")
      .exec();
  },
};
