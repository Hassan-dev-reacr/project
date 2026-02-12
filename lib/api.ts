import { Product, ProductsResponse } from '@/types/product';

const BASE_URL = 'https://dummyjson.com';

// Generate consistent date for each product based on product ID
// Dates will be within the last 6 months
export function generateProductDate(productId: number): string {
  const now = new Date('2026-02-12'); // Current date
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const timeRange = now.getTime() - sixMonthsAgo.getTime();
  // Use product ID as seed for consistent dates
  const seed = productId * 123456789 % 100;
  const randomTime = (seed / 100) * timeRange;
  
  const date = new Date(sixMonthsAgo.getTime() + randomTime);
  return date.toISOString();
}

// Enrich products with dateAdded field
function enrichProducts(products: Product[]): Product[] {
  return products.map(product => ({
    ...product,
    dateAdded: generateProductDate(product.id)
  }));
}

export async function getProducts(limit: number = 10, skip: number = 0): Promise<ProductsResponse> {
  const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();
  return {
    ...data,
    products: enrichProducts(data.products)
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products?limit=0`);
  if (!response.ok) throw new Error('Failed to fetch all products');
  const data = await response.json();
  return enrichProducts(data.products);
}

export async function searchProducts(query: string): Promise<ProductsResponse> {
  const response = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to search products');
  const data = await response.json();
  return {
    ...data,
    products: enrichProducts(data.products)
  };
}

export async function getProduct(id: number): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  const data = await response.json();
  return {
    ...data,
    dateAdded: generateProductDate(data.id)
  };
}

export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/products/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  const data = await response.json();
  // Handle both string[] and object[] responses
  if (Array.isArray(data) && data.length > 0) {
    if (typeof data[0] === 'string') {
      return data;
    } else if (typeof data[0] === 'object' && data[0].slug) {
      return data.map((cat: any) => cat.slug);
    }
  }
  return data;
}

export async function getProductsByCategory(category: string): Promise<ProductsResponse> {
  const response = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`);
  if (!response.ok) throw new Error('Failed to fetch products by category');
  const data = await response.json();
  return {
    ...data,
    products: enrichProducts(data.products)
  };
}
