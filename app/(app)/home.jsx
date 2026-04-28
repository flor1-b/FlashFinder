import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Avatar from '../../components/Avatar';
import NavBar from '../../components/NavBar';
import PostLayout from '../../components/PostLayout';
import ScreenLayout from '../../components/ScreenLayout';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const Home = () => {

  const { user} = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);


  useEffect(() => {

    //FETCHES PROFILE DATA FROM TABLE
    const getProfileData = async () => {
      const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq ('id', user?.id)
      .single();

      if (!error) {
        setProfile(data);
      }
    };

      //FETCHES POSTS FROM POST TABLE
      const getPosts = async (limit=15) => {
      const { data, error } = await supabase
      .from('posts')
      .select('*, users:userid (id, username, avatar, location, role)')
      .order('created_at', {ascending: false})
      .limit(limit)
      if (!error) {
        setPosts(data);
      } 
    };

    if (user?.id) {
      getProfileData();
      getPosts();
    }
    }, [user]);

    const newPostRouting = () => {
    if (profile?.role === 'artist') {
      router.push('newPostArtist'); } else { 
        router.push('newPost')
      };
    };

    //PREVENTS CRASH AFTER LOGOUT
      if (!user?.id) {
        return <ScreenLayout />
      }

  return (
  <ScreenLayout bg = '#2d2d2d'>
    <ImageBackground
            source ={require('../../assets/images/welcome-background-dark.jpg')}
            style = {styles.bg}
            resizeMode = 'cover'
          >

    <View style = {styles.topBar}>
        <View style={styles.header}>
          <View style={styles.iconLeft}>
          <Pressable onPress={()=> router.push('notifications')}>
              <Ionicons 
                name="heart-circle-outline"
                size = {40}
                color = {'white'}
              /> 
            </Pressable>

            <Pressable onPress={newPostRouting}>
            <Ionicons 
                name="add-circle-outline"
                size = {40}
                color = {'white'}
              /> 
              </Pressable>
            
          </View>

          <Image source={require('../../assets/images/ff-logo-white-transparent-crop.png')} style={{resizeMode: 'center', height: 60, alignSelf: 'center', width: 150,}}/>

          <View style={styles.iconRight}>
            <Pressable onPress={()=> router.push('usersChats')}>
              <Ionicons 
                name="paper-plane-outline"
                size = {35}
                color = {'white'}
              /> 
            </Pressable>

            <Pressable onPress={()=> router.push(`/publicProfile/${user?.id}`)}>
            <Avatar 
              uri={profile?.avatar}
              size = {40}
              rounded = {19}
            />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100}}>
        {posts.map((post) => (<PostLayout key={post.id} post={post}/>))}
          
        
      </ScrollView>
   </ImageBackground>

      <NavBar />
    </ScreenLayout>

    
  );
}

export default Home

const styles = StyleSheet.create({

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 12,
    marginLeft: 10,
    
    

  },
  title: {
    color: 'white',
    fontSize: 32,
    position: 'absolute',
    alignSelf: 'center',
    fontWeight: theme.fonts.extraBold,
    letterSpacing: 0,

    //SHADOWS SLASH OUTLINE 
    // textShadowColor: theme.colors.primaryBlue1,
    // textShadowOffset: { width: 1, height: 1},
    // textShadowRadius: 1,
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
    topBar: {
      borderWidth: 0.6,
      borderColor: theme.colors.gray,
      borderRadius: 12, 
    },
    bg: {
      
    }
})