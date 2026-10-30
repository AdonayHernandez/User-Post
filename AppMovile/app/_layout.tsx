import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider, useAuth } from '@/app/src/context/AuthContext';
import { useEffect } from 'react';

function NavigationGuard() {
    const { token, isLoadingSession } = useAuth();

    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoadingSession) return;

        // DETECTAMOS SI ESTOY EN PÁGINAS PROTEGIDAS
        const inProtectedScreen = segments[0]==="(protected)"

        if (token) {
            console.log("USUARIO LOGUEADO", `Bearer ${token}`)

            if (!inProtectedScreen) {
                console.log("Entro al protected")
                router.replace('/(protected)/dashboard');
            }
        } else {
            if (inProtectedScreen) {
                console.log("Usuario no logueado")
                router.replace('/(public)');
            }
        }
    }, [token, isLoadingSession, segments]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(public)" />
            <Stack.Screen name="(protected)" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                <NavigationGuard />
            </AuthProvider>
        </GestureHandlerRootView>
    );
}