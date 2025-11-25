// src/services/categoryService.ts
import { ICategory } from "../models/Category";
import {
  categoryRepository,
  type ListCategoryParams,
} from "../dataAccess/categoryRepository";

export const categoryService = {
  async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    return categoryRepository.createCategory(data);
  },

  async getCategoryById(id: string): Promise<ICategory | null> {
    return categoryRepository.findCategoryById(id);
  },

  async getCategoryBySlug(slug: string): Promise<ICategory | null> {
    return categoryRepository.findCategoryBySlug(slug);
  },

  async listCategories(params: ListCategoryParams = {}): Promise<ICategory[]> {
    return categoryRepository.listCategories(params);
  },

  async listAllCategories(): Promise<ICategory[]> {
    return categoryRepository.listAllCategories();
  },

  async updateCategory(
    id: string,
    data: Partial<ICategory>
  ): Promise<ICategory | null> {
    return categoryRepository.updateCategory(id, data);
  },

  async deleteCategory(id: string): Promise<ICategory | null> {
    return categoryRepository.deleteCategory(id);
  },
};
