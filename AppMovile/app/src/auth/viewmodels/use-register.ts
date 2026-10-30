import {useState} from "react";
import {useRouter} from "expo-router";
import {AuthService} from "@/app/src/auth/services/auth.service";

export function useRegister(){
    const [fullName, setFullName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState<string | null>("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleRegister = async () => {
        if(!fullName || !lastName || !phone || !email || !password || !confirmPassword){
            setErrorMessage("All fields are required")
            return
        }

        if (password !== confirmPassword){
            setErrorMessage("The password is not match")
            return
        }

        if (email )

            setErrorMessage(null)
        setIsLoading(true)

        try {
            const response = await AuthService.register(fullName, lastName, phone, email, password)
            router.replace("/(public)")
        } catch (error:any) {
            setErrorMessage(error.message)
        }finally{
            setIsLoading(false)
        }
    }
    return {
        fullName,
        lastName,
        password,
        confirmPassword,
        email,
        phone,
        handleRegister,
        setFullName,
        setLastName,
        setPassword,
        setConfirmPassword,
        setEmail,
        setPhone,
        errorMessage,
        isLoading,
    }
}
