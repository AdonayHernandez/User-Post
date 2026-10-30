import axios, { isAxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/api/ApiClient";

export interface CategoryResponse {
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Categorías base generales para el Dashboard
export const DEFAULT_DASHBOARD_CATEGORIES: CategoryResponse[] = [
    {
        id: 234,
        name: "Electronics",
        description: "Dispositivos electrónicos, tecnología y audio",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z"
    },
    {
        id: 235,
        name: "Fashion",
        description: "Ropa, calzado y accesorios de moda",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z"
    },
    {
        id: 236,
        name: "VideoGames",
        description: "Consolas, videojuegos y periféricos gaming",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z"
    }
];

const STORAGE_KEY = "@stored_custom_categories";
let inMemoryCustomCategories: CategoryResponse[] = [];

export async function getStoredCustomCategories(): Promise<CategoryResponse[]> {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
            const parsed = JSON.parse(json);
            if (Array.isArray(parsed)) {
                inMemoryCustomCategories = parsed;
                return parsed;
            }
        }
    } catch (e) {
        console.log("Error al cargar categorías almacenadas localmente:", e);
    }
    return inMemoryCustomCategories;
}

export async function saveCustomCategory(category: CategoryResponse): Promise<void> {
    try {
        const current = await getStoredCustomCategories();
        const filtered = current.filter(
            c => c.id !== category.id && c.name.trim().toLowerCase() !== category.name.trim().toLowerCase()
        );
        const updated = [category, ...filtered];
        inMemoryCustomCategories = updated;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
        console.log("Error al guardar categoría en almacenamiento local:", e);
    }
}

export const CategoryService = {
    createcategory: async (
        name: string,
        description: string,
        token: string
    ): Promise<CategoryResponse> => {
        console.log("TOKEN SERVICE:", token);
        try {
            const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

            const response = await axios.post(
                `${API_URL}/categories/create`,
                {
                    name,
                    description,
                    token
                },
                {
                    headers: {
                        Authorization: authTokenHeader,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("RESPUESTA CREAR CATEGORIA:", response.data);
            const createdCategory = response.data;

            // Persistir inmediatamente la categoría creada para que esté disponible al crear productos
            await saveCustomCategory(createdCategory);

            return createdCategory;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                console.log("ERROR RESPONSE:", error.response.data);
                throw new Error(error.response.data?.Message || error.response.data?.message || "Error al guardar categoría");
            }
            throw new Error("Server error");
        }
    },

    // Para Crear Producto: Mantiene las categorías existentes del servidor y agrega las que el usuario cree en Nueva Categoría
    getCategories: async (token: string, includeBaseCategories: boolean = false): Promise<CategoryResponse[]> => {
        let serverCategories: CategoryResponse[] = [];
        try {
            const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
            const response = await axios.get<CategoryResponse[]>(
                `${API_URL}/categories`,
                {
                    headers: {
                        Authorization: authTokenHeader,
                        "Content-Type": "application/json"
                    },
                    timeout: 10000
                }
            );
            console.log("Categorias obtenidas de la API:", response.data);
            if (Array.isArray(response.data)) {
                serverCategories = response.data;
            }
        } catch (error) {
            console.log("Aviso al consultar categorías de la API:", error);
        }

        // Obtener categorías creadas por el usuario guardadas localmente
        const customCategories = await getStoredCustomCategories();

        // Si includeBaseCategories es true (para Dashboard), se agregan Electronics, Fashion, VideoGames
        // Si es false (para Crear Producto), SOLO las que ya estaban en el servidor + las que cree el usuario
        const baseList = includeBaseCategories ? DEFAULT_DASHBOARD_CATEGORIES : [];
        const combined = [...baseList, ...customCategories, ...serverCategories];

        // Deduplicar manteniendo categorías únicas por nombre normalizado
        const seenNames = new Set<string>();
        const uniqueCategories: CategoryResponse[] = [];

        for (const cat of combined) {
            const normName = (cat.name || "").trim().toLowerCase();
            if (!normName) continue;
            if (!seenNames.has(normName)) {
                seenNames.add(normName);
                uniqueCategories.push(cat);
            }
        }

        return uniqueCategories;
    },

    // Para el Dashboard: Categorías generales + servidor + creadas
    getDashboardCategories: async (token: string): Promise<CategoryResponse[]> => {
        return CategoryService.getCategories(token, true);
    },

    getAllCategories: async (token: string): Promise<CategoryResponse[]> => {
        return CategoryService.getCategories(token, false);
    }
};
