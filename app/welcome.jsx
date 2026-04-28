import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import Button from '../components/Button'
import ScreenLayout from '../components/ScreenLayout'
import { theme } from '../constants/theme'

const welcome = () => {

    //PAGE ROUTING
    const router = useRouter();
  
  
    return (
    <ScreenLayout>
        <ImageBackground
            source ={require('../assets/images/welcome-background-dark.jpg')}
            style = {styles.bg}
            resizeMode = 'cover'
        >



    <View style={styles.screen}>
        
            <StatusBar style = "dark" />

            
            <Image source={require('../assets/images/ff-logo-white-transparent-crop.png')} style={{resizeMode: 'contain' , alignSelf: 'center', width: '100%', height: 200,}}/>
            <View style={styles.container}>

                
                {/* <Text style={styles.title}>Flash Finder</Text> */}
                
                <Text style={styles.subtitle}>Finding your next tattoo has never been easier.</Text>
            </View>
 

            {/* GET STARTED SLASH SIGN UP BUTTON */}
            <View style={styles.footer}>
                <Button
                    title = 'Get Started'
                    onPress={()=> router.push('signUp')}
                />
 
            </View>

            <View style={styles.loginContainer}>
                <Text style={styles.subtitle}>
                    Already have an account?
                </Text>

                <Pressable onPress={()=> router.push('login')}>
                    <Text style={styles.login}>
                        Login
                    </Text>
                </Pressable>

            </View>      
    </View>

    </ImageBackground>
    </ScreenLayout>
      
    
  )
}

export default welcome

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        //backgroundColor: 'white',
        paddingHorizontal: 5,
        paddingTop: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
        
    },

    //TITLE AND SUBTITLE CONTAINER
    container: {
        flex: 0,
        borderRadius: 16,
        marginTop: 0,
        justifyContent: 'center',
        marginBottom: 30,
    },

    title: {
        color: theme.colors.gray,
        fontSize: 53,
        textAlign: 'center',
        fontWeight: theme.fonts.extraBold,
        letterSpacing: 0,
        marginTop: 6,

        //SHADOWS SLASH OUTLINE 
        textShadowColor: theme.colors.primary,
        textShadowOffset: { width: 1, height: 2},
        textShadowRadius: 3,
    },
    footer: {
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    bg: {
        flex: 1,
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
    login:{
        textAlign: 'center',
        fontWeight: theme.fonts.extraBold,
        color: theme.colors.primaryBlue,
        marginTop: 12,

    },
    loginContainer:{
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderRadius: 16,
        
    }
})

