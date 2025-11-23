import { Request, Response } from "express";
import { userService } from "../services/userService";
import type { IUserAddress } from "../models/User";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error("createUser error", err);
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("getUserById error", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const addUserAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const address = req.body as IUserAddress;

    const updated = await userService.addUserAddress(userId, address);
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("addUserAddress error", err);
    res.status(500).json({ message: "Failed to add address" });
  }
};

export const removeUserAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const index = Number(req.params.index);

    if (Number.isNaN(index)) {
      return res.status(400).json({ message: "Invalid address index" });
    }

    const updated = await userService.removeUserAddress(userId, index);
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("removeUserAddress error", err);
    res.status(500).json({ message: "Failed to remove address" });
  }
};

// admin list users
export const listUsers = async (req: Request, res: Response) => {
  try {
    const { q, page = "1", limit = "20" } = req.query;
    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 20;

    const result = await userService.listUsers({
      q: q as string | undefined,
      page: parsedPage,
      limit: parsedLimit,
    });

    res.json({
      users: result.users,
      total: result.total,
      page: parsedPage,
      limit: parsedLimit,
    });
  } catch (err) {
    console.error("listUsers error", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// admin update role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { role } = req.body as { role?: "customer" | "admin" };

    if (role !== "customer" && role !== "admin") {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updated = await userService.updateUserRole(id, role);
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("updateUserRole error", err);
    res.status(500).json({ message: "Failed to update user role" });
  }
};
