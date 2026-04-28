import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Avatar from '../../../components/Avatar';
import FlashPostLayout from '../../../components/FlashPostLayout';
import HealedPostLayout from '../../../components/HealedPostLayout';
import NavBar from '../../../components/NavBar';
import PostLayout from '../../../components/PostLayout';
import ScreenLayout from '../../../components/ScreenLayout';
import TabSwitching from '../../../components/TabSwitching';
import { theme } from '../../../constants/theme';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

const publicProfile = () => {
  //LOGGED IN USER
  const { user } = useAuth();
  //PAGE ROUTING + ID ROUTING
  const router = useRouter();
  const { id } = useLocalSearchParams();

  //PROFILE INFO + POSTS
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [flashPosts, setFlashPosts] = useState([]);
  const [healedPosts, setHealedPosts] = useState([]);
  //FOLLOWING / FOLLOWERS
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  //CHECK IF CURRENT PROFILE PAGE IS THE USERS PROFILE
  const isOwnProfile = (user?.id === id);
  const isArtist = (profile?.role === 'artist');
  

  useEffect(() => {
  //FETCHES USER PROFILE DATA FROM TABLE
  const getProfileData = async () => {
    const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq ('id', id)
    .single();

    if (!error) {
      setProfile(data);
    }
  };
    //FETCHES USERS MAIN POSTS
    const getUserPosts = async () => {
      const { data, error } = await supabase
      .from('posts')
      .select('*, users:userid (id, username, avatar, location)')
      .eq('userid', id)
      .order('created_at', {ascending: false})

      if (!error) {
        setPosts(data);
      }
    };

    //FETCHES USERS FLASH FEED POSTS
    const getUserPostsFlash = async () => {
      const { data, error } = await supabase
      .from('postsFlash')
      .select('*, users:userid (id, username, avatar, location)')
      .eq('userid', id)
      .order('created_at', {ascending: false})

      if (!error) {
        setFlashPosts(data);
      }
    };

    //FETCHES USERS HEALED GALLERY POSTS
    const getUserPostsHealed = async () => {
      const { data, error } = await supabase
      .from('postsHealed')
      .select('*, users:userid (id, username, avatar, location)')
      .eq('userid', id)
      .order('created_at', {ascending: false})

      if (!error) {
        setHealedPosts(data);
      }
    };

    //FOLLOWING FUNCTIONALITY
    //CHECK IF CURRENT USER IS FOLLOWING THE PROFILE DISPLAYED
    const checkIfFollowing = async () => {
      const {data, error} = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', user.id)
      .eq('following_id', id)
      .single();
      if (!error){
        setIsFollowing(true); } else {
        setIsFollowing(false);
      }
    };

  if (id && user?.id) {
    getProfileData();
    getUserPosts();
    getUserPostsFlash();
    getUserPostsHealed();
    checkIfFollowing();
    getFollowerCount();
    getFollowingCount();
  }
  }, [id, user]);

    //GET FOLLOWER COUNT
    //https://stackoverflow.com/questions/65612167/how-to-get-count-in-supabase
    const getFollowerCount = async () => {
      const {count, error} = await supabase
      .from('follows')
      .select('*', { count : 'exact', head: true})
      .eq('following_id', id)
      if(!error) {
        setFollowersCount(count);
      }
    };
    //GET FOLLOWING COUNT
    const getFollowingCount = async () => {
      const {count, error} = await supabase
      .from('follows')
      .select('*', { count : 'exact', head: true})
      .eq('follower_id', id)
      if(!error) {
        setFollowingCount(count);
      }
    };


  //INSERTS FOLLOW DATA INTO TABLE
    const performFollow = async () => {
      const { error } = await supabase
      .from('follows')
      .insert({follower_id: user.id, following_id: id,});
      if (error) {
        Alert.alert('Follow', error.message);
        return;
      }
      setIsFollowing(true);
    };
    //REMOVES FOLLOW DATA FROM TABLE WHEN USER UNFOLLOWS
    const performUnfollow = async () => {
      const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', id);
      if (error) {
        Alert.alert('Unfollow', error.message);
        return;
      }
      setIsFollowing(false);
    };

    // DM ROUTING + FUNCTIONALITY
    const openDM = async () => {

      //SORTS USERS IN DEFNITIVE ORDER - PREVENTS 2 DIFF CHATS APPEARING
      const userSorting = [user.id, id].sort();
      const user1 = userSorting[0];
      const user2 = userSorting[1];
      //FIND EXISTING CONVERSATIONS - PREVENTS 2 DIFF CHATS APPEARING AGAIN
      const {data, error} = await supabase
      .from('chats')
      .select('*')
      .eq('user1', user1)
      .eq('user2', user2)
      .single();
      //IF THERE IS A CHAT ALREADY - PUSH/ROUTE TO THAT CHATID
      if (data) {
        router.push(`/chat/${data.id}`)
        return;
      }
      //IF NO CHAT EXISTS - INSERT NEW CHAT
      const {data: newChat, error: newChatError} = await supabase
      .from('chats')
      .insert({user1: user1, user2: user2  })
      .select()
      .single();
      //CHECK ERROR + ALERTS IF ERROR
      if (newChatError) {
        Alert.alert('Error', newChatError.message);
        return;
      }
      // PUSH/ROUTE TO NEW CREATED CHAT
      router.push(`/chat/${newChat.id}`);
    }

    //PROFILE TABS - IF USER IS ARTIST SHOWS ALL TABS
    const profileTabs = profile?.role === 'artist' ? ['posts','flash','healed'] : ['posts'];

  return (
    <ScreenLayout  >
      <ImageBackground
                  source ={require('../../../assets/images/welcome-background-dark.jpg')}
                  style = {styles.bg}
                  resizeMode = 'cover'
              >
       <ScrollView contentContainerStyle={{ paddingBottom: 100}}>
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

          <Text style = {styles.title}>Profile</Text>

          {/* TOP RIGHT SECTION OF THE SCREEN */}
          <View style={styles.iconRight}>
            {/* IF ARTIST PROFILE -- SHOW VIEW SCHEDULE BUTTON */}
            {isArtist && (
              <Pressable style={styles.followButtonRow} onPress ={()=> router.push(`/availabilityPage/${profile?.id}`)}>
                  <Ionicons 
                    name={"calendar-number-outline"}
                    size = {20}
                    color = {'white'}
                    /> 
                    <Text style={styles.followButton}>
                      Availability
                    </Text>
                </Pressable>
            )}
          </View>

        </View>
      </View>

      <View style={styles.container}>
        <View style={{gap: 15}}>
          <View style={styles.avatarStyle}>

            {/* USERS AVATAR */}
            <Avatar
              uri = {profile?.avatar}
              size = {120}
              rounded = {65}
              />
          </View>

          {/* FOLLOW/UNFOLLOW BUTTON */}
          {!isOwnProfile && (
            <Pressable style={styles.followButtonRow} onPress ={isFollowing ? performUnfollow : performFollow}>
              <Ionicons 
                name={isFollowing ? "person-remove-outline" : "person-add-outline"}
                size = {20}
                color = {'white'}
                /> 
                <Text style={styles.followButton}>
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Text>
            </Pressable>
          )}
          {/* IF USER IS VIEWING OWN PROFILE THEN EDIT PROFILE BUTTON APPEARS INSTEAD */}
          {isOwnProfile && (
            <Pressable style={styles.followButtonRow} onPress ={()=> router.push('editProfile')}>
                <Ionicons 
                  name={"create-outline"}
                  size = {20}
                  color = {'white'}
                  /> 
                  <Text style={styles.followButton}>
                    Edit Profile
                  </Text>
              </Pressable>
          )}
          {/* MESSAGE BUTTON - ONLY APPEARS IF IT ISNT USERS OWN PROFILE - PREVENTS DM WITH SELF */}
          {!isOwnProfile && (
            <Pressable style={styles.followButtonRow} onPress ={openDM}>
                <Ionicons 
                  name={"paper-plane-outline"}
                  size = {20}
                  color = {'white'}
                  /> 
                  <Text style={styles.followButton}>
                    Message
                  </Text>
              </Pressable>
          )}

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
                name="person-outline"
                size = {30}
                color = {'white'}
                /> 

          <Text style={styles.infoText}>
              Following: {followingCount}
          </Text>
          <Ionicons 
                name="person-outline"
                size = {30}
                color = {'white'}
                /> 

          <Text style={styles.infoText}>
              Followers: {followerCount}
          </Text>
        </View>

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

        {/* BIO */}
        {
          profile?.bio && (
            <Text style={styles.infoTextBio}>{profile.bio}</Text>
          )
        }
        </View>
      </View>

      {/* TAB SWITCHER BETWEEN POSTS FLASH HEALED */}
      <View>
            {/* <TabSwitching 
                tabs={['posts','flash','healed']}
                activeTab={activeTab}
                onChange={setActiveTab}
            /> */}
            <TabSwitching 
                tabs={profileTabs}
                activeTab={activeTab}
                onChange={setActiveTab}
            />
      </View>

      {/* TAB SWITCHER MAPPING */}
      <View>
        {activeTab === 'posts' && posts.map((post) => (<PostLayout key={post.id} post={post}/>))}
        {activeTab === 'flash' && flashPosts.map((post) => (<FlashPostLayout key={post.id} post={post}/>))}
        {activeTab === 'healed' && healedPosts.map((post) => (<HealedPostLayout key={post.id} post={post}/>))}
      </View>
        </ScrollView>
      </ImageBackground>
      <NavBar />
    </ScreenLayout> 
  );
}


export default publicProfile

const styles = StyleSheet.create({
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
  followerCount: {
    color: 'white',
    fontSize: 15,
    fontWeight: theme.fonts.medium,
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
    iconRight: {
      position: 'absolute',
      right: 13,
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
    followButtonRow: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderWidth: 0.6,
      borderColor: theme.colors.gray,
      borderRadius: 12, 
      padding: 8,
    },
    followButton: {
      fontSize: 15,
      color: 'white',
      fontWeight: theme.fonts.medium,
      marginTop: 2,
      marginLeft: 5,
    },

    //TOP PROFILE BOX
    container: {
      marginLeft: 15,
      flexDirection: 'row',
      alignItems: 'flex-start',
      
    },
    //RIGHT SIDE OF PROFILE BOX
    containerRight: {
      marginTop: 10,
      gap: 8,
      marginLeft: 8,
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
      
      marginRight: 12,
    },
    roleStyle: {
      color: '#e8e8e8',
      fontSize: 20,
      fontWeight: theme.fonts.extraBold,
      marginTop: 0,
      textTransform: 'capitalize',
    },
    postTypeStyle: {
      color: 'white',
      fontSize: 23,
      fontWeight: theme.fonts.extraBold,
    }
})


 