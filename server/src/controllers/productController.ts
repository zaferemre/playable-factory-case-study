import { Request, Response } from "express";
import { productService } from "../services/productService";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error("createProduct error", err);
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

export const listAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    console.error("listAllProducts error", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const listAvailableProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getAvailableProducts();
    res.json(products);
  } catch (err) {
    console.error("listAvailableProducts error", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
