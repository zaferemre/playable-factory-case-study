import { Request, Response } from "express";
import { categoryService } from "../services/categoryService";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    console.error("createCategory error", err);
    res.status(500).json({ message: "Failed to create category" });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    console.error("getCategoryById error", err);
    res.status(500).json({ message: "Failed to fetch category" });
  }
};
