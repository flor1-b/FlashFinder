import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Avatar from './Avatar';

const HealedPostLayout = ({ post }) => {
const { user } = useAuth();
const { id } = useLocalSearchParams();
const isOwnProfile = (user?.id === id);
const router = useRouter();

const deletePost = async () => {
  Alert.alert('Delete Post', 'Are you sure you want to delete this post?', 
    [{ text: 'Cancel',},
     { text: 'Delete', 
      onPress: async () => {
        const {error} = await supabase
        .from('postsHealed')
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

          {/* LIKES, COMMENTS, SHARE ICONS */}
          <View style={styles.socialContainer}>
            
              <View style={styles.socialButtons}>
                

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

              
            </View>
            {/* CAPTION */}
            
            <Text style={styles.caption}>{post.body}</Text>
           
          </View>
        </View>
  )
}

export default HealedPostLayout

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
        
        marginLeft: 10,
        marginRight: 5,
        fontSize: 20,
        marginTop: 0,
        flexShrink: 1,
        marginBottom: 8,
    },
    socialContainer:{
        padding: 5,
        width: '100%'
        

    },
    socialButtons: {
        flexDirection: 'row',
        gap: 5,
        padding: 5,
        
    },
    bin: {
      marginLeft: 'auto',
    }
})

