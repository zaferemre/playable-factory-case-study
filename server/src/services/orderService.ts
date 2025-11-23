// src/services/orderService.ts
import { IOrder } from "../models/Order";
import { orderRepository } from "../dataAccess/orderRepository";
import { ProductModel } from "../models/Product";
import { UserModel } from "../models/User";

interface GetAllOrdersOptions {
  status?: string;
  userId?: string;
  limit?: number;
  page?: number;
}

export const orderService = {
  async createOrder(data: Partial<IOrder>): Promise<IOrder> {
    // 1 create order as before
    const order = await orderRepository.createOrder(data);

    // 2 decrease product stock based on ordered quantities
    // best effort, we do not block order if some products are missing
    const updates = order.items.map((item) => {
      const productId = item.product; // this is an ObjectId

      return ProductModel.updateOne(
        { _id: productId },
        {
          // simple decrement, you can make this more strict later
          $inc: { stockQuantity: -item.quantity },
        }
      ).exec();
    });

    await Promise.all(updates).catch((err) => {
      console.error("Failed to update product stock after order", err);
    });

    return order;
  },

  async getOrderById(id: string): Promise<IOrder | null> {
    return orderRepository.findOrderById(id);
  },

  async getOrderByClientOrderId(clientOrderId: string): Promise<IOrder | null> {
    return orderRepository.findOrderByClientOrderId(clientOrderId);
  },

  async getOrdersForUser(userId: string): Promise<IOrder[]> {
    return orderRepository.findOrdersByUserId(userId);
  },

  // admin list with filters
  async getAllOrders(options: GetAllOrdersOptions): Promise<IOrder[]> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 50;
    const skip = (page - 1) * limit;

    return orderRepository.listAllOrders({
      status: options.status,
      userId: options.userId,
      skip,
      limit,
    });
  },

  async updateOrderStatus(id: string, status: string): Promise<IOrder | null> {
    return orderRepository.updateOrderStatus(id, status);
  },

  async getOrdersOverview() {
    const [
      ordersCount,
      revenuePaid,
      revenuePending,
      recentOrders,
      productsCount,
      activeProductsCount,
      usersCount,
      lowStockProducts,
    ] = await Promise.all([
      orderRepository.countAllOrders(),
      orderRepository.sumRevenueByPaymentStatus("paid"),
      orderRepository.sumRevenueByPaymentStatus("pending"),
      orderRepository.findRecentOrders(10),

      ProductModel.countDocuments().exec(),
      ProductModel.countDocuments({
        isActive: true,
        stockQuantity: { $gt: 0 },
      }).exec(),

      UserModel.countDocuments().exec(),

      ProductModel.find({
        isActive: true,
        stockQuantity: { $gt: 0, $lte: 5 },
      })
        .sort({ stockQuantity: 1 })
        .limit(10)
        .exec(),
    ]);

    return {
      totals: {
        products: productsCount,
        activeProducts: activeProductsCount,
        users: usersCount,
        orders: ordersCount,
        revenuePaid,
        revenuePending,
      },
      recentOrders,
      lowStockProducts,
    };
  },
};
