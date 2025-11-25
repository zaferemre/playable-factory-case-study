// src/controllers/orderController.ts
import { Request, Response } from "express";
import { orderService } from "../services/orderService";
import type { OrderStatus } from "../models/Order";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    console.error("createOrder error", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("getOrderById error", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

export const getOrderByClientOrderId = async (req: Request, res: Response) => {
  try {
    const clientOrderId = req.params.clientOrderId;
    const order = await orderService.getOrderByClientOrderId(clientOrderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("getOrderByClientOrderId error", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

export const getOrdersForUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const orders = await orderService.getOrdersForUser(userId);
    res.json(orders);
  } catch (err) {
    console.error("getOrdersForUser error", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// admin: list all orders with filters
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { status, userId, limit, page } = req.query;

    const orders = await orderService.getAllOrders({
      status: typeof status === "string" ? status : undefined,
      userId: typeof userId === "string" ? userId : undefined,
      limit:
        typeof limit === "string"
          ? Number.parseInt(limit, 10) || undefined
          : undefined,
      page:
        typeof page === "string"
          ? Number.parseInt(page, 10) || undefined
          : undefined,
    });

    res.json(orders);
  } catch (err) {
    console.error("getAllOrders error", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// admin: update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body as { status?: OrderStatus };

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const allowed: OrderStatus[] = [
      "draft",
      "placed",
      "fulfilled",
      "cancelled",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await orderService.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("updateOrderStatus error", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

// admin: overview
export const getOrdersOverview = async (_req: Request, res: Response) => {
  try {
    const overview = await orderService.getOrdersOverview();
    res.json(overview);
  } catch (err) {
    console.error("getOrdersOverview error", err);
    res.status(500).json({ message: "Failed to fetch orders overview" });
  }
};
