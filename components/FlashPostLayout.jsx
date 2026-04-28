import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Avatar from './Avatar';


const FlashPostLayout = ({ post }) => {
const { user } = useAuth();
const { id } = useLocalSearchParams();
const isOwnProfile = (user?.id === id);
const router = useRouter();

    const openDM = async () => {

      //SORTS USERS IN DEFNITIVE ORDER - PREVENTS 2 DIFF CHATS APPEARING
      const userSorting = [user.id, post.users.id].sort();
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

    const deletePost = async () => {
      Alert.alert('Delete Post', 'Are you sure you want to delete this post?', 
        [{ text: 'Cancel',},
         { text: 'Delete', 
          onPress: async () => {
            const {error} = await supabase
            .from('postsFlash')
            .delete()
            .eq('id', post.id);
          
          if (error){
            Alert.alert('Error', error.message);
            return;
          }
          router.back();
        },
        },
      ]
      )
    }

  return (
    <View style = {styles.container}>
        
          <View style={styles.topRow}>
            
            <Pressable onPress={()=> router.push(`/publicProfile/${post.users.id}`)}>
            {/* USERS AVATAR */}
            <Avatar
              uri = {post?.users?.avatar}
              size = {60}
              rounded = {65}
              />
            </Pressable>
          
        

          <View style ={styles.userInfo}>
            <View style={styles.infoRow} >
              <Ionicons 
                name="checkmark-circle"
                size = {30}
                color = {'white'}
              /> 
              <Text style={styles.infoText}>
                {post?.users?.username}
              </Text>

              <Ionicons 
               name="location-outline"
               size = {30}
               color = {'white'}
              /> 
              <Text style={styles.infoText}>
               {post?.users?.location}
              </Text>          
            
            </View>
          </View>
          </View>

          {/* POST IMAGE */}
          <Image source={{ uri: post.file}} 
           style={styles.postImage}
          />
          <View style={styles.socialContainer}>
            {isOwnProfile && (
                <View style={styles.bin}>
                  <Pressable onPress={deletePost}>
                    <Ionicons 
                      name="trash-outline"
                      size = {30}
                      color = {'#bd0000ef'}
                    /> 
                  </Pressable>
                </View>
              )}
            {/* CAPTION - IF CAPTION IS LONGER THAN 0 CHARACTERS THEN DISPLAY CAPTION (PREVENTS EMPTY SPACE)*/}
            {post.body.length > 0 && (
                <Text style={styles.caption}>{post.body}</Text> 
            )}
            
            
              <View style={styles.socialButtons}>
                <Pressable style={styles.enquireButton} onPress={openDM}>
                    <Ionicons 
                    name="paper-plane-outline"
                    size = {30}
                    color = {'white'}
                    /> 
                    <Text style={styles.roleText}>
                    Enquire
                    </Text>
                </Pressable>
              </View>
            
            
            
           
          </View>
        </View>
  )
}

export default FlashPostLayout

const styles = StyleSheet.create({
    container: {
      marginLeft: 30,
      marginRight: 30,
      marginTop: 20,
      alignItems: 'flex-start',
      borderWidth: 0.6,
      borderColor: theme.colors.gray,
      borderRadius: 30,
      
    },
    infoText: {
      marginLeft: 3,
      marginRight: 3,
      fontSize: 17,
      color: 'white',
      fontWeight: theme.fonts.medium,
      
    },
    roleText: {
      color: 'white',
      fontWeight: theme.fonts.medium,
      marginTop: 7,
      fontSize: 18,
      textTransform: 'capitalize',
    },
    userInfo: { 
      gap: 10,
      marginLeft: 5,
      marginRight: 20,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 5,
      marginTop: 5,
      padding: 5,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postImage: {
        width: '100%',
        height: 365,
        padding: 0,
        borderWidth: 0.6,
        borderColor: theme.colors.gray, 
    },
    caption: {
        color: 'white',
        marginTop: 15,
        marginLeft: 10,
        marginRight: 5,
        fontSize: 20,
        marginTop: 0,
        flexShrink: 1,
        marginBottom: 3,
        padding: 5,
    },
    socialContainer:{
        padding: 5,
        width: '100%'
    },
    socialButtons: {
        flexDirection: 'row',
        gap: 5,
        padding: 5,
        alignSelf: 'center'
        
    },
    bin: {
      marginLeft: 'auto',
    },
    enquireButton: {
        flexDirection: 'row',
        borderWidth: 0.6,
        borderColor: theme.colors.gray,
        padding: 5,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 34,
        gap: 4,
        padding: 15,
    }
})

