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

  async getAllProducts(): Promise<IProduct[]> {
    return productRepository.listAllProducts();
  },

  async getAvailableProducts(): Promise<IProduct[]> {
    return productRepository.listAvailableProducts();
  },

  async updateProduct(
    id: string,
    data: Partial<IProduct>
  ): Promise<IProduct | null> {
    return productRepository.updateProductById(id, data);
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
