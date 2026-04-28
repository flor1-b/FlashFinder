import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Avatar from '../../../components/Avatar';
import MessageLayout from '../../../components/messageLayout';
import ScreenLayout from '../../../components/ScreenLayout';
import { theme } from '../../../constants/theme';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';


const chatPage = () => {
    const { user } = useAuth();
    const router = useRouter();
    

    const { id } = useLocalSearchParams();

    //MESSAGE INPUT VARIABLES
    const [messageText, setMessageText] = useState('');
    //PREVIOUS MESSAGES
    const [messages, setMessages] = useState([]);
    const [otherUserId, setOtherUserId] = useState(null);
    const [profile, setProfile] = useState(null);

    //GET THE ID OF THE PERSON WHO IS BEING SPOKEN TO 
    const getChatUserInfo = async () => {
        const { data: userInfo, error: userInfoError} = await supabase
        .from('chats')
        .select('*')
        .eq('id', id)
        .single();

        if (userInfoError) {
            Alert.alert('User', userInfoError.message);
            return;
        }
        //SORT USER IDS
        if (user.id === userInfo.user1) {
             setOtherUserId(userInfo.user2);
        } else {
            setOtherUserId(userInfo.user1);
        }
    }
    //RETRIEVES USER INFO OF WHO USER IS BEING SPOKEN TO - USING otherUserId set ABOVE
    const getProfileData = async () => {
    const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq ('id', otherUserId)
    .single();

    if (!error) {
      setProfile(data);
    };
};
    
    //GET MESSAGES FROM SUPABASE TABLE, AND SETS THE MESSAGE
    const getMessages = async () => {
        const {data, error} = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', id)
        .order('created_at', { ascending: true});

        if (error) {
            Alert.alert('Messages', error.message);
            return;
        }
        setMessages(data || []);
    };

    //GETS CHAT MESSAGE HISTORY AND USER INFO OF WHO IS BEING SPOKEN TO
    useEffect(()=> {
        if (id) {
            getMessages();
            getChatUserInfo();
        }
    }, [id]);

    useEffect(()=> {
        if(otherUserId) {
            getProfileData();
        }
    }, [otherUserId]);

    const isMessagingArtist = (profile?.role === 'artist');

    const sendMessage = async () => {
        const { error } = await supabase
        .from('messages')
        .insert({chat_id: id, sender_id: user.id, message: messageText.trim(),});
        if (error){
            Alert.alert('Send Message', error.message);
            return;
        }
        setMessageText('');
        getMessages();
    };
    



  return (
    <ScreenLayout>
        <KeyboardAvoidingView style={{flex: 1,}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ImageBackground
            source ={require('../../../assets/images/welcome-background-dark.jpg')}
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

                    
            
                      <Text style={styles.title}>Chat</Text>
            
                      {/* TOP RIGHT SECTION OF THE SCREEN */}
                      <View style={styles.iconRight}>
                        {/* AVAILABILITY BUTTON HEREEEEE */}
                        {/* IF ARTIST PROFILE -- SHOW VIEW SCHEDULE BUTTON */}
                        {isMessagingArtist && (
                            <Pressable style={styles.availabilityButtonRow} onPress ={()=> router.push({pathname: `/availabilityPage/${otherUserId}`, params: {artistId: profile?.id, chatId: id}})}>
                                <Ionicons 
                                    name={"calendar-number-outline"}
                                    size = {20}
                                    color = {'white'}
                                /> 
                        
                                <Text style={styles.availabilityButton}>
                                    Availability
                                </Text>
                            </Pressable>
                        )}
                      </View>
  
                </View>
                
            </View>

            <View style={styles.nameBar}>
                {/* USERS AVATAR */}
                <Avatar
                uri = {profile?.avatar}
                size = {60}
                rounded = {65}
                />


                <Text style={styles.name}>{profile?.name}</Text>
                <Text style={styles.role}>- {profile?.role}</Text>

            </View> 

            {isMessagingArtist && ( 
                <Pressable style={styles.requestButtonRow} onPress ={()=> router.push(`/availabilityPage/${otherUserId}`)}>
                    <Ionicons 
                        name={"today-outline"}
                        size = {20}
                        color = {'white'}
                    /> 
                        
                    <Text style={styles.requestButton}>
                            Request Booking
                    </Text>
                </Pressable>
            )}

            {/* DISPLAYS ALL MESSAGES FROM SUPABASE */}
            <ScrollView contentContainerStyle={{flexGrow: 1,}}>
                {messages.map((msg) => (
                    <MessageLayout
                    key={msg.id}
                    message={msg}
                    isMyMessage={msg.sender_id === user?.id}
                    />
                ))}

           </ScrollView>

           <View style={styles.textInputRow}>
                    <TextInput style={styles.input} placeholder= 'Type a message...' placeholderTextColor= '#bebebe'
                        value={messageText} onChangeText={setMessageText}>
                    </TextInput>

                    <Pressable style={styles.sendButton} onPress={sendMessage}>
                        <Ionicons
                            name="arrow-up-outline"
                            size={30} 
                            color="white"
                        />
                    </Pressable>

                </View>
      </ImageBackground>
      </KeyboardAvoidingView>
    </ScreenLayout>
  )
};

export default chatPage

const styles = StyleSheet.create({
    requestButtonRow: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row', 
      borderWidth: 0.6,
      borderColor: theme.colors.gray,
      borderRadius: 12, 
      padding: 8,
      marginTop: 10,  
    },
    requestButton: {
      fontSize: 15,
      color: 'white',
      fontWeight: theme.fonts.medium,
      marginTop: 2,
      marginLeft: 5,
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
    flexDirection: 'row',
    alignItems: 'center',
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
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 11,
        marginRight: 5, 
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