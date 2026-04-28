import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useRef } from 'react'
import { Alert, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Button from '../components/Button'
import Input from '../components/Input'
import ScreenLayout from '../components/ScreenLayout'
import { theme } from '../constants/theme'
import { supabase } from '../lib/supabase'


const Login = () => {
    
    //PAGE ROUTING
    const router = useRouter();

    const emailRef = useRef("");
    const passwordRef = useRef("");

    const onSubmit = async()=>{
        if(!emailRef.current || !passwordRef.current){
            Alert.alert('Login', 'Please fill out all the required fields');
            return;
        }

        // REMOVES BLANK SPACES FROM EMAIL AND PASS
        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();

        //LOGIN 
        const res = await supabase.auth.signInWithPassword({
            email,
            password,

        });

        console.log('login res:', res);

        if (res.error) {
            Alert.alert('Login', res.error.message);
            return;
        }

    }

  return (
    <ScreenLayout>
        <ImageBackground
            source ={require('../assets/images/welcome-background-dark.jpg')}
            style = {styles.bg}
            resizeMode = 'cover'
        >

    <ScrollView>
    <View style={styles.screen}>
        
    <StatusBar style = "dark" />

    {/* BACK BUTTON */}
    <Pressable onPress={()=> router.push('welcome')}>
    <Ionicons 
        name="arrow-back-circle-outline"
        size = {35}
        color = {theme.colors.darkLight}
    />  
    </Pressable>

    {/* WELCOME BACK TEXT */}
    <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>

        <Text style={styles.subtitle}>
            Please login to continue
        </Text>

        {/* LOGIN FORM */}

    <View style={styles.form}>
        
        {/* EMAIL INPUT */}
        <View style={styles.inputIcon}>
            <Ionicons 
            name="mail-outline"
            size = {30}
            color = {theme.colors.darkLight}
            />  

            <Input 
            placeholder="Enter Your Email"
            onChangeText = {value=> emailRef.current = value}
            />
        </View>


        {/* PASSWORD INPUT */}
        <View style={styles.inputIcon}>
            <Ionicons 
            name="lock-closed-outline"
            size = {30}
            color = {theme.colors.darkLight}
            />  

            <Input 
            placeholder="Enter Your Password"
            onChangeText = {value=> passwordRef.current = value}
            secureTextEntry
            />
        </View>

        <Pressable>
            <Text style = {styles.forgotPass}>
                Forgot Password?
            </Text>
        </Pressable>

        <View style={styles.loginButton}>
            <Button
            title = {'Login'}
            onPress={onSubmit}
            />
        </View>

        <View>
            <Text style={styles.subtitle}>
                Don't have an account?
            </Text>

            <Pressable 
            onPress={()=> router.push('signUp')}
            >
                <Text style={styles.signUp}>
                    Sign Up
                </Text>
            </Pressable>
        </View>
    </View>
        
    </View>
           
    </View>
    </ScrollView>

    </ImageBackground>
    </ScreenLayout>
  )
}

export default Login

const styles = StyleSheet.create({

    bg: {
        flex: 1,
    },
    screen: {
        flex: 1,
        paddingHorizontal: 5,
        paddingTop: 24,
        
            
    },
    title: {
        color: theme.colors.gray,
        fontSize: 50,
        textAlign: 'center',
        fontWeight: theme.fonts.extraBold,
        letterSpacing: 0,
        marginTop: 50,

        //SHADOWS SLASH OUTLINE 
        textShadowColor: theme.colors.primary,
        textShadowOffset: { width: 1, height: 2},
        textShadowRadius: 3,
    },
    subtitle:{
        color: theme.colors.gray,
        textAlign: 'center',
        letterSpacing: 1.2,
        //SHADOWS SLASH OUTLINE 
        textShadowColor: theme.colors.primary,
        textShadowOffset: { width: 1, height: 2},
        textShadowRadius: 3,
    },
    container: {
        flex: 1,
        borderRadius: 16,
        marginTop: 20,
        gap: 50,
    },
    form: {
        gap: 25,
    },
    formText: {
        color: theme.colors.gray,
        fontSize: 50,
    },
    inputIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    forgotPass:{
        color: theme.colors.gray,
        textAlign: 'center',
        letterSpacing: 0.5,
        
        //SHADOWS SLASH OUTLINE 
        textShadowColor: theme.colors.primary,
        textShadowOffset: { width: 1, height: 2},
        textShadowRadius: 3,
    },
    loginButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUp:{
        color: theme.colors.primaryBlue,
        textAlign: 'center',
        
        letterSpacing: 1.2,
        fontWeight: theme.fonts.extraBold,
        //SHADOWS SLASH OUTLINE 
        textShadowColor: theme.colors.primary,
        textShadowOffset: { width: 1, height: 2},
        textShadowRadius: 3,
    },
})