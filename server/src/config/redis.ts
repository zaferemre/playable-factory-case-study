// src/config/redis.ts
import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    connectTimeout: 60000,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redisClient.on("ready", () => {
  console.log("✅ Redis Client Ready");
});

redisClient.on("end", () => {
  console.log("❌ Redis connection ended");
});

// Connect to Redis
export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("✅ Redis connected successfully");
    }
  } catch (error) {
    console.error(
      "⚠️ Failed to connect to Redis (server will continue without cache):",
      error
    );
    // Don't throw error - let server start without Redis cache
  }
};

// Cache key generators
export const cacheKeys = {
  // Product keys
  products: {
    all: "products:all",
    available: (
      query?: string,
      categoryId?: string,
      sortBy?: string,
      sortDir?: string
    ) => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (categoryId) params.set("categoryId", categoryId);
      if (sortBy) params.set("sortBy", sortBy);
      if (sortDir) params.set("sortDir", sortDir);
      const queryString = params.toString();
      return `products:available${queryString ? ":" + queryString : ""}`;
    },
    byId: (id: string) => `product:id:${id}`,
    bySlug: (slug: string) => `product:slug:${slug}`,
  },

  // Category keys
  categories: {
    all: "categories:all",
    active: "categories:active",
    byId: (id: string) => `category:id:${id}`,
    bySlug: (slug: string) => `category:slug:${slug}`,
  },

  // Review keys
  reviews: {
    byProduct: (productId: string) => `reviews:product:${productId}`,
    all: "reviews:all",
  },

  // Admin keys
  admin: {
    overview: "admin:overview",
    orders: {
      overview: "admin:orders:overview",
    },
  },
};

// Cache TTL (Time To Live) in seconds
export const cacheTTL = {
  short: 300, // 5 minutes
  medium: 1800, // 30 minutes
  long: 3600, // 1 hour
  veryLong: 86400, // 24 hours
};

export default redisClient;
