export interface CreateProductRequest {
  name: string
  categoryId: number
  description: string
  regularPrice: number
  sku: string
  offerPrice?: number
  initialStock: number
  minStockAlert: number
}

export interface CreateProductResponse {
  id: number
  name: string
  categoryId: number
  description: string
  regularPrice: number
  offerPrice?: number
  initialStock: number
  minStockAlert: number
  createdAt?: string
  updatedAt?: string
}

export interface ProductResponse {
  id: number
  name: string
  categoryId: number
  categoryName?: string
  description: string
  regularPrice: number
  offerPrice?: number
  initialStock: number
  minStockAlert: number
  imageUrl?: string
  sku?: string
  createdAt?: string
  updatedAt?: string
}

export interface ProductItem {
  id: number;
  categoryId: number;
  categoryName?: string;
  name: string;
  description: string;
  regularPrice: number;
  offerPrice?: number;
  minStockAlert: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}