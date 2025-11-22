import { IProduct } from "../models/Product";
import { productRepository } from "../dataAccess/productRepository";

export const productService = {
  async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    return productRepository.createProduct(data);
  },

  async getProductById(id: string): Promise<IProduct | null> {
    return productRepository.findProductById(id);
  },

  async getProductBySlug(slug: string): Promise<IProduct | null> {
    return productRepository.findProductBySlug(slug);
  },
};
