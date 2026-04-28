import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { supabase } from '../lib/supabase';
import Avatar from './Avatar';

const BookingLayout = ({ profile}) => {
const router = useRouter();

const updateAppointmentStatus = async (newStatus) => {
    const {error} = await supabase
    .from('appointments')
    .update({status: newStatus})
    .eq('id', profile.appointmentId);
    if (error){
        Alert.alert('Appointment Error', error.message);
        return;
    }
    router.back();
    Alert.alert('Booking Status Confirmed', 'You Can View Your Bookings in the Appointments Tab!')
}


if (!profile) return null;

  return (
    
    <View style={styles.container}>
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
                
                    <Text style={styles.continueChattingText}>
                    Date: {profile?.appointmentDate}
                    </Text> 
                </View>

                <View style={styles.infoRow}>

                    <Text style={styles.continueChattingText}>
                    Status: {profile?.appointmentStatus}
                    </Text>  
                </View>
                
                {profile?.isArtistAppointment && profile?.appointmentStatus === 'pending' && (
                    <View style={styles.infoRow}>

                        <Pressable style={styles.buttons} onPress={()=> updateAppointmentStatus('accepted')}>
                            <Text style={styles.buttonText}>
                            Accept
                            </Text> 
                        </Pressable> 

                        <Pressable style={styles.buttons} onPress={()=> updateAppointmentStatus('declined')}>
                            <Text style={styles.buttonText}>
                            Decline
                            </Text> 
                        </Pressable> 
                    </View>
                )}    
            </View>
        </View>
    </View>
    
          
     
  )
}

export default BookingLayout

const styles = StyleSheet.create({
    buttonText: {
        color: 'white',
        padding: 5,
        gap: 5,

    },
    buttons: {
        color: 'white',
        borderWidth: 0.6,
        borderRadius: 20,
        borderColor: theme.colors.gray,
        padding: 5,
        marginLeft: 8,
    },
    container: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: 20,
      borderWidth: 0.6,
      borderColor: theme.colors.gray,
      borderRadius: 55,
      alignSelf: 'center',
      width: '86%',
    },
    infoText: {
      marginLeft: 3,
      marginRight: 3,
      fontSize: 17,
      color: 'white',
      fontWeight: theme.fonts.medium,
    },
    continueChattingText: {
      marginLeft: 3,
      marginRight: 3,
      fontSize: 16,
      color: theme.colors.gray,
      textTransform: 'capitalize',
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

