// src/controllers/categoryController.ts
import { Request, Response } from "express";
import { categoryService } from "../services/categoryService";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err: any) {
    if (err?.code === 11000) {
      return res
        .status(400)
        .json({ message: "Category with this slug already exists" });
    }

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

export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    console.error("getCategoryBySlug error", err);
    res.status(500).json({ message: "Failed to fetch category" });
  }
};

// public list, only active categories
export const listCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await categoryService.listCategories({
      onlyActive: true,
    });
    res.json(categories);
  } catch (err) {
    console.error("listCategories error", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// admin list, can include inactive
export const listAllCategories = async (req: Request, res: Response) => {
  try {
    const { includeInactive } = req.query;
    const onlyActive = includeInactive === "true" ? false : true;

    const categories = await categoryService.listCategories({ onlyActive });
    res.json(categories);
  } catch (err) {
    console.error("listAllCategories error", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updated = await categoryService.updateCategory(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(updated);
  } catch (err: any) {
    console.error("updateCategory error", err);

    if (err?.code === 11000) {
      return res
        .status(400)
        .json({ message: "Category with this slug already exists" });
    }

    res.status(500).json({ message: "Failed to update category" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deleted = await categoryService.deleteCategory(id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error("deleteCategory error", err);
    res.status(500).json({ message: "Failed to delete category" });
  }
};
