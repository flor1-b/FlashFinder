import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useRef, useState } from 'react'
import { Alert, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Button from '../components/Button'
import Input from '../components/Input'
import ScreenLayout from '../components/ScreenLayout'
import { theme } from '../constants/theme'
import { supabase } from '../lib/supabase'


const SignUp = () => {
    
    //PAGE ROUTING
    const router = useRouter();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const nameRef = useRef("");
    const usernameRef = useRef("")
    const [role, setRole] = useState('');

    const onSubmit = async()=>{
        if(!emailRef.current || !passwordRef.current || !nameRef.current || !usernameRef.current){
            Alert.alert('Sign Up', 'Please fill out all the required fields');
            return;
        }
        if(!role){
            Alert.alert('Sign Up', 'Please select a role (Artist or Client), and fill all the required fields')
            return;
        }
        // REMOVES BLANK SPACES FROM NAME EMAIL PASS AND USERNAME
        let name = nameRef.current.trim();
        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();
        let username = usernameRef.current.trim().toLowerCase();
        /////////////////////////
        const res = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    username,
                    role: role,
                },
            },
        });

        console.log('signup res:', res);

        if (res.error) {
            Alert.alert('Sign Up', res.error.message);
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
        <Text style={styles.title}>Get Started</Text>

        <Text style={styles.subtitle}>
            Create an Account
        </Text>

        {/* LOGIN FORM */}

    <View style={styles.form}>
        
        {/* NAME INPUT */}
        <View style={styles.inputIcon}>
            <Ionicons 
            name="person-circle-outline"
            size = {30}
            color = {theme.colors.darkLight}
            />  

            <Input 
            placeholder="Enter Your Full Name"
            onChangeText = {value=> nameRef.current = value}
            />
        </View>

        {/* USERNAME INPUT */}
        <View style={styles.inputIcon}>
            <Ionicons 
            name="shield-checkmark-outline"
            size = {30}
            color = {theme.colors.darkLight}
            />  

            <Input 
            placeholder="Create a Username"
            onChangeText = {value=> usernameRef.current = value}
            />
        </View>


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

        
        {/* ARTIST OR CLIENT ROLE SELECTION */}

        <Text style={styles.subtitle}>
            Select which role applies to you. 
        </Text>

        <View style={styles.roleSelectButton}>
            <Button
            title = {'Artist'}
            onPress={()=> setRole('artist')}
            buttonStyle = {role === 'artist' ? styles.roleActive : styles.roleInactive}
            />

            <Button
            title = {'Client'}
            onPress={()=> setRole('client')}
            buttonStyle = {role === 'client' ? styles.roleActive : styles.roleInactive}
            />
        </View>


        {/* SIGN UP BUTTON */}
        <View style={styles.signUpButton}>
            <Button
            title = {'Sign Up'}
            onPress={onSubmit}
            />
        </View>

        {/* ALREADY HAVE ACCOUNT SLASH LOGIN REDIRECT */}
        <View>
            <Text style={styles.subtitle}>
                Already have an account?
            </Text>

            <Pressable 
            onPress={()=> router.push('login')}
            >
                <Text style={styles.signUp}>
                    Login
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

export default SignUp

const styles = StyleSheet.create({

    bg: {
        flex: 1,
    },
    screen: {
            flex: 1,
            paddingHorizontal: 5,
            paddingTop: 0,
            
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
        marginTop: 10,
        gap: 20,
    },
    form: {
        gap: 15,
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
    signUpButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 0,
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
    roleSelectButton: {
        gap: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    roleActive: {
        backgroundColor: '#28bde681'
    },
    roleInactive: {
        
    }

})