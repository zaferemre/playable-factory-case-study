import { Request, Response } from "express";
import { userService } from "../services/userService";

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
