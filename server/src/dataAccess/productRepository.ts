import { IProduct, ProductModel } from "../models/Product";

export const productRepository = {
  async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    const doc = new ProductModel(data);
    return doc.save();
  },

  async findProductById(id: string): Promise<IProduct | null> {
    return ProductModel.findById(id).populate("category").exec();
  },

  async findProductBySlug(slug: string): Promise<IProduct | null> {
    return ProductModel.findOne({ slug }).populate("category").exec();
  },

  async listAllProducts(): Promise<IProduct[]> {
    return ProductModel.find()
      .populate("category")
      .sort({ createdAt: -1 })
      .exec();
  },

  async listAvailableProducts(): Promise<IProduct[]> {
    return ProductModel.find({ isActive: true, stockQuantity: { $gt: 0 } })
      .populate("category")
      .sort({ createdAt: -1 })
      .exec();
  },

  async updateProductById(
    id: string,
    data: Partial<IProduct>
  ): Promise<IProduct | null> {
    return ProductModel.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate("category")
      .exec();
  },

  async updateProductStock(
    id: string,
    stockQuantity: number
  ): Promise<IProduct | null> {
    return ProductModel.findByIdAndUpdate(
      id,
      { $set: { stockQuantity } },
      { new: true }
    )
      .populate("category")
      .exec();
  },

  async setProductActive(
    id: string,
    isActive: boolean
  ): Promise<IProduct | null> {
    return ProductModel.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true }
    )
      .populate("category")
      .exec();
  },

  async deleteProduct(id: string): Promise<IProduct | null> {
    return ProductModel.findByIdAndDelete(id).exec();
  },
};
