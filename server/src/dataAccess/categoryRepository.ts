// src/dataAccess/categoryRepository.ts
import { ICategory, CategoryModel } from "../models/Category";

export interface ListCategoryParams {
  onlyActive?: boolean;
}

export const categoryRepository = {
  async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    const doc = new CategoryModel(data);
    return doc.save();
  },

  async findCategoryById(id: string): Promise<ICategory | null> {
    return CategoryModel.findById(id).exec();
  },

  async findCategoryBySlug(slug: string): Promise<ICategory | null> {
    return CategoryModel.findOne({ slug }).exec();
  },

  async listCategories(params: ListCategoryParams = {}): Promise<ICategory[]> {
    const filter: Record<string, any> = {};

    if (params.onlyActive) {
      filter.isActive = true;
    }

    // name sort is usually nicer than createdAt for categories
    return CategoryModel.find(filter).sort({ name: 1 }).exec();
  },

  // convenience for admin if you want to be explicit
  async listAllCategories(): Promise<ICategory[]> {
    return CategoryModel.find().sort({ name: 1 }).exec();
  },

  async updateCategory(
    id: string,
    data: Partial<ICategory>
  ): Promise<ICategory | null> {
    return CategoryModel.findByIdAndUpdate(id, data, { new: true }).exec();
  },

  async deleteCategory(id: string): Promise<ICategory | null> {
    return CategoryModel.findByIdAndDelete(id).exec();
  },
};
