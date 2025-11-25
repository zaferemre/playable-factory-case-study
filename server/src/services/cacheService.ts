// src/services/cacheService.ts
import redisClient, { cacheKeys, cacheTTL } from "../config/redis";

export class CacheService {
  // Generic cache methods
  static async get<T>(key: string): Promise<T | null> {
    try {
      if (!redisClient.isOpen) return null;

      const cached = await redisClient.get(key);
      if (!cached) return null;

      return JSON.parse(cached) as T;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  static async set(
    key: string,
    value: any,
    ttl: number = cacheTTL.medium
  ): Promise<void> {
    try {
      if (!redisClient.isOpen) return;

      await redisClient.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  static async del(key: string): Promise<void> {
    try {
      if (!redisClient.isOpen) return;

      await redisClient.del(key);
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
    }
  }

  static async delPattern(pattern: string): Promise<void> {
    try {
      if (!redisClient.isOpen) return;

      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.error(
        `Cache delete pattern error for pattern ${pattern}:`,
        error
      );
    }
  }

  // Product-specific cache methods
  static async getAvailableProducts(
    query?: string,
    categoryId?: string,
    sortBy?: string,
    sortDir?: string
  ) {
    const key = cacheKeys.products.available(
      query,
      categoryId,
      sortBy,
      sortDir
    );
    return this.get(key);
  }

  static async setAvailableProducts(
    products: any,
    query?: string,
    categoryId?: string,
    sortBy?: string,
    sortDir?: string
  ) {
    const key = cacheKeys.products.available(
      query,
      categoryId,
      sortBy,
      sortDir
    );
    await this.set(key, products, cacheTTL.short); // 5 minutes for product lists
  }

  static async getProductById(id: string) {
    return this.get(cacheKeys.products.byId(id));
  }

  static async setProductById(id: string, product: any) {
    await this.set(cacheKeys.products.byId(id), product, cacheTTL.medium);
  }

  static async getProductBySlug(slug: string) {
    return this.get(cacheKeys.products.bySlug(slug));
  }

  static async setProductBySlug(slug: string, product: any) {
    await this.set(cacheKeys.products.bySlug(slug), product, cacheTTL.medium);
  }

  static async invalidateProductCache(productId?: string, slug?: string) {
    // Invalidate all product list caches
    await this.delPattern("products:available*");
    await this.del(cacheKeys.products.all);

    // Invalidate specific product cache if provided
    if (productId) {
      await this.del(cacheKeys.products.byId(productId));
    }
    if (slug) {
      await this.del(cacheKeys.products.bySlug(slug));
    }
  }

  // Category-specific cache methods
  static async getActiveCategories() {
    return this.get(cacheKeys.categories.active);
  }

  static async setActiveCategories(categories: any) {
    await this.set(cacheKeys.categories.active, categories, cacheTTL.long);
  }

  static async getCategoryById(id: string) {
    return this.get(cacheKeys.categories.byId(id));
  }

  static async setCategoryById(id: string, category: any) {
    await this.set(cacheKeys.categories.byId(id), category, cacheTTL.long);
  }

  static async getCategoryBySlug(slug: string) {
    return this.get(cacheKeys.categories.bySlug(slug));
  }

  static async setCategoryBySlug(slug: string, category: any) {
    await this.set(cacheKeys.categories.bySlug(slug), category, cacheTTL.long);
  }

  static async invalidateCategoryCache(categoryId?: string, slug?: string) {
    await this.del(cacheKeys.categories.all);
    await this.del(cacheKeys.categories.active);

    // Also invalidate product caches since products depend on categories
    await this.delPattern("products:available*");

    if (categoryId) {
      await this.del(cacheKeys.categories.byId(categoryId));
    }
    if (slug) {
      await this.del(cacheKeys.categories.bySlug(slug));
    }
  }

  // Review-specific cache methods
  static async getProductReviews(productId: string) {
    return this.get(cacheKeys.reviews.byProduct(productId));
  }

  static async setProductReviews(productId: string, reviews: any) {
    await this.set(
      cacheKeys.reviews.byProduct(productId),
      reviews,
      cacheTTL.short
    );
  }

  static async getAllReviews() {
    return this.get(cacheKeys.reviews.all);
  }

  static async setAllReviews(reviews: any) {
    await this.set(cacheKeys.reviews.all, reviews, cacheTTL.short);
  }

  static async invalidateReviewCache(productId?: string) {
    await this.del(cacheKeys.reviews.all);

    if (productId) {
      await this.del(cacheKeys.reviews.byProduct(productId));
    } else {
      // If no specific product, invalidate all product review caches
      await this.delPattern("reviews:product:*");
    }
  }

  // Admin-specific cache methods
  static async getAdminOverview() {
    return this.get(cacheKeys.admin.overview);
  }

  static async setAdminOverview(overview: any) {
    await this.set(cacheKeys.admin.overview, overview, cacheTTL.short);
  }

  static async getOrdersOverview() {
    return this.get(cacheKeys.admin.orders.overview);
  }

  static async setOrdersOverview(overview: any) {
    await this.set(cacheKeys.admin.orders.overview, overview, cacheTTL.short);
  }

  static async invalidateAdminCache() {
    await this.del(cacheKeys.admin.overview);
    await this.del(cacheKeys.admin.orders.overview);
  }
}

export default CacheService;
