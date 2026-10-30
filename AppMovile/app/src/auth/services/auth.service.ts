import { AuthResponse, UserResponse } from "../models/auth.model";
import axios, { isAxiosError } from "axios";
const API_URL = "https://api-ecommerce-5aby.onrender.com";
export const AuthService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            return response.data;
        } catch (error: any) {
            console.log("ERROR LOGIN COMPLETO:", error);
            if (isAxiosError(error) && error.response) {
                console.log("ERROR RESPONSE:", error.response.data);
                throw new Error(error.response.data?.Message || "Error to login");
            }
            throw new Error("Server error");
        }
    },
    register: async (
        name: string,
        lastname: string,
        phone: string,
        email: string,
        password: string
    ) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                name,
                lastname,
                phone,
                email,
                password
            });
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data?.Message || "Error to login");
            }
            throw new Error("Server error");
        }
    },
    updateUser: async (
        userId: number,
        name: string,
        lastname: string,
        phone: string,
        token: string
    ): Promise<UserResponse> => {
        console.log("TOKEN", token);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("lastname", lastname);
            formData.append("phone", phone);

            const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
            const response = await axios.put(`${API_URL}/users/upload/${userId}`, formData, {
                headers: {
                    "Authorization": authTokenHeader,

                }
            });
            console.log(response);
            return response.data;
        } catch (error: any) {
            console.log(error);

            if (axios.isAxiosError(error) && error.response) {
                console.log("ERROR RESPONSE:", error.response.data);
                const serverMsg = error.response.data?.Message || error.response.data?.message;
                throw new Error(serverMsg || "Error al actualizar perfil");
            }
            throw new Error("Server error");
        }
    }
};