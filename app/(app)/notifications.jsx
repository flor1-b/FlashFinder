import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import NavBar from '../../components/NavBar';
import NotificationsLayout from '../../components/notificationsLayout';
import ScreenLayout from '../../components/ScreenLayout';
import TabSwitching from '../../components/TabSwitching';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const Notifications = () => {

  const router = useRouter();
  const { user } = useAuth();
  const [likes, setLikes] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [activeTab, setActiveTab] = useState('likes');

  useEffect(() => {

  const getNotifications = async () => {
    
    //GET USER ID OF ALL USERS WHO HAVE LIKED CURRENT USERS POSTS
    if (activeTab === 'likes') {
        const {data, error} = await supabase
        .from('postLikes')
        .select('*')
        .eq('postuser', user?.id)
        .order('created_at', {ascending: false});

        if (error){
            setLikes([]);
            return;
        }
        //GET USER INFORMATION OF ALL THE IDS THAT LIKED CURRENT USERS POST
        const likeProfiles = [];
        for (const like of data) {
          if(like.userid === user.id) continue;

          const {data: profileData, error: profileError} = await supabase
          .from('users')
          .select('*')
          .eq('id', like.userid)
          .single();
          if(!profileError){
            likeProfiles.push(profileData);
          }
        }
        setLikes(likeProfiles);
    }


    if (activeTab === 'followers') {
        const {data, error} = await supabase
        .from('follows')
        .select('*')
        .eq('following_id', user?.id)
        .order('created_at', { ascending: false});

        if (error){
            setFollowers([]);
            return;
        }
        //GET USER INFORMATION OF ALL THE IDS THAT LIKED CURRENT USERS POST
        const followerProfiles = [];
        for (const follow of data) {
          const {data: profileData, error: profileError} = await supabase
          .from('users')
          .select('*')
          .eq('id', follow.follower_id)
          .single();
          if(!profileError){
            followerProfiles.push(profileData);
          }
        }
        setFollowers(followerProfiles);  

    }
    
  };

  getNotifications();

  }, [user, activeTab]);

  return (
    <ScreenLayout >
      
      <ImageBackground
                  source ={require('../../assets/images/welcome-background-dark.jpg')}
                  style = {styles.bg}
                  resizeMode = 'cover'
              >

       <ScrollView>
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
                <Text style = {styles.title}>Notifications</Text>
           </View>
        </View>

        <View>
            <TabSwitching 
                tabs={['likes', 'followers']}
                activeTab={activeTab}
                onChange={setActiveTab}
            />
        </View>

      <View>
        {activeTab === 'likes' && likes.map((profile) => (<NotificationsLayout key={profile.id} profile={profile} type='like'/>))}
        {activeTab === 'followers' && followers.map((profile) => (<NotificationsLayout key={profile.id} profile={profile} type='follow'/>))}
          
        
      </View>
        </ScrollView>
      </ImageBackground>
      <NavBar />
    </ScreenLayout> 
  );
}


export default Notifications

const styles = StyleSheet.create({

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 30,
    marginLeft: 10,

  },
  searchInput: {
    borderWidth: 0.6,
    borderColor: theme.colors.gray,
    borderRadius: 30,
    color: 'white',
    fontSize: 16,
    padding: 15,
    width: '90%',
    marginTop: 15,

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
      marginTop: 5,
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
    },
    postTypeStyle: {
      color: 'white',
      fontSize: 23,
      fontWeight: theme.fonts.extraBold,
    }

})


 