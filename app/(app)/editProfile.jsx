import { Ionicons } from '@expo/vector-icons';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import Input from '../../components/Input';
import InputBio from '../../components/InputBio';
import ScreenLayout from '../../components/ScreenLayout';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const EditProfile = () => {

  const {user} = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);

  // useEffect(() => {
  //   setName(user?.user_metadata?.name || '');
  //   setUsername(user?.user_metadata?.username || '');
  //   setLocation(user?.user_metadata?.location || '');
  //   setBio(user?.user_metadata?.bio || '');
  //   setImage(user?.user_metadata?.image || null);
  // }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    
    const getProfileData = async () => {
      const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user?.id)
      .single();

      if (!error && data){
        setName(data.name || '');
        setUsername(data.username || '');
        setLocation(data.location || '');
        setBio(data.bio || '');
        setImage(data.avatar || null);
      }
    };
    if (user?.id) {
      getProfileData();
    }
  }, [user]);

  const onPickImage = async ()=>{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    //ONLY SETS THE IMAGE IF THE USER HASN'T CANCELLED
    if (!result.canceled) {
    setImage(result.assets[0].uri);
    }
  }

  const uploadProfileImage = async () => {

    //READS IMAGE 
    const base64 = await FileSystem.readAsStringAsync(image, {encoding: FileSystem.EncodingType.Base64});

    //CREATES FILE NAME OF PFP, AND PUTS IN CORRECT SUPABASE FOLDER
    const fileName = `${user?.id}-${Date.now()}.jpg`;
    const filePath = `profileImages/${fileName}`;

    //UPLOAD TO SUPABASE STORAGE
    const { error } = await supabase.storage.from('Uploads').upload(filePath, decode(base64), {contentType: 'image/jpeg', upsert: true,});

    if (error){
      console.log(error);
      return null;
    }

    //GETS PUBLIC URL TO DISPLAY PFP
    const { data } = supabase.storage
      .from('Uploads')
      .getPublicUrl(filePath);
      
    return data.publicUrl 
    };
  
  //ONCE USER CLICKS 'UPDATE'
  const onSubmit = async ()=> {
    
    if (!name.trim() || !username.trim()) {
        Alert.alert('Edit Profile', 'Name and Username are required');
        return;
    }


    let imageUrl = image;
    
    if (image && !image.startsWith('http')) {
      imageUrl = await uploadProfileImage();
    }

    // //UPDATES METADATA (OLD)
    // await supabase.auth.updateUser ({
    //     data: {
    //         name: name.trim(),
    //         username: username.trim().toLowerCase(),
    //         location: location.trim(),
    //         bio: bio.trim(),
    //         image: imageUrl,
    //     },
    // });

    //UPDATES SUPABASE TABLES
    const { data, error } = await supabase
        .from('users')
        .update({
            name: name.trim(),
            username: username.trim().toLowerCase(),
            location: location.trim(),
            bio: bio.trim(),
            avatar: imageUrl,
    }).eq('id', user?.id).select();

    if (error) {
        Alert.alert('Edit Profile', error.message);
        return;
    }
    Alert.alert('Success', 'Your Profile Has Been Updated');
    router.push(`/publicProfile/${user?.id}`)
  }

    //LOGOUT FUNCTIONALITY - SUPABASE SIGNOUT
    const onLogout = async ()=>{
      const {error} = await supabase.auth.signOut();
      if (error){
        Alert.alert("Sign Out", "Error signing out")
        return;

      }
    };

    //FOR PREVENTING CRASH AFTER LOGOUT 
    if(!user?.id) {
      return <ScreenLayout />;
    }

  return (
    <ScreenLayout >
      
      <ImageBackground
                  source ={require('../../assets/images/welcome-background-dark.jpg')}
                  style = {styles.bg}
                  resizeMode = 'cover'
              >
        <ScrollView contentContainerStyle={styles.scrollView}>


        <View style = {styles.topBar}>
          <View style={styles.header}>
            <View style={styles.iconLeft}>
              {/* BACK BUTTON */}
              <Pressable onPress={()=> router.back()}>
                <Ionicons 
                name="arrow-back-circle-outline"
                size = {40}
                color = {'white'}
                />  
              </Pressable>
          </View>
            <Text style = {styles.title}> Edit Profile</Text>

            <View style={styles.iconRight}>
              <Pressable onPress={onLogout} style={styles.logoutContainer}>
                            
                <Text style={styles.logoutText}>Logout</Text>
              </Pressable>
              </View>
          
        </View>
      </View>

      <View style={styles.container}>
        <View style={{gap: 15, }}>
          <View style={styles.avatarStyle}>

            {/* USERS AVATAR */}
            <Avatar
              uri = {image}
              size = {130}
              rounded = {65}
              />

              {/* EDIT PROFILE PICTURE BUTTON */}
            <Pressable style={{flexDirection: 'row', marginTop: 50, gap: 5, left: 15,}} onPress = {onPickImage}>
              <Ionicons 
                name="create-outline"
                size = {27}
                color = {'white'}
                /> 

                <Text style={styles.editProfileText}>
                  Edit Profile Picture
                </Text>

            </Pressable>

            
          </View>

          
        </View>
      </View>


      {/* NAME INPUT */}
        <View style={styles.inputStyle}>
            <Ionicons 
            name="person-circle-outline"
            size = {40}
            color = 'white'
            />  

            <Input 
            placeholder="Enter Your Name"
            onChangeText = {setName}
            value = {name}
            />
        </View>

        {/* USERNAME INPUT */}
        <View style={styles.inputStyle}>
            <Ionicons 
            name="people-circle-outline"
            size = {40}
            color = 'white'
            />  

            <Input 
            placeholder="Enter Your Username"
            onChangeText = {setUsername}
            value = {username}
            />
        </View>

        {/* LOCATION INPUT */}
        <View style={styles.inputStyle}>
            <Ionicons 
            name="location-outline"
            size = {40}
            color = 'white'
            />  

            <Input 
            placeholder="Enter Your Location/City"
            onChangeText = {setLocation}
            value = {location}
            />
        </View>

        {/* BIO INPUT */}
        <View style={styles.inputStyle}>
            <Ionicons 
            name="brush-outline"
            size = {40}
            color = 'white'
            />  

            <InputBio 
            placeholder="Enter Your Bio"
            onChangeText = {setBio}
            multiline
            value = {bio}
            />
        </View>

        <View style={{alignItems: 'center', marginTop: 25}}>
        <Button title='Update' onPress = {onSubmit} />
        </View>
       </ScrollView>
      </ImageBackground>
    </ScreenLayout> 
  );


  
}


export default EditProfile

const styles = StyleSheet.create({
      iconRight: {
      position: 'absolute',
      right: 13,
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
    },
    logoutContainer: {
    borderWidth: 0.6,
    borderColor: '#bd0000ef',
    padding: 5,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: theme.fonts.medium,
    color: '#bd0000ef',
  },

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
    iconLeft: {
      
      position: 'absolute',
      left: 5,
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
      
    },
    avatarStyle: {
      flexDirection: 'row',
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
    container: {
      left: 25,
      flexDirection: 'row'
    },
    bg: {
        flex: 1,
    },
    usernameStyle: {
      color: 'white',
      fontSize: 30,
      fontWeight: theme.fonts.extraBold,
      marginTop: 10,
    },
    information: {
      flexDirection: 'row',
      gap: 5,
      marginTop: 10,
    },
    infoText: {
      fontSize: 20,
      color: 'white',
      fontWeight: theme.fonts.medium,
      marginTop: 2,
    },
    inputStyle: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 15,
        padding: 10,
    },
    scrollView: {
      paddingBottom: 100,
    }

})


 