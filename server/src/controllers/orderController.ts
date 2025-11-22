import { Request, Response } from "express";
import { orderService } from "../services/orderService";

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
