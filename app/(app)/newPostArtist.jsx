import { Ionicons } from '@expo/vector-icons';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import NavBar from '../../components/NavBar';
import ScreenLayout from '../../components/ScreenLayout';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const newPostArtist = () => {

const {user} = useAuth();
const router = useRouter();
const [profile, setProfile] = useState(null);
const [postImage, setPostImage] = useState(null);
const [caption, setCaption] = useState('');

const onPickImage = async ()=>{

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    //ONLY SETS THE IMAGE IF THE USER HASN'T CANCELLED
    if (!result.canceled) {
    setPostImage(result.assets[0].uri);
    }
  }

useEffect(() => {

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

  //ON SUBMIT FUNCTION!!!
  const onSubmit = async ()=> {
    //CHECK IF USERS HAVE UPLOADED AN IMAGE FIRST + ALERT
    if (!postImage){
      Alert.alert('Upload Media', 'Please Upload a Photo to Create a Post');
      return;
    }
    const imageUrl = await uploadPostImage();
    if (!imageUrl) return;
    const { error } = await supabase.from('posts').insert({
      userid: user.id, 
      file: imageUrl,
      body: caption.trim(),
    });
    if (error) {
      Alert.alert('Create Post', error.message)
    }
    Alert.alert('Post Uploaded', 'Your Post Has Been Uploaded!')
    router.back();
  }

  const uploadPostImage = async () => {
      //READS IMAGE 
      const base64 = await FileSystem.readAsStringAsync(postImage, {encoding: FileSystem.EncodingType.Base64});
      //CREATES FILE NAME, AND PUTS IN CORRECT SUPABASE FOLDER
      const fileName = `${user.id}-${Date.now()}.jpg`;
      const filePath = `postImages/${fileName}`;
      //UPLOAD TO SUPABASE STORAGE
      const { error } = await supabase.storage.from('posts').upload(filePath, decode(base64), {contentType: 'image/jpeg', upsert: true,});
      if (error){
        console.log(error);
        return null;
      }
      const { data } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);
        return data.publicUrl 
      };

  //ON SUBMIT FUNCTION FOR FLASH!!!
  const onSubmitFlash = async ()=> {
    //CHECK IF USERS HAVE UPLOADED AN IMAGE FIRST + ALERT
    if (!postImage){
      Alert.alert('Upload Media', 'Please Upload a Photo to Create a Post');
      return;
    }
    const imageUrl = await uploadPostImageFlash();
    if (!imageUrl) return;
    const { error } = await supabase.from('postsFlash').insert({
      userid: user.id, 
      file: imageUrl,
      body: caption.trim(),
    });
    if (error) {
      Alert.alert('Create Post', error.message)
      return;
    }
    Alert.alert('Post Uploaded', 'Your Post Has Been Uploaded to the Flash Feed!')
    router.back();
  }

  const uploadPostImageFlash = async () => {
      //READS IMAGE 
      const base64 = await FileSystem.readAsStringAsync(postImage, {encoding: FileSystem.EncodingType.Base64});
      //CREATES FILE NAME OF PFP, AND PUTS IN CORRECT SUPABASE FOLDER
      const fileName = `${user.id}-${Date.now()}.jpg`;
      const filePath = `postFlash/${fileName}`;
      //UPLOAD TO SUPABASE STORAGE
      const { error } = await supabase.storage.from('posts').upload(filePath, decode(base64), {contentType: 'image/jpeg', upsert: true,});
      if (error){
        console.log(error);
        return null;
      }
      const { data } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);
        return data.publicUrl 
      };


        //ON SUBMIT FUNCTION FOR HEALED!!!
  const onSubmitHealed = async ()=> {
    //CHECK IF USERS HAVE UPLOADED AN IMAGE FIRST + ALERT
    if (!postImage){
      Alert.alert('Upload Media', 'Please Upload a Photo to Create a Post');
      return;
    }
    const imageUrl = await uploadPostImageHealed();
    if (!imageUrl) return;
    const { error } = await supabase.from('postsHealed').insert({
      userid: user.id, 
      file: imageUrl,
      body: caption.trim(),
    });
    if (error) {
      Alert.alert('Create Post', error.message)
      return;
    }
    Alert.alert('Post Uploaded', 'Your Post Has Been Uploaded to Your Healed Gallery!')
    router.back();
  }

  const uploadPostImageHealed = async () => {
      //READS IMAGE 
      const base64 = await FileSystem.readAsStringAsync(postImage, {encoding: FileSystem.EncodingType.Base64});
      //CREATES FILE NAME OF PFP, AND PUTS IN CORRECT SUPABASE FOLDER
      const fileName = `${user.id}-${Date.now()}.jpg`;
      const filePath = `postHealed/${fileName}`;
      //UPLOAD TO SUPABASE STORAGE
      const { error } = await supabase.storage.from('posts').upload(filePath, decode(base64), {contentType: 'image/jpeg', upsert: true,});
      if (error){
        console.log(error);
        return null;
      }
      const { data } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);
        return data.publicUrl 
      };
  return (
    <ScreenLayout>
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

            <Text style = {styles.title}>Create Post</Text>
            
        </View>

        <View style = {styles.container}>
          <View style={styles.avatarStyle}>
            {/* USERS AVATAR */}
            <Avatar
              uri = {profile?.avatar}
              size = {80}
              rounded = {65}
              />
          </View>
          <View style ={styles.containerRight}>
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
          </View>
        </View>


      {/* IMAGE UPLOAD SECTION */}
      <Pressable style={styles.imageUploadBox} onPress={onPickImage}>
        {postImage ? ( <Image source={{uri: postImage}} style={styles.postPreview} />
        ) : (
          <>
        <Ionicons 
          name="image-outline"
          size = {30}
          color = {'white'}
        /> 
        <Text style={styles.imageUploadText}>Tap to upload a photo</Text>
          </>
        )}
      </Pressable>
      
      {/* CAPTION INPUT!! */}
      <TextInput
        style={styles.captionInput}
        placeholder= "Write a caption..."
        placeholderTextColor="#cacaca"
        multiline
        value={caption}
        onChangeText={setCaption}
      />
       
      </View>

      <Text style = {{color: 'white', fontSize: 20, textAlign: 'center', fontWeight: theme.fonts.semibold, marginTop: 5,}}>Post To:</Text>

      <View style={styles.buttonRow}>
            {/* POST BUTTON!! */}
            <View style={styles.postButton}>
                    <Button
                    title = {'Main Feed'}
                    onPress={onSubmit}
                    />
            </View>

            {/* POST BUTTON!! */}
            <View style={styles.postButton}>
                    <Button
                    title = {'Flash Feed'}
                    onPress={onSubmitFlash}
                    />
            </View>
            {/* POST BUTTON!! */}
            <View style={styles.postButton}>
                    <Button
                    title = {'Healed'}
                    onPress={onSubmitHealed}
                    />
            </View>
        </View>
      </ScrollView>
      </ImageBackground>
      <NavBar />
    </ScreenLayout>
  ) 
}

export default newPostArtist

const styles = StyleSheet.create({

  iconLeft: {
      position: 'absolute',
      left: 5,
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        marginTop: 15,

    },
    subtitle:{
            color: '#e36161',
            textAlign: 'center',
            fontWeight: theme.fonts.extraBold,
            fontSize: 17,
        },
    title: {
            color: 'white',
            fontSize: 32,
            position: 'absolute',
            alignSelf: 'center',
            fontWeight: theme.fonts.extraBold,
            letterSpacing: 0,
            },

    header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 30,
    marginLeft: 10,

  },
  avatarStyle: {
      marginLeft: 8,
      marginTop: 20,

      borderRadius: 70,
    },
    information: {
      flexDirection: 'row',
      gap: 4,
      marginTop: 0,
      flex: 1,
 
    },
    container: {
      marginLeft: 15,
      flexDirection: 'row',
      marginTop: 0,
      alignItems: 'flex-start',
      
      
    },
    containerRight: {
      marginTop: 45,
      gap: 10,
      marginLeft: 5,
      flex: 1,
      marginRight: 10,
      
    },
    infoText: {
      fontSize: 17,
      color: 'white',
      fontWeight: theme.fonts.medium,
      marginTop: 5,
      flexShrink: 1,
      marginLeft: 5,
      marginRight: 5,
    },
    postButton: {
     alignItems: 'center',
     justifyContent: 'center',
     
     
    },
    captionInput: {
      
      textAlign: 'left',
      borderWidth: 1,
      borderColor:  theme.colors.gray,
      color: theme.colors.gray,
      borderRadius: 12,
      marginHorizontal: 55,
      minHeight: 100,
      padding: 15,
      marginBottom: 10,
      marginTop: 15,
    },
    imageUploadBox: {
      marginTop: 20,
      minHeight: 400,
      marginHorizontal: 10,
      borderWidth: 1,
      borderColor: theme.colors.gray,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageUploadText: {
      color: theme.colors.gray,
      fontSize: 18,
      marginTop: 5,
    },
    postPreview: {
      width: '100%',
      height: 420,
      borderRadius: 12,
      padding: 10,
    }, 
    scrollView: {
      paddingBottom: 300,
    },
    bg: {
      flex: 1,
    }


})