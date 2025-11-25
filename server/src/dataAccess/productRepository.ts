// src/dataAccess/productRepository.ts
import { IProduct, ProductModel } from "../models/Product";

export type ProductSortBy = "newest" | "price" | "rating" | "orders";

export interface ListProductsParams {
  q?: string;
  categoryId?: string;
  sortBy?: ProductSortBy;
  sortDir?: "asc" | "desc";
  limit?: number;
}

const buildFilter = (
  params: ListProductsParams,
  opts: { onlyActive?: boolean; inStockOnly?: boolean }
) => {
  const filter: Record<string, any> = {};

  if (opts.onlyActive) {
    filter.isActive = true;
  }

  if (opts.inStockOnly) {
    filter.stockQuantity = { $gt: 0 };
  }

  if (params.categoryId) {
    // mongoose will cast string to ObjectId
    filter.category = params.categoryId;
  }

  if (params.q) {
    const regex = new RegExp(params.q, "i");
    filter.$or = [{ name: regex }, { description: regex }];
  }

  return filter;
};

const buildSort = (params: ListProductsParams) => {
  const sort: Record<string, 1 | -1> = {};
  const sortBy = params.sortBy || "newest";
  const dir: 1 | -1 = params.sortDir === "asc" ? 1 : -1;

  if (sortBy === "price") {
    sort.price = dir;
  } else if (sortBy === "rating") {
    sort.averageRating = dir;
    sort.reviewCount = dir;
  } else if (sortBy === "orders") {
    sort.orderCount = dir;
    sort.totalUnitsSold = dir;
  } else {
    // newest
    sort.createdAt = dir;
  }

  return sort;
};

const applyLimit = (limit?: number) => {
  if (!limit || limit <= 0) return 1000;
  return limit;
};

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

  // admin list, can see everything
  async listAllProducts(params: ListProductsParams = {}): Promise<IProduct[]> {
    const filter = buildFilter(params, {
      onlyActive: false,
      inStockOnly: false,
    });

    const sort = buildSort(params);
    const limit = applyLimit(params.limit);

    return ProductModel.find(filter)
      .populate("category")
      .sort(sort)
      .limit(limit)
      .exec();
  },

  // public list, only active and in stock
  async listAvailableProducts(
    params: ListProductsParams = {}
  ): Promise<IProduct[]> {
    const filter = buildFilter(params, {
      onlyActive: true,
      inStockOnly: true,
    });

    const sort = buildSort(params);
    const limit = applyLimit(params.limit);

    return ProductModel.find(filter)
      .populate("category")
      .sort(sort)
      .limit(limit)
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
