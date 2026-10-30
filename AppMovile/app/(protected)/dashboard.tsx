import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import Drawer from "expo-router/drawer";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDrawer } from "../src/admin/viewmodels/use-drawer";
import { useState, useMemo, useCallback } from "react";
import { useNavigation, useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "@/app/src/context/AuthContext";
import { CategoryService, CategoryResponse, DEFAULT_DASHBOARD_CATEGORIES } from "../src/categories/services/category.service";
import { ProductService, BASE_PRODUCTS } from "../src/products/service/product.service";
import { ProductResponse } from "../src/products/models/product.model";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 44) / 2; // (Ancho total - margenes laterales) / 2

const ALL_CATEGORY_ID = 0;
const ALL_CATEGORY_NAME = "All Categories";

interface CategoryItem {
    id: number;
    name: string;
}

export default function DashboardScreen() {
    const navigation = useNavigation();
    const router = useRouter();
    const { profile } = useDrawer();
    const { token } = useAuth();

    const [categories, setCategories] = useState<CategoryItem[]>([
        { id: ALL_CATEGORY_ID, name: ALL_CATEGORY_NAME },
        ...DEFAULT_DASHBOARD_CATEGORIES.map((c) => ({ id: c.id, name: c.name }))
    ]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(ALL_CATEGORY_ID);
    const [products, setProducts] = useState<ProductResponse[]>(BASE_PRODUCTS);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const openMenu = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const loadData = useCallback(async () => {
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            // 1. Cargar Categorias (incluye base para Dashboard, creadas por usuario y API)
            const cats = await CategoryService.getDashboardCategories(token);
            const categoryList: CategoryItem[] = [
                { id: ALL_CATEGORY_ID, name: ALL_CATEGORY_NAME },
                ...cats.map((c) => ({ id: c.id, name: c.name }))
            ];
            setCategories(categoryList);

            // 2. Cargar Productos para todas las categorias
            const prods = await ProductService.getAllProducts(cats, token);
            setProducts(prods);
        } catch (error) {
            console.log("Error al cargar datos del dashboard:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [token]);

    // Recargar automaticamente cada vez que la pantalla obtiene foco (ej: al volver de crear producto o categoria)
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const handleRefresh = () => {
        setIsRefreshing(true);
        loadData();
    };

    // FILTRAR DINAMICAMENTE LOS PRODUCTOS SEGUN LA CATEGORIA Y LA BUSQUEDA
    const filteredProductsByCategory = useMemo(() => {
        return products.filter((product) => {
            let matchCategory = selectedCategoryId === ALL_CATEGORY_ID;

            if (!matchCategory) {
                if (product.categoryId === selectedCategoryId) {
                    matchCategory = true;
                } else {
                    const selectedCatObj = categories.find((c) => c.id === selectedCategoryId);
                    if (selectedCatObj && product.categoryName) {
                        matchCategory =
                            product.categoryName.trim().toLowerCase() ===
                            selectedCatObj.name.trim().toLowerCase();
                    }
                }
            }

            const matchSearch =
                (product.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.description || "").toLowerCase().includes(searchQuery.toLowerCase());

            return matchCategory && matchSearch;
        });
    }, [products, selectedCategoryId, categories, searchQuery]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Omitir el drawer por defecto */}
            <Drawer.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={openMenu} style={{ padding: 15 }}>
                    <Ionicons name="menu-outline" size={30} color="#005C3A" />
                </TouchableOpacity>

                <Text style={styles.logoText}>ShopEase</Text>
                <TouchableOpacity
                    style={styles.profileContainer}
                    onPress={() => router.push("/(protected)/profile")}
                >
                    <Image
                        source={{ uri: profile.avatarUrl }}
                        style={styles.avatarImage}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} style={styles.searchIcon} />
                <TextInput
                    placeholder="Search products"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
            </View>

            {/* CATEGORIES */}
            <View style={styles.categoriesWrapper}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.categoriesList}
                    renderItem={({ item }) => {
                        const isSelected = item.id === selectedCategoryId;
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    console.log("==========================================");
                                    console.log(` [DASHBOARD] Filtrando por categoría: "${item.name}" (ID: ${item.id})`);
                                    console.log("==========================================");
                                    setSelectedCategoryId(item.id);
                                }}
                                style={[
                                    styles.categoryItem,
                                    isSelected && styles.categoryItemSelected
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.categoryText,
                                        isSelected && styles.categoryTextSelected
                                    ]}
                                >
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            {/* PRODUCTS LIST */}
            {isLoading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#005C3A" />
                    <Text style={styles.loadingText}>Cargando productos...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredProductsByCategory}
                    keyExtractor={(item) => String(item.id)}
                    numColumns={2}
                    columnWrapperStyle={styles.gridRowSpace}
                    contentContainerStyle={styles.productList}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={["#005C3A"]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="cube-outline" size={48} color="#9CA3AF" />
                            <Text style={styles.emptyTitle}>No hay productos</Text>
                            <Text style={styles.emptySubtitle}>
                                {selectedCategoryId === ALL_CATEGORY_ID
                                    ? "Aún no hay productos registrados en el sistema."
                                    : "No se encontraron productos para esta categoría."}
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => {
                        const price = item.offerPrice ?? item.regularPrice ?? 0;
                        const isNew = item.createdAt
                            ? Date.now() - new Date(item.createdAt).getTime() < 86400000 * 3
                            : false;
                        const imageUri =
                            item.imageUrl && item.imageUrl.startsWith("http")
                                ? item.imageUrl
                                : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop";

                        return (
                            <View style={styles.cardContainer}>
                                <View style={styles.imageWrapper}>
                                    <Image
                                        source={{ uri: imageUri }}
                                        style={styles.productImage}
                                    />
                                    {isNew && (
                                        <View style={styles.newBadge}>
                                            <Text style={styles.newBadgeText}>NEW</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.productInfo}>
                                    <Text style={styles.productTitle} numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    <Text style={styles.productDescription} numberOfLines={2}>
                                        {item.description}
                                    </Text>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.priceText}>${price.toFixed(2)}</Text>
                                        <TouchableOpacity style={styles.cardBtn}>
                                            <Ionicons name="cart-outline" size={16} color="#FFF" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 14
    },
    logoText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#005C3A"
    },
    profileContainer: {
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E5E7EB"
    },
    avatarImage: {
        width: 40,
        height: 40
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 20,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 14
    },
    searchIcon: {
        marginRight: 10,
        color: "#9CA3AF"
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: "#1F2937",
        padding: 0
    },
    categoriesWrapper: {
        maxHeight: 50,
        marginBottom: 16
    },
    categoriesList: {
        paddingHorizontal: 16,
        alignItems: "center"
    },
    categoryItem: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        backgroundColor: "#E5E7EB",
        borderRadius: 24,
        marginRight: 10
    },
    categoryItemSelected: {
        backgroundColor: "#005C3A"
    },
    categoryText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#374151"
    },
    categoryTextSelected: {
        color: "#FFF"
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: "#6B7280"
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        paddingHorizontal: 20
    },
    emptyTitle: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: "bold",
        color: "#374151"
    },
    emptySubtitle: {
        marginTop: 4,
        fontSize: 13,
        color: "#6B7280",
        textAlign: "center"
    },
    /* ESTILOS PARA LAS TARJETAS */
    productList: {
        paddingHorizontal: 16,
        paddingBottom: 24
    },
    gridRowSpace: {
        justifyContent: "space-between"
    },
    cardContainer: {
        width: CARD_WIDTH,
        backgroundColor: "#FFF",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    },
    imageWrapper: {
        height: 140,
        width: "100%",
        backgroundColor: "#F3F4F6",
        position: "relative"
    },
    productImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },
    newBadge: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "#005C3A",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    newBadgeText: {
        color: "#FFF",
        fontSize: 10,
        fontWeight: "bold"
    },
    productInfo: {
        padding: 12
    },
    productTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: 2
    },
    productDescription: {
        fontSize: 11,
        color: "#6B7280",
        marginBottom: 8
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    priceText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#1F2937"
    },
    cardBtn: {
        backgroundColor: "#00B074",
        width: 30,
        height: 30,
        justifyContent: "center",
        borderRadius: 15,
        alignItems: "center"
    }
});