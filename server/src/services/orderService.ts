// src/services/orderService.ts
import { IOrder, type OrderStatus } from "../models/Order";
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
    // build safe items with lineTotal recalculated
    const items = (data.items ?? []).map((item) => {
      const quantity = item.quantity ?? 0;
      const unitPrice = item.unitPrice ?? 0;
      const lineTotal = unitPrice * quantity;

      return {
        product: item.product,
        name: item.name,
        quantity,
        unitPrice,
        lineTotal,
      };
    });

    const totalAmount = items.reduce(
      (sum, item) => sum + (item.lineTotal ?? 0),
      0
    );

    const shippingAddress = data.shippingAddress;
    if (!shippingAddress) {
      throw new Error("shippingAddress is required to create an order");
    }

    const now = new Date();

    const orderToCreate: Partial<IOrder> = {
      user: data.user,
      sessionId: data.sessionId,
      clientOrderId: data.clientOrderId,
      items,
      status: "placed",
      totalAmount,
      currency: data.currency ?? "TRY",
      shippingAddress,
      customerName: (data as any).customerName ?? shippingAddress.fullName,
      customerEmail:
        (data as any).customerEmail ?? shippingAddress.email ?? undefined,
      createdAt: now,
      updatedAt: now,
    };

    // 1, create order
    const order = await orderRepository.createOrder(orderToCreate);

    // 2, update product stock and stats, and user stats
    await Promise.all([
      updateProductStatsForOrder(order),
      updateUserStatsForOrder(order),
    ]).catch((err) => {
      console.error("post order stats update failed", err);
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

    const status =
      options.status === "draft" ||
      options.status === "placed" ||
      options.status === "fulfilled" ||
      options.status === "cancelled"
        ? (options.status as OrderStatus)
        : undefined;

    return orderRepository.listAllOrders({
      status,
      userId: options.userId,
      skip,
      limit,
    });
  },

  async updateOrderStatus(
    id: string,
    status: OrderStatus
  ): Promise<IOrder | null> {
    // for now, status changes do not recalc stats
    // if you later want to adjust stats on cancel etc, hook that here
    return orderRepository.updateOrderStatus(id, status);
  },

  async getOrdersOverview() {
    const [
      ordersCount,
      draftCount,
      placedCount,
      fulfilledCount,
      cancelledCount,
      revenuePlaced,
      revenueFulfilled,
      recentOrders,
      productsCount,
      activeProductsCount,
      usersCount,
      lowStockProducts,
    ] = await Promise.all([
      orderRepository.countAllOrders(),
      orderRepository.countOrdersByStatus("draft"),
      orderRepository.countOrdersByStatus("placed"),
      orderRepository.countOrdersByStatus("fulfilled"),
      orderRepository.countOrdersByStatus("cancelled"),
      orderRepository.sumRevenueForStatuses(["placed"]),
      orderRepository.sumRevenueForStatuses(["fulfilled"]),
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
        ordersByStatus: {
          draft: draftCount,
          placed: placedCount,
          fulfilled: fulfilledCount,
          cancelled: cancelledCount,
        },
        revenuePlaced,
        revenueFulfilled,
        revenueTotal: revenuePlaced + revenueFulfilled,
      },
      recentOrders,
      lowStockProducts,
    };
  },
};

// internal helpers

async function updateProductStatsForOrder(order: IOrder) {
  const createdAt = order.createdAt ?? new Date();

  // aggregate per product in case the same product occurs more than once
  const perProduct = new Map<
    string,
    { quantity: number; revenue: number; orderCount: number }
  >();

  for (const item of order.items) {
    const id = String(item.product);
    const existing = perProduct.get(id) ?? {
      quantity: 0,
      revenue: 0,
      orderCount: 0,
    };

    existing.quantity += item.quantity;
    existing.revenue += item.lineTotal;
    existing.orderCount += 1;

    perProduct.set(id, existing);
  }

  const updates: Promise<any>[] = [];

  perProduct.forEach((agg, productId) => {
    updates.push(
      ProductModel.updateOne(
        { _id: productId },
        {
          $inc: {
            stockQuantity: -agg.quantity,
            orderCount: agg.orderCount,
            totalUnitsSold: agg.quantity,
            totalRevenue: agg.revenue,
          },
          $set: {
            lastOrderedAt: createdAt,
          },
        }
      ).exec()
    );
  });

  await Promise.all(updates);
}

async function updateUserStatsForOrder(order: IOrder) {
  if (!order.user) return;

  const createdAt = order.createdAt ?? new Date();

  await UserModel.updateOne(
    { _id: order.user },
    {
      $inc: {
        orderCount: 1,
        totalSpent: order.totalAmount,
      },
      $set: {
        lastOrderAt: createdAt,
      },
    }
  ).exec();
}
