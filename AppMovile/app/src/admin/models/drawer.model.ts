export interface DrawerItemOption {
    name: string; //nombre de la ruta ( dashboard)
    label: string;
    icon: string;
    subitems?:{
        name: string;
        label: string;
        icon: string;
    }[]
}
export interface AdminProfile {
    name: string;
    role: string;
    avatarUrl: string;
    version: string;
}

