import axios, { isAxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CreateProductRequest, CreateProductResponse, ProductResponse } from "../models/product.model";
import { API_URL } from '@/api/ApiClient';

// Productos base asociados a las categorías fundamentales (Electronics, Fashion, VideoGames)
export const BASE_PRODUCTS: ProductResponse[] = [
  {
    id: 90001,
    name: "Premium Audio",
    description: "Wireless Noise Cancelling Headphones",
    regularPrice: 299.00,
    offerPrice: 249.00,
    initialStock: 15,
    minStockAlert: 3,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    categoryId: 234,
    categoryName: "Electronics",
    createdAt: new Date().toISOString()
  },
  {
    id: 90002,
    name: "Eon Classic Wrist",
    description: "Genuine Leather Strap Luxury Watch",
    regularPrice: 145.00,
    offerPrice: 120.00,
    initialStock: 20,
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
    categoryId: 235,
    categoryName: "Fashion",
    createdAt: new Date().toISOString()
  },
  {
    id: 90003,
    name: "Velocity Running",
    description: "Peak Performance Athletic Shoes",
    regularPrice: 89.99,
    offerPrice: 79.99,
    initialStock: 30,
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    categoryId: 235,
    categoryName: "Fashion",
    createdAt: new Date().toISOString()
  },
  {
    id: 90004,
    name: "Insta-Capture",
    description: "Vintage Aesthetics Instant Camera",
    regularPrice: 120.00,
    offerPrice: 99.00,
    initialStock: 10,
    minStockAlert: 2,
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop",
    categoryId: 234,
    categoryName: "Electronics",
    createdAt: new Date().toISOString()
  },
  {
    id: 90005,
    name: "Console Controller",
    description: "Built for Next-Gen Gaming",
    regularPrice: 69.99,
    offerPrice: 59.99,
    initialStock: 25,
    minStockAlert: 4,
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
    categoryId: 236,
    categoryName: "VideoGames",
    createdAt: new Date().toISOString()
  }
];

const STORED_PRODUCTS_KEY = "@stored_custom_products";
let inMemoryProducts: ProductResponse[] = [];

async function getStoredCustomProducts(): Promise<ProductResponse[]> {
  try {
    const json = await AsyncStorage.getItem(STORED_PRODUCTS_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        inMemoryProducts = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.log("Error al cargar productos locales:", e);
  }
  return inMemoryProducts;
}

async function saveCustomProduct(product: ProductResponse): Promise<void> {
  try {
    const current = await getStoredCustomProducts();
    const updated = [product, ...current.filter((p) => p.id !== product.id)];
    inMemoryProducts = updated;
    await AsyncStorage.setItem(STORED_PRODUCTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.log("Error al guardar producto localmente:", e);
  }
}

export const ProductService = {
  createProduct: async (
    productRequest: CreateProductRequest,
    token: string
  ): Promise<CreateProductResponse> => {
    try {
      const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      console.log("Enviando petición de creación al backend...", productRequest);
      const response = await axios.post<CreateProductResponse>(
        `${API_URL}/products/create`,
        productRequest,
        {
          headers: {
            Authorization: authTokenHeader,
            "Content-Type": "application/json"
          },
          timeout: 15000
        }
      );

      console.log("Respuesta del API (ProductService.createProduct):", response.data);
      const created = response.data;

      // Guardar el producto creado en almacenamiento local para que se refleje inmediatamente en el Dashboard
      const prodToStore: ProductResponse = {
        id: created.id,
        name: created.name,
        categoryId: created.categoryId,
        description: created.description,
        regularPrice: created.regularPrice,
        offerPrice: created.offerPrice,
        initialStock: created.initialStock,
        minStockAlert: created.minStockAlert,
        createdAt: created.createdAt || new Date().toISOString(),
        updatedAt: created.updatedAt || new Date().toISOString(),
        sku: productRequest.sku,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop"
      };
      await saveCustomProduct(prodToStore);

      return created;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        console.log("ERROR RESPONSE:", error.response.data);
        throw new Error(error.response.data?.Message || error.response.data?.message || "Error al crear el producto");
      }
      if (isAxiosError(error) && error.code === "ECONNABORTED") {
        throw new Error("Tiempo de espera agotado. Revisa tu conexión a internet.");
      }
      throw new Error("Error de conexión con el servidor");
    }
  },

  getProductsByCategory: async (
    categoryId: number,
    token: string
  ): Promise<ProductResponse[]> => {
    try {
      const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      const response = await axios.get<ProductResponse[]>(
        `${API_URL}/products/category/${categoryId}`,
        {
          headers: {
            Authorization: authTokenHeader,
            "Content-Type": "application/json"
          },
          timeout: 15000
        }
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        console.log("Error al obtener productos por categoria:", error.response.data);
        throw new Error(error.response.data?.Message || error.response.data?.message || "Error al obtener productos");
      }
      throw new Error("Error de conexión al obtener productos");
    }
  },

  getAllProducts: async (
    categories: { id: number; name?: string }[],
    token: string
  ): Promise<ProductResponse[]> => {
    try {
      // 1. Cargar productos creados por el usuario
      const customProducts = await getStoredCustomProducts();

      // 2. Consultar productos del backend para categorías existentes del servidor
      const serverCatIds = categories
        .map((c) => c.id)
        .filter((id) => id > 0 && id < 100);

      const serverResults = await Promise.all(
        serverCatIds.map((id) =>
          ProductService.getProductsByCategory(id, token).catch(() => [])
        )
      );

      const allServerProds = serverResults.flat();

      // 3. Unir productos: Base Products + Creados por usuario + Servidor
      const map = new Map<number, ProductResponse>();

      // Productos base para Electronics, Fashion, VideoGames
      BASE_PRODUCTS.forEach((prod) => map.set(prod.id, prod));

      // Productos creados por el usuario
      customProducts.forEach((prod) => map.set(prod.id, prod));

      // Productos del servidor
      allServerProds.slice(0, 30).forEach((prod) => {
        if (!map.has(prod.id)) {
          map.set(prod.id, prod);
        }
      });

      return Array.from(map.values());
    } catch (error) {
      console.log("Error al cargar todos los productos:", error);
      return BASE_PRODUCTS;
    }
  }
};
