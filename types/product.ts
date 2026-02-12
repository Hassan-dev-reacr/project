export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  dateAdded: string; // ISO date string generated client-side
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface FilterState {
  search: string;
  category: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}
