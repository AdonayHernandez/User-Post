import {useRouter} from "expo-router";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {Feather} from "@expo/vector-icons";
import {useRegister} from "@/app/src/auth/viewmodels/use-register";


export default function RegisterScreen(){
    const router = useRouter();
    const {
        email,
        lastName,
        fullName,
        password,
        confirmPassword,
        phone,
        setEmail,
        setLastName,
        setFullName,
        setPassword,
        setConfirmPassword,
        setPhone,
        handleRegister,
        errorMessage,
        isLoading
    } = useRegister()

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "android" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Create Account</Text>
                    <Text style={styles.label}>Full name</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="user" size={20} color="#9CA3AF" />
                        <TextInput
                            value={fullName}
                            onChangeText={setFullName}
                            style={{flex: 1, height:"100%", marginLeft:8}}
                            placeholder={"Itamar"}
                        />
                    </View>

                    <Text style={styles.label}>Last name</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="user" size={20} color="#9CA3AF" />
                        <TextInput
                            value={lastName}
                            onChangeText={setLastName}
                            style={{flex: 1, height:"100%", marginLeft:8}}
                            placeholder={"Medrano"}
                        />
                    </View>
                    <Text style={styles.label}>Phone</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="phone" size={20} color="#9CA3AF" />
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            style={{flex: 1, height:"100%", marginLeft:8}}
                            placeholder={"2121-2828"}
                        />
                    </View>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="mail" size={20} color="#9CA3AF" />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            style={{flex: 1, height:"100%", marginLeft:8}}
                            placeholder={"name@user.com"}
                            keyboardType={"email-address"}
                        />
                    </View>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="lock" size={20} color="#9CA3AF" />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            style={{flex: 1, height:"100%", marginLeft:8}}
                            placeholder={"*************"}
                            secureTextEntry={true}
                        />
                    </View>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.inputContainer}>
                        <Feather name="shield" size={20} color="#9CA3AF" />
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={{flex: 1, height:"100%", marginLeft:8}}
                            placeholder={"*************"}
                            secureTextEntry={true}
                        />
                    </View>

                    {errorMessage && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                    )}

                    {isLoading ?(
                        <ActivityIndicator size="large" color="#006C47" />
                    ):(
                        <TouchableOpacity
                            style={styles.buttonRegister} onPress={handleRegister}>
                            <Text style={styles.buttonRegisterText}>Register</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.singRow}>
                    <Text style={styles.singInText}>Already habe an account ?</Text>
                    <TouchableOpacity
                        onPress={()=> router.push("/(public)")}
                    >
                        <Text style={styles.singTextLink}> Log in here</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    scrollContainer: {
        flexGrow: 1,
        padding:24,
        justifyContent: "center",
        paddingTop: 40
    },
    card: {
        backgroundColor: "#fff",
        borderWidth: 1,
        padding: 12,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOffset:{width:0, height:2},
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1F2937",
        textAlign: "center",
        marginBottom: 20
    },
    label:{
        fontSize:14,
        color:"#374151",
        marginBottom:10
    },
    inputContainer:{
        flexDirection:"row",
        alignItems:"center",
        borderWidth:1,
        borderColor:"#D1D5DB",
        paddingHorizontal:12,
        borderRadius:8,
        marginBottom:15,
        height:50,
    },
    buttonRegister:{
        backgroundColor:"#006C47",
        justifyContent:"center",
        alignItems:"center",
        height:50,
        borderRadius:8,
    },
    buttonRegisterText:{
        color:"#fff",
        fontSize:16,
        fontWeight:"bold"
    },
    singRow: {
        flexDirection:"row",
        justifyContent: "center",
        marginTop: 20,
    },
    singInText: {
        fontSize:14,
        color:"#6B7280",
    },
    singTextLink: {
        fontSize:14,
        color:"#006C47",
        fontWeight:"bold",
        marginLeft: 5
    },
    errorContainer:{
        borderWidth:1,
        borderRadius: 8,
        backgroundColor:"#FEE2E2",
        borderColor:"#FCA5A5",
        marginBottom:20,
        padding: 12
    },
    errorText:{
        fontSize:15,
        textAlign:"center",
        color:"#DC26260",
        fontWeight:"500",
    }
})
