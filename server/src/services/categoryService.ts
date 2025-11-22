import { ICategory } from "../models/Category";
import { categoryRepository } from "../dataAccess/categoryRepository";

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
};
