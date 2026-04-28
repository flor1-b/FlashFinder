import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ImageBackground, Pressable, StyleSheet, Text, View, } from 'react-native';
import Avatar from '../../components/Avatar';
import ScreenLayout from '../../components/ScreenLayout';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';


//OLD NOT IN USE


const Profile = () => {

  const {setAuth, user} = useAuth();
  const router = useRouter();


  const [profile, setProfile] = useState(null);

  
  useEffect(() => {

  //PREVENTS CRASH AFTER LOGOUT
  if (!user?.id) return;

  //FETCHES PROFILE DATA FROM TABLE
  const getProfileData = async () => {
    const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq ('id', user.id)
    .single();

    if (!error) {
      setProfile(data);
    }
  };

  if (user?.id) {
    getProfileData();
  }
  }, [user]);



  const onLogout = async ()=>{
    
    const {error} = await supabase.auth.signOut();
    if (error){
      Alert.alert("Sign Out", "Error signing out")

    }
    setAuth(null);
  };

  return (
    <ScreenLayout >
      
      <ImageBackground
                  source ={require('../../assets/images/welcome-background-dark.jpg')}
                  style = {styles.bg}
                  resizeMode = 'cover'
              >


        <View style = {styles.topBar}>
          <View style={styles.header}>
            <View style={styles.iconLeft}>
              {/* BACK BUTTON */}
              <Pressable onPress={()=> router.push('home')}>
                <Ionicons 
                name="arrow-back-circle-outline"
                size = {40}
                color = {'white'}
                />  
              </Pressable>
            
          </View>


          <Text style = {styles.title}>Profile</Text>

          <View style={styles.iconRight}>

            <Pressable onPress={onLogout}>
                <Ionicons 
                name="log-out-outline"
                size = {30}
                color = {'#e36161'}
                />  
                
                
              </Pressable>
            <Pressable onPress={onLogout}>
              <Text style={styles.subtitle}>
                  Log Out
                </Text>
            </Pressable>
          </View>

        </View>
      </View>

      <View style={styles.container}>
        <View style={{gap: 15}}>
          <View style={styles.avatarStyle}>

            {/* USERS AVATAR */}
            <Avatar
              uri = {profile?.avatar}
              size = {130}
              rounded = {65}
              />
          </View>

          {/* EDIT PROFILE PICTURE BUTTON */}
            <Pressable style={styles.editProfileRow} onPress ={()=> router.push('editProfile')}>
              <Ionicons 
                name="create-outline"
                size = {27}
                color = {'white'}
                /> 

                <Text style={styles.editProfileText}>
                  Edit Profile
                </Text>

            </Pressable>
        </View>


        {/* INFO SECTION TO RIGHT OF PROFIEL PIC */}
        <View style ={styles.containerRight}>
        {/* USERNAME AND LOCATION */}
        <View style={{alignItems: 'flex-start', gap: 5}}>
          <Text style={styles.usernameStyle}>
            {profile?.name}
          
          </Text>
          
          


        </View>

        <Text style={styles.roleStyle}>
            {profile?.role}
          
          </Text>

        

        <View style={styles.information}>
          <Ionicons 
                name="checkmark-circle"
                size = {30}
                color = {'white'}
                /> 
            <Text style={styles.infoText}>
              {profile?.username}
            </Text>

            <Ionicons 
                name="location-outline"
                size = {30}
                color = {'white'}
                /> 
            <Text style={styles.infoText}>
              {profile?.location}
            </Text>
        </View>

        {/* EMAIL, LOCATION, BIO */}
        <View style={styles.information}>
          <Ionicons 
                name="mail-outline"
                size = {30}
                color = {'white'}
                /> 
            <Text style={styles.infoText}>
              {user && user.email}
            </Text>
        </View>

        {
          profile?.bio && (
            <Text style={styles.infoTextBio}>{profile.bio}</Text>
          )
        }

        </View>

      </View>

        

        
        

      

      </ImageBackground>
    </ScreenLayout> 
  );
}


export default Profile

const styles = StyleSheet.create({

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 30,
    marginLeft: 10,

  },
  title: {
    color: 'white',
    fontSize: 32,
    position: 'absolute',
    alignSelf: 'center',
    fontWeight: theme.fonts.extraBold,
    letterSpacing: 0,
    },
    iconRight: {
      position: 'absolute',
      right: 8,
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',

      
    },
    iconLeft: {
      
      position: 'absolute',
      left: 5,
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
      
    },
    subtitle:{
        color: '#e36161',
        textAlign: 'center',
        fontWeight: theme.fonts.extraBold,
        fontSize: 17,
        
    },
    avatarStyle: {
      alignItems: 'center',
      marginTop: 20,
      

      borderRadius: 70,
    },
    editProfileRow: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    editProfileText: {
      fontSize: 15,
      color: 'white',
      fontWeight: theme.fonts.medium,
      marginTop: 2,
    },

    //TOP PROFILE BOX
    container: {
      
      marginLeft: 15,
      flexDirection: 'row',
      marginTop: '5',
      alignItems: 'flex-start',
      
    },
    //RIGHT SIDE OF PROFILE BOX
    containerRight: {
      marginTop: 15,
      gap: 10,
      marginLeft: 25,
      flex: 1,
      
    },
    bg: {
        flex: 1,
    },
    usernameStyle: {
      color: 'white',
      fontSize: 25,
      fontWeight: theme.fonts.extraBold,
      marginTop: 10,
    },
    information: {
      flexDirection: 'row',
      gap: 4,
      marginTop: 0, 
    },
    infoText: {
      fontSize: 15,
      color: 'white',
      fontWeight: theme.fonts.medium,
      marginTop: 5,
      flexShrink: 1,
    },
    infoTextBio: {
    fontSize: 15,
      color: 'white',
      fontWeight: theme.fonts.medium,
      flexShrink: 1,
      textAlign: 'center',
      marginRight: 12,
    },
    roleStyle: {
      color: '#e8e8e8',
      fontSize: 20,
      fontWeight: theme.fonts.extraBold,
      marginTop: 0,
      textTransform: 'capitalize',
    }

})


 