import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BookingLayout from '../../components/BookingLayout';
import NavBar from '../../components/NavBar';
import ScreenLayout from '../../components/ScreenLayout';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
 
const usersBookings = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [profiles, setProfiles] = useState([]);

const getUsersAppointments = async() => {
    //GET ALL CHATS THAT ARE INCLUDING CURRENT USER ID
    const {data: appointments, error} = await supabase
    .from('appointments')
    .select('*')
    .or(`artist_id.eq.${user.id},client_id.eq.${user.id}`);

    if (error) {
        console.log(error);
        return;   
    }

    const appointmentProfiles = [];

    for (const appointment of appointments) {
        let otherUserId = null;

        if (appointment.artist_id === user.id) {
            otherUserId = appointment.client_id;
        } else {
            otherUserId = appointment.artist_id;
        }
    
        const {data: profileData, error: profileError} = await supabase
        .from('users')
        .select('*')
        .eq('id', otherUserId)
        .single();

        if(!profileError){
            appointmentProfiles.push({...profileData, 
                chatId: appointment.chat_id, 
                appointmentId: appointment.id, 
                appointmentDate: appointment.appointment_date, 
                appointmentStatus: appointment.status, 
                isArtistAppointment: appointment.artist_id === user.id});
        }
    }

    setProfiles(appointmentProfiles);
};

useEffect(() => {
    if(user?.id){
        getUsersAppointments();
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
                      <Text style={styles.title}>Appointments</Text>
  
                </View>
            </View>
            
            <ScrollView>
            <View>

               {profiles.map((profile) => (<BookingLayout key={profile.appointmentId} profile={profile}/>))}

            </View>
            </ScrollView>
      </ImageBackground>
      </KeyboardAvoidingView>
      <NavBar />
    </ScreenLayout>
  )
};

export default usersBookings

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