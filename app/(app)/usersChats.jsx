import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ChatProfileLayout from '../../components/ChatProfileLayout';
import ScreenLayout from '../../components/ScreenLayout';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const usersChats = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [profiles, setProfiles] = useState([]);



const getUsersChats = async() => {
    //GET ALL CHATS THAT ARE INCLUDING CURRENT USER ID
    const {data: chats, error} = await supabase
    .from('chats')
    .select('*')
    .or(`user1.eq.${user.id},user2.eq.${user.id}`);

    if (error) {
        console.log(error);
        return;   
    }

    const chatProfiles = [];

    for (const chat of chats) {
        let otherUserId = null;

        if (chat.user1 === user.id) {
            otherUserId = chat.user2;
        } else {
            otherUserId = chat.user1;
        }
    
        const {data: profileData, error: profileError} = await supabase
        .from('users')
        .select('*')
        .eq('id', otherUserId)
        .single();

        if(!profileError){
            chatProfiles.push({...profileData, chatId: chat.id,});
        }
        
    }

    setProfiles(chatProfiles);
};

useEffect(() => {
    if(user?.id){
        getUsersChats();
    }
}, [user]);

  return (

    
    
    <ScreenLayout>
        <KeyboardAvoidingView style={{flex: 1,}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ImageBackground
                source ={require('../../assets/images/welcome-background-dark.jpg')}
                style = {styles.bg}
                resizeMode = 'cover'
            >
        
            <View style = {styles.topBar}>
                <View style={styles.header}>
                    <View style={styles.iconLeft}>
                        {/* BACK BUTTON */}
                        <Pressable onPress={ () => router.back()}>
                            <Ionicons 
                            name="arrow-back-circle-outline"
                            size = {40}
                            color = {'white'}
                            />  
                        </Pressable>
                    </View>
                      <Text style={styles.title}>Your Chats</Text>
  
                </View>
            </View>
            
            <ScrollView>
            <View>

               {profiles.map((profile) => (<ChatProfileLayout key={profile.id} profile={profile} chatId={profile.chatId}/>))}

            </View>
            </ScrollView>
      </ImageBackground>
      </KeyboardAvoidingView>
    </ScreenLayout>
  )
};

export default usersChats

const styles = StyleSheet.create({
    calendarContainer: {
        marginTop: 15,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    availabilityButtonRow: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderWidth: 0.6,
      borderColor: theme.colors.gray,
      borderRadius: 12, 
      padding: 8,
    },
    availabilityButton: {
      fontSize: 15,
      color: 'white',
      fontWeight: theme.fonts.medium,
      marginTop: 2,
      marginLeft: 5,
    },
    nameBar: {
    gap: 5, 
    padding: 10,
    marginTop: 14,
    alignSelf: 'center',
    borderWidth: 0.6,
    borderColor: 'white',
    borderRadius: 50,

    },
    name: {
    fontSize: 18,
    color: 'white',
    fontWeight: theme.fonts.medium,

    },
    role: {
        fontSize: 18,
        color: '#ffffff8e',
        fontWeight: theme.fonts.medium,
        textTransform: 'capitalize',
    },
    avatarStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 70,
    },
    bg: {
       flex: 1, 
    },
    textInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 5,
        borderTopWidth: 0.6,
        borderTopColor: theme.colors.gray,
        paddingTop: 10,
    },
    input: {
        flex: 1,
        borderWidth: 0.6,
        borderColor: theme.colors.gray,
        borderRadius: 35,
        color: 'white',
        padding: 17,
        marginTop: 12,
        marginBottom: 12,
        

    },
    sendButton: {
        borderWidth: 0.6,
        borderColor: theme.colors.gray,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 5,
    },
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 30,
    marginLeft: 10,
    
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
    title: {
    color: 'white',
    fontSize: 32,
    position: 'absolute',
    alignSelf: 'center',
    fontWeight: theme.fonts.extraBold,
    letterSpacing: 0,
    },
    topBar: {
        borderBottomWidth: 0.6,
        borderColor: 'white',

    }
})