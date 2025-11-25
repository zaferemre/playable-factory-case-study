// src/services/productService.ts
import { IProduct } from "../models/Product";
import {
  productRepository,
  type ListProductsParams,
} from "../dataAccess/productRepository";

const sanitizeProductInput = (data: Partial<IProduct>): Partial<IProduct> => {
  const {
    orderCount,
    totalUnitsSold,
    totalRevenue,
    lastOrderedAt,
    averageRating,
    reviewCount,
    createdAt,
    updatedAt,
    ...rest
  } = data as any;

  return rest;
};

export const productService = {
  async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    const clean = sanitizeProductInput(data);
    return productRepository.createProduct(clean);
  },

  async getProductById(id: string): Promise<IProduct | null> {
    return productRepository.findProductById(id);
  },

  async getProductBySlug(slug: string): Promise<IProduct | null> {
    return productRepository.findProductBySlug(slug);
  },

  // admin list
  async listAllProducts(params: ListProductsParams = {}): Promise<IProduct[]> {
    return productRepository.listAllProducts(params);
  },

  // public list
  async listAvailableProducts(
    params: ListProductsParams = {}
  ): Promise<IProduct[]> {
    return productRepository.listAvailableProducts(params);
  },

  async updateProduct(
    id: string,
    data: Partial<IProduct>
  ): Promise<IProduct | null> {
    const clean = sanitizeProductInput(data);
    return productRepository.updateProductById(id, clean);
  },

  async updateProductStock(
    id: string,
    stockQuantity: number
  ): Promise<IProduct | null> {
    return productRepository.updateProductStock(id, stockQuantity);
  },

  async activateProduct(id: string): Promise<IProduct | null> {
    return productRepository.setProductActive(id, true);
  },

  async deactivateProduct(id: string): Promise<IProduct | null> {
    return productRepository.setProductActive(id, false);
  },

  async deleteProduct(id: string): Promise<IProduct | null> {
    return productRepository.deleteProduct(id);
  },
};
