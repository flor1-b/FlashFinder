import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../components/Avatar';
import FlashPostLayout from '../../components/FlashPostLayout';
import NavBar from '../../components/NavBar';
import ScreenLayout from '../../components/ScreenLayout';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const flashFeed = () => {

  const {setAuth, user} = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
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

  
    const flashPosts = async() => {
      //FINDS WHICH ACCOUNTS USER FOLLOWS
      const {data: followData, error: followError} = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id)
      if(followError){
        console.log(followError);
        return;
      }

      const following = followData.map((follow) => follow.following_id);

      //IF USER IS FOLLOWING 0, SHOW NOTHING
      if (following.length === 0){
        setPosts([]);
        return;
      }
      //FETCHES POSTS FROM POST TABLE
      const { data, error } = await supabase
      .from('postsFlash')
      .select('*, users:userid (id, username, avatar, location, role)')
      .in('userid', following)
      .order('created_at', {ascending: false})
      if (!error) {
        setPosts(data);
      } 
  };
      getProfileData();
      flashPosts();

      
    
    }, [user]);

    const newPostRouting = () => {
    if (profile?.role === 'artist') {
      router.push('newPostArtist'); } else { 
        router.push('newPost')
      };
    };

    

  

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


          <Text style = {styles.title}>
            Flash Feed
          </Text>
          

          <View style={styles.iconRight}>
            <Pressable onPress={()=> router.push('usersChats')}>
              <Ionicons 
                name="paper-plane-outline"
                size = {35}
                color = {'white'}
              /> 
            </Pressable>

            <Pressable onPress={()=> router.push(`/publicProfile/${user.id}`)}>
            <Avatar 
              uri={profile?.avatar}
              size = {40}
              rounded = {19}
            />
            </Pressable>

          </View>

          
        </View>
        
      </View>

          {/* IF NO POSTS ARE AVAILABLE, SHOW NO DESIGNS AVAILABLE MESSAGE */}
          {posts.length < 1 && (
            <View style = {styles.noPostsContainer}>
              <Text style={styles.noPostsText}>
                No Flash Designs Available... Follow Artists to View their Flash!
              </Text>
            </View>
          )}

          {/*  IF AMOUNT OF POSTS IS MORE THAN 0 THAN DISPLAY FLASH POSTS */}
          {posts.length > 0 && (
            <ScrollView contentContainerStyle={{ paddingBottom: 100}}>
              {posts.map((post) => (<FlashPostLayout key={post.id} post={post}/>))}
            </ScrollView>
          )}

      

      


   </ImageBackground>

      <NavBar />
    </ScreenLayout>

    
  );
}

export default flashFeed

const styles = StyleSheet.create({
  noPostsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '85%',
  },
  noPostsText: {
    color: '#ffffffb2',
    fontSize: 18,
    textAlign: 'center', 
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 0.6,
    borderColor: theme.colors.gray,
    borderRadius: 35,
    padding: 16,
  },
  bg: {
    flex: 1,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 35,
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

})