import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { Drawer } from "expo-router/drawer";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useCreateProduct } from "../src/products/viewmodels/use-create-product";

export default function CreateProductScreen() {

    const router = useRouter();
    const {
        name,
        setName,
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
        categories,
        fetchCategories,
        isLoadingCategories,
        isCategoriesShowModal,
        setIsCategoriesShowModal,
        selectedCategoryName,
        setSelectedCategoryName,
        token
    } = useCreateProduct()
    return (
        <SafeAreaView
            style={styles.container}
        >
            <Drawer.Screen options={{headerShown: false}}/>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{flex: 1}}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.replace("/(protected)/dashboard")}
                    >
                        <Ionicons name="arrow-back-outline" size={26}/>
                    </TouchableOpacity>
                    <View style={styles.titlewrapper}>
                        <Text style={styles.headerTitle}>ADMIN PORTAL</Text>
                        <Text style={styles.headerSubTitle}>Nuevo Producto</Text>
                    </View>
                </View>

                <ScrollView style={styles.scrollContent}>
                   <View style={styles.card}>
                       <View style={styles.cardHeader}>
                           <Feather name="clipboard" size={20} color="#006C47" style={{marginRight:10}}/>
                           <Text style={styles.cardTitle}>Informacion General</Text>
                       </View>
                       <View style={styles.inputGroup}>
                           <Text style={styles.inputlabel}>Nombre del producto</Text>
                           <TextInput
                               placeholder="Ej. Zapato Nike"
                               style={styles.textInput}
                               value={name}
                               onChangeText={setName}
                           />
                       </View>
                       <View style={styles.inputGroup}>
                           <Text style={styles.inputlabel}>Categoria</Text>
                           <TouchableOpacity
                            style={styles.selectorInput}
                            onPress={() => { fetchCategories(); setIsCategoriesShowModal(true); }}>
                               <Text>{selectedCategoryName || "Selecciona la categoria"}</Text> 
                               <Feather name="chevron-down" size={20}/>
                           </TouchableOpacity>
                       </View>
                       <View style={styles.inputGroup}>
                           <Text style={styles.inputlabel}>SKU / Codigo de barra</Text>
                           <View style={styles.inputWithicon}>
                               <MaterialCommunityIcons
                                   name="barcode-scan"
                                   size={20}
                                   style={{marginRight:10}}/>
                               <TextInput
                                   placeholder="PR-7878787878787"
                                   style={styles.textInputScan}
                                   value={sku}
                                   onChangeText={setSku}
                               />
                           </View>
                       </View>
                       <View style={styles.inputGroup}>
                           <Text style={styles.inputlabel}>Descripcion Detallada</Text>
                           <TextInput
                               placeholder="Describe los atributos principales, materiales, confeccion"
                               multiline
                               numberOfLines={5}
                               textAlignVertical="top"
                               maxLength={2000}
                               style={styles.textAreaInput}
                               value={description}
                               onChangeText={setDescription}
                           />
                       </View>
                       <View style={styles.chartCounterDescription}>
                           <Text>
                               {description.length} / 2000
                           </Text>
                       </View>
                   </View>
                    {/**PRECIOS E INVENTARIOS*/}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Feather
                                name="dollar-sign"
                                size={20}
                                color="#006C47"
                                style={{marginRight:10}}
                            />
                            <Text style={styles.cardTitle}>Precios e Inventario</Text>
                        </View>
                        <View style={styles.rowCols}>
                            <View style={styles.col}>
                                <Text style={styles.inputlabel}>Precio Regular</Text>
                                <View style={styles.inputPriceWrapper}>
                                    <Text style={{marginRight:6}}>$</Text>
                                    <TextInput
                                        placeholder="0.0"
                                        keyboardType="numeric"
                                        style={styles.priceInput}
                                        value={regularPrice}
                                        onChangeText={setRegularPrice}
                                    />
                                    
                                </View>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.inputlabel}>Precio Oferta</Text>
                                <View style={styles.inputPriceWrapper}>
                                    <Text style={{marginRight:6}}>$</Text>
                                    <TextInput
                                        placeholder=""
                                        keyboardType="numeric"
                                        style={styles.priceInput}
                                        value={offerPrice}
                                        onChangeText={setOfferPrice}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.rowCols}>
                            <View style={styles.col}>
                                <Text style={styles.inputlabel}>Stock Inicial</Text>
                                <View style={styles.inputPriceWrapper}>
                                    <Feather name="hash" size={16} color="#6B7280" style={{marginRight:6}} />
                                    <TextInput
                                        placeholder="50"
                                        keyboardType="numeric"
                                        style={styles.priceInput}
                                        value={initialStock}
                                        onChangeText={setInitialStock}
                                    />
                                </View>
                            </View>
                            <View style={styles.col}>
                                <Text style={styles.inputlabel}>Stock Minimo</Text>
                                <View style={styles.inputPriceWrapper}>
                                    <Feather name="alert-circle" size={16} color="#6B7280" style={{marginRight:6}} />
                                    <TextInput
                                        placeholder="5"
                                        keyboardType="numeric"
                                        style={styles.priceInput}
                                        value={minStockAlert}
                                        onChangeText={setMinStockAlert}
                                    />
                                </View>
                            </View>
                        </View>
                        {errorMessage && (
                            <View style={styles.errorContainer}>
                                <Feather name="alert-triangle" size={16} color="#EF4444" style={{marginRight: 6}} />
                                <Text style={styles.errorText}>{errorMessage}</Text>
                            </View>
                        )}
                        <TouchableOpacity
                            style={[
                                styles.btnSave,
                                (isLoadingProduct || !token) && { opacity: 0.6 }
                            ]}
                            onPress={submitProduct}
                            disabled={isLoadingProduct || !token}
                        >
                            {isLoadingProduct ? (
                                <ActivityIndicator color="#FFF" size="small" />
                            ) : (
                                <>
                                    <Ionicons style={styles.checkIcon} name="checkmark-outline" size={22} color={"#FFF"} />
                                    <Text style={styles.btnSaveText}>Guardar Producto</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Modal
                visible={isCategoriesShowModal}
                transparent
                animationType="slide"
                onRequestClose={() => setIsCategoriesShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar Categoría</Text>
                            <TouchableOpacity
                                onPress={() => setIsCategoriesShowModal(false)}
                            >
                                <Feather name="x" size={22} color="#374151" />
                            </TouchableOpacity>
                        </View>
                        {isLoadingCategories ? (
                            <ActivityIndicator size="large" color="#006C47" />
                        ) : (
                            <FlatList
                                data={categories}
                                keyExtractor={(item) => item.id.toString()}
                                ListEmptyComponent={
                                    <Text style={styles.emptyText}>No hay categorías disponibles</Text>
                                }
                                renderItem={({ item }) => {
                                    const isSelected = item.id === categoryId
                                    return (
                                        <TouchableOpacity
                                            style={[styles.categoryOption, isSelected && styles.categoryOptionSelected]}
                                            onPress={() => {
                                                setCategoryId(item.id)
                                                setSelectedCategoryName(item.name)
                                                setIsCategoriesShowModal(false)
                                            }}
                                        >
                                            <Text style={[styles.categoryOptionText, isSelected && styles.categoryOptionTextSelected]}>
                                                {item.name}
                                            </Text>
                                            {isSelected && <Feather name="check" size={18} color="#006C47" />}
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: "#F9FAFB",
    },
    titlewrapper: {
        flex: 1,
        marginLeft: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        letterSpacing: 0.8,
    },
    headerSubTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#006C47",
        marginTop: 2
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    card: {
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
    },
    inputGroup: {
        marginBottom: 10,
    },
    inputlabel: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#374151",
        marginBottom: 8,
    },
    textInput: {
        height: 48,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: 16,
        fontSize: 14,
        borderRadius: 10,
    },
    selectorInput: {
        height: 48,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 14,
        borderColor: "#E5E7EB",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    inputWithicon: {
        height: 48,
        borderWidth: 1,
        flexDirection: "row",
        borderColor: "#E5E7EB",
        paddingHorizontal: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    textInputScan: {
        flex: 1,
        padding: 0,
    },
    textAreaInput: {
        height: 120,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
    },
    chartCounterDescription: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    rowCols: {
        flexDirection: "row",
        gap: 8,
    },
    col: {
        flex: 1,
        marginBottom: 5,
    },
    inputPriceWrapper: {
        height: 48,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
    },
    priceInput: {
        flex: 1,
        padding: 0,
    },
    btnSave: {
        backgroundColor: "#006C47",
        height: 48,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        marginTop: 15,
    },
    checkIcon: {
        margin: 8,
    },
    btnSaveText: {
        color: "#FFF",
        fontSize: 15,
    },
    modalOverlay: {
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
        flex: 1,
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        maxHeight: "60%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    categoryOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    categoryOptionSelected: {
        backgroundColor: "#ECFDF5",
    },
    categoryOptionText: {
        fontSize: 16,
        color: "#374151",
    },
    categoryOptionTextSelected: {
        color: "#006C47",
        fontWeight: "600",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    emptyText: {
        textAlign: "center",
        color: "#6B7280",
        marginVertical: 24,
        fontSize: 14,
    },
    errorContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEE2E2",
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    errorText: {
        color: "#B91C1C",
        fontSize: 13,
        flex: 1,
    },
})
