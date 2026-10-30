export interface Role {
    id: number;
    name: string;
    image: string;
    route: string;
}

export interface UserResponse {
    email: string;
    id: number;
    imagen: string;
    lastName: string;
    name: string;
    notification_tokens: string | null;
    phone: string;
    role: Role[];
}

export interface AuthResponse {
    token: string;
    userResponse: UserResponse;
}

