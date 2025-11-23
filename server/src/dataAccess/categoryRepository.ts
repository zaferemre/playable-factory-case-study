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

  async listCategories(): Promise<ICategory[]> {
    return CategoryModel.find().sort({ createdAt: -1 }).exec();
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
