import { ICategory, CategoryModel } from "../models/Category";

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
};
