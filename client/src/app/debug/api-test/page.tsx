"use client";

import { useState } from "react";
import { apiClient } from "../../../lib/api/apiClient";
import { createCategory } from "../../../lib/api/categoryApi";
import { createProduct } from "../../../lib/api/productApi";

export default function ApiTestPage() {
  const [health, setHealth] = useState<string>("Not checked");
  const [result, setResult] = useState<string>("");

  const checkHealth = async () => {
    try {
      const res = await apiClient.get("/health");
      setHealth(JSON.stringify(res.data));
    } catch (err: any) {
      setHealth("Error: " + (err?.message || "unknown"));
    }
  };

  const createSampleData = async () => {
    try {
      const cat = await createCategory({
        name: "Sample Category",
        slug: "sample-category",
        description: "Demo category",
      });

      const product = await createProduct({
        name: "Demo Product",
        slug: "demo-product",
        price: 19.99,
        category: cat._id,
        imageUrls: [],
        stockQuantity: 10,
      });

      setResult(
        `Created category ${cat.name} and product ${product.name} (id ${product._id})`
      );
    } catch (err: any) {
      setResult("Error: " + (err?.message || "unknown"));
    }
  };

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <h1 className="text-2xl font-bold mb-4">API test</h1>

      <div className="space-y-4">
        <div>
          <button
            onClick={checkHealth}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Check backend health
          </button>
          <p className="mt-2 text-sm text-gray-700 break-all">{health}</p>
        </div>

        <div>
          <button
            onClick={createSampleData}
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            Create sample category and product
          </button>
          <p className="mt-2 text-sm text-gray-700 break-all">{result}</p>
        </div>
      </div>
    </div>
  );
}
