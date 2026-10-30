import {useRouter} from "expo-router";
import {useState} from "react";
import {AdminProfile, DrawerItemOption} from "@/app/src/admin/models/drawer.model";

export function useDrawer(){
    const router = useRouter()

    const [profile]=useState<AdminProfile>({
        name:"Adonay Hernandez",
        role:"System managment",
        avatarUrl:"https://i.pinimg.com/736x/41/f6/5e/41f65e50e7b4535b3e903273866cf81e.jpg",
        version:"v4.4.4"
    })

    const navigationOptions:DrawerItemOption[]=[
        {name:"dashboard",label:"Dashboard",icon:"grid"},
        {name:"orders",label:"Orders",icon:"package"},
        {
            name:"inventory",
            label:"Inventory",
            icon:"archive",
            subitems:[
                {
                    name:"inventory",
                    label:"Categories",
                    icon:"folder",
                },
                {
                    name:"create-product",
                    label:"Products",
                    icon:"file-text",
                },
                {
                    name:"create-service",
                    label:"Servicios",
                    icon:"tool",
                }
            ]
        }
    ]

    return {
        profile,
        navigationOptions
    }
}