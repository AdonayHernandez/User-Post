import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "@/app/src/context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import { ProductService } from "../service/product.service";
import { CategoryResponse, CategoryService } from "../../categories/services/category.service";

export function useCreateProduct() {
    const router = useRouter();
    const { token } = useAuth();

    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState<null | number>(null);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isCategoriesShowModal, setIsCategoriesShowModal] = useState(false);
    const [sku, setSku] = useState("");
    const [description, setDescription] = useState("");
    const [regularPrice, setRegularPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [initialStock, setInitialStock] = useState("");
    const [minStockAlert, setMinStockAlert] = useState("");
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedCategoryName, setSelectedCategoryName] = useState("");

    const fetchCategories = useCallback(async () => {
        if (!token) return;
        setIsLoadingCategories(true);
        try {
            console.log(" [PRODUCTOS] Obteniendo categorías disponibles desde el backend...");
            const data = await CategoryService.getCategories(token);
            console.log(` [PRODUCTOS] ${data.length} categorías obtenidas del servidor:`, data.map(c => `${c.id}: ${c.name}`));
            setCategories(data);
        } catch (error: any) {
            console.log(" Error al cargar las categorias:", error.message);
        } finally {
            setIsLoadingCategories(false);
        }
    }, [token]);

    // Recargar categorías cada vez que la pantalla de crear producto toma el foco
    useFocusEffect(
        useCallback(() => {
            fetchCategories();
        }, [fetchCategories])
    );

    const submitProduct = async () => {
        if (!name.trim() || !categoryId || !sku.trim() || !description.trim() || !regularPrice.trim() || !initialStock.trim()) {
            const errorMsg = "Por favor completa todos los campos obligatorios: Nombre, Categoría, SKU, Descripción, Precio Regular y Stock Inicial.";
            setErrorMessage(errorMsg);
            Alert.alert("Campos obligatorios", errorMsg);
            return;
        }

        if (!token) {
            const sessionMsg = "Sesión no válida o expirada. Inicie sesión nuevamente.";
            setErrorMessage(sessionMsg);
            Alert.alert("Error de sesión", sessionMsg);
            return;
        }

        setErrorMessage(null);
        setIsLoadingProduct(true);

        const payload = {
            name: name.trim(),
            categoryId: Number(categoryId),
            sku: sku.trim(),
            description: description.trim(),
            regularPrice: parseFloat(regularPrice),
            offerPrice: offerPrice && String(offerPrice).trim() ? parseFloat(String(offerPrice)) : undefined,
            initialStock: parseInt(initialStock, 10),
            minStockAlert: minStockAlert && String(minStockAlert).trim() ? parseInt(String(minStockAlert), 10) : 0
        };

        console.log("==========================================");
        console.log(" [PRODUCTO] Iniciando creación de producto...");
        console.log(` Nombre: "${payload.name}"`);
        console.log(` Categoría ID: ${payload.categoryId} ("${selectedCategoryName}")`);
        console.log(` SKU: "${payload.sku}"`);
        console.log(` Precio Regular: $${payload.regularPrice}`);
        console.log(` Stock Inicial: ${payload.initialStock}`);
        console.log("==========================================");

        try {
            const createdProduct = await ProductService.createProduct(payload, token);
            console.log("==========================================");
            console.log(" [PRODUCTO] ¡Producto creado con éxito en el servidor!");
            console.log(" Respuesta del servidor:", createdProduct);
            console.log("==========================================");

            Alert.alert("Éxito", "Producto creado correctamente", [
                {
                    text: "OK",
                    onPress: () => router.replace("/(protected)/dashboard")
                }
            ]);
        } catch (error: any) {
            console.log(" [PRODUCTO] Error al crear producto:", error.message || error);
            const msg = error.message || "Error al crear el producto";
            setErrorMessage(msg);
            Alert.alert("Error", msg);
        } finally {
            setIsLoadingProduct(false);
        }
    };

    return {
        name,
        setName,
        categories,
        fetchCategories,
        isLoadingCategories,
        isCategoriesShowModal,
        setIsCategoriesShowModal,
        categoryId,
        setCategoryId,
        sku,
        setSku,
        description,
        setDescription,
        regularPrice,
        setRegularPrice,
        offerPrice,
        setOfferPrice,
        initialStock,
        setInitialStock,
        minStockAlert,
        setMinStockAlert,
        isLoadingProduct,
        errorMessage,
        submitProduct,
        selectedCategoryName,
        setSelectedCategoryName,
        token
    };
}
