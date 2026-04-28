import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import Avatar from './Avatar';


const NotificationsLayout = ({ profile, type }) => {
const router = useRouter();

if (!profile) return null;

  return (

    <Pressable style={styles.container} onPress={()=> router.push(`/publicProfile/${profile?.id}`)}>
        <View style ={styles.topRow}>  
            {/* USERS AVATAR */}
            <Avatar
                uri = {profile?.avatar}
                size = {100}
                rounded = {65} 
            />

            
            <View style={styles.userInfo}>
                <View style={styles.infoRow}>
                    <Ionicons 
                        name="checkmark-circle"
                        size = {30}
                        color = {'white'}
                    />
                    <Text style={styles.infoText}>
                        {profile?.username}
                    </Text>

                    <View style={styles.infoRow}>
                        <Ionicons 
                        name="people-circle-outline"
                        size = {30}
                        color = {'white'}
                        /> 
                
                        <Text style={styles.roleText}>
                        {profile?.role}
                        </Text>   
                    </View>
                    
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.roleText}>
                    {type === 'like' ? 'liked one of your posts!' : 'started following you!'}
                    </Text>   
                </View>

                
            </View>
        </View>
    </Pressable>
          
     
  )
}

export default NotificationsLayout

const styles = StyleSheet.create({
    container: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: 20,
      borderWidth: 0.6,
      borderColor: theme.colors.gray,
      borderRadius: 55,
    },
    infoText: {
      marginLeft: 3,
      marginRight: 3,
      fontSize: 17,
      color: 'white',
      fontWeight: theme.fonts.medium,
    },
    roleText: {
      color: theme.colors.gray,
      fontWeight: theme.fonts.medium,
      marginLeft: 3,
      marginRight: 3,
      fontSize: 18,
      textTransform: 'capitalize',
    },
    userInfo: { 
      gap: 10,
      marginLeft: 5,
      marginRight: 20,
      flex: 1,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 5,
      marginTop: 5,
      padding: 5,
      marginBottom: 5,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})

