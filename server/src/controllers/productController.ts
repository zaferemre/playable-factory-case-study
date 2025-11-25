// src/controllers/productController.ts
import { Request, Response } from "express";
import { productService } from "../services/productService";
import type { ProductSortBy } from "../dataAccess/productRepository";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    console.error("createProduct error", err);

    if (err?.code === 11000) {
      // duplicate slug
      return res.status(400).json({
        message: "Product with this slug already exists",
      });
    }

    res.status(500).json({ message: "Failed to create product" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("getProductById error", err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("getProductBySlug error", err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// admin list all products with query options
export const listAllProducts = async (req: Request, res: Response) => {
  try {
    const {
      q,
      categoryId,
      sortBy = "newest",
      sortDir = "desc",
      limit,
    } = req.query;

    const parsedLimit = limit ? Number(limit) || 1000 : 1000;

    const products = await productService.listAllProducts({
      q: q as string | undefined,
      categoryId: categoryId as string | undefined,
      sortBy: sortBy as ProductSortBy,
      sortDir: sortDir === "asc" ? "asc" : "desc",
      limit: parsedLimit,
    });

    res.json(products);
  } catch (err) {
    console.error("listAllProducts error", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// public list available products with optional filters and sorting
export const listAvailableProducts = async (req: Request, res: Response) => {
  try {
    const {
      q,
      categoryId,
      sortBy = "newest",
      sortDir = "desc",
      limit,
    } = req.query;

    const parsedLimit = limit ? Number(limit) || 1000 : 1000;

    const products = await productService.listAvailableProducts({
      q: q as string | undefined,
      categoryId: categoryId as string | undefined,
      sortBy: sortBy as ProductSortBy,
      sortDir: sortDir === "asc" ? "asc" : "desc",
      limit: parsedLimit,
    });

    res.json(products);
  } catch (err) {
    console.error("listAvailableProducts error", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// admin update full product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updated = await productService.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updated);
  } catch (err: any) {
    console.error("updateProduct error", err);

    if (err?.code === 11000) {
      return res.status(400).json({
        message: "Product with this slug already exists",
      });
    }

    res.status(500).json({ message: "Failed to update product" });
  }
};

// admin update stock only
export const updateProductStock = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { stockQuantity } = req.body as { stockQuantity: number };
    if (typeof stockQuantity !== "number") {
      return res
        .status(400)
        .json({ message: "stockQuantity must be a number" });
    }

    const updated = await productService.updateProductStock(id, stockQuantity);
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("updateProductStock error", err);
    res.status(500).json({ message: "Failed to update product stock" });
  }
};

export const activateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updated = await productService.activateProduct(id);
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("activateProduct error", err);
    res.status(500).json({ message: "Failed to activate product" });
  }
};

export const deactivateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updated = await productService.deactivateProduct(id);
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("deactivateProduct error", err);
    res.status(500).json({ message: "Failed to deactivate product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error("deleteProduct error", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
