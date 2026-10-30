import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, StyleSheet, Text, View, StyleProp, TouchableOpacity } from "react-native";
import {useDrawer} from "@/app/src/admin/viewmodels/use-drawer";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "@/app/src/context/AuthContext";
import { useRouter} from "expo-router";

export default function ProtectedLayout() {
    const insets = useSafeAreaInsets();
    const { profile, navigationOptions } = useDrawer();
    const { user, clearSession } = useAuth();
    const router = useRouter();
    const [isInventoryExpanded, setIsInventoryExpanded] = useState(false);
    return (
        <GestureHandlerRootView>
            <Drawer
                screenOptions={{
                    headerShown: false,
                    headerTintColor: "#006C47",
                }}
                drawerContent={(props) => {
                    const activeIndex = props.state.index;
                    const activeRouteName = props.state.routeNames[activeIndex];

                    return (
                        <View
                            style={[
                                styles.drawerContainer,
                                { paddingTop: insets.top },
                            ]}
                        >
                            <View style={styles.header}>
                                <View style={styles.headerInfoUser}>
                                    <Image
                                        style={styles.avatar}
                                        source={{ uri: profile.avatarUrl }}
                                    />
                                    <View style={styles.headerInfo}>
                                        <Text style={styles.adminName}>
                                            {user ? `${user.name} ${user.lastName || ''}`.trim() : profile.name}
                                        </Text>
                                        <Text style={styles.adminRole}>
                                            {profile.role}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.versionTag}>
                                    <Text>{profile.version}</Text>
                                </View>
                            </View>

                            <View style={styles.menuList}>
                                {navigationOptions.map((option) => {
                                    const isSelected =
                                        activeRouteName === option.name;
                                    const hasSubItems = !!option.subitems;
                                    return (
                                        <View key={option.name}>
                                            <TouchableOpacity
                                                style={[styles.menuItemList, isSelected && styles.menuItemSelected]}

                                                onPress={() => {
                                                    if(hasSubItems){
                                                        setIsInventoryExpanded(!isInventoryExpanded)
                                                    }else{
                                                        router.push(`/(protected)/${option.name}` as any)
                                                    }
                                                }}
                                            >
                                                <Feather
                                                    name={option.icon as any}
                                                    size={20}
                                                    color={isSelected ? "#fff": "#374151"}
                                                    style={styles.menuIcon}
                                                ></Feather>
                                                <Text
                                                    style={[styles.menuText,
                                                        isSelected && styles.menuTextSelected
                                                    ]}
                                                >
                                                    {option.label}
                                                </Text>
                                                {hasSubItems && (
                                                    <Feather
                                                        name={isInventoryExpanded ? "chevron-up" : "chevron-down"}
                                                        size={16}
                                                        style={{marginLeft:"auto"}}
                                                    />
                                                )}
                                            </TouchableOpacity>
                                            {hasSubItems && isInventoryExpanded && option.subitems?.map((sub)=>{
                                                const isSubSelected = activeRouteName === sub.name;
                                                return(
                                                    <TouchableOpacity
                                                        key={sub.name}
                                                        style={[
                                                            styles.menuItemList,
                                                            {paddingLeft:40},
                                                            isSubSelected && styles.menuItemSelected
                                                        ]}
                                                        onPress={()=>router.push(`/(protected)/${sub.name}` as any)}
                                                    >
                                                        <Feather
                                                            name={sub.icon as any}
                                                            size={16}
                                                            color={isSubSelected ? "#FFF": "#4B5563"}
                                                            style={styles.menuIcon}
                                                        />
                                                        <Text style={[styles.menuText, {fontSize:14},isSubSelected && styles.menuTextSelected]}>{sub.label}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </View>
                                    );
                                })}
                            </View>
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={async() => {
                                    await clearSession();
                                }}
                            >
                                <Feather name="log-out" size={20} color="#EF4444"/>
                                <Text style={styles.logoutText}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
            >
                <Drawer.Screen name="dashboard" />
                <Drawer.Screen name="inventory" />
                <Drawer.Screen name="create-product" />
                <Drawer.Screen name="create-service" />
                <Drawer.Screen name="profile" />
            </Drawer>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
    },
    header: {
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        alignItems: "flex-start",
    },
    headerInfoUser: {
        flexDirection: "row",
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 30,
    },
    headerInfo: {
        marginLeft: 15,
        marginTop: 5,
    },
    adminName: {
        fontSize: 20,
        color: "#006C47",
        fontWeight: "bold",
    },
    adminRole: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#6B7280",
    },
    versionTag: {
        borderWidth: 1,
        paddingHorizontal: 8,
        borderColor: "#D1D5DB",
        paddingVertical: 2,
        marginTop: 8,
        borderRadius: 12,
    },
    menuList: {
        flex: 1,
        paddingTop:15,
        paddingHorizontal:12,
    },
    menuItemList: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius:24,
        marginVertical:4,
    },
    menuItemSelected: {
        backgroundColor: "#00B074",
    },
    menuIcon:{
        marginRight: 15,
    },
    menuText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#374151",
    },
    menuTextSelected: {
        color: "#FFF",
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        marginBottom: 15,
    },
    logoutText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#EF4444",
    }
});