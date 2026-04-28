import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Avatar from '../../../components/Avatar';
import NavBar from '../../../components/NavBar';
import ScreenLayout from '../../../components/ScreenLayout';
import { theme } from '../../../constants/theme';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

 
const availabilityPage = () => {
    const { user } = useAuth();
    const router = useRouter();

    const { id, chatId } = useLocalSearchParams();
    
    const [profile, setProfile] = useState(null);

    //CALENDAR STATES 
    //SELECTED = CURRENTLY SELECTED DATE
    //SELECTED STATUS = STATUS CHOSEN BY ARTIST BEFORE SAVING 
    const [selected, setSelected] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [markedDates, setMarkedDates] = useState({});

    //OWN PROFILE CHECK - FOR ARTISTS TO EDIT OWN AVAILABILITYT
    const isOwnProfile = (user?.id === id);

    //GETS PROFILE INFO FOR THE CURRENT ARTIST PROFILE DISPLAYED
    const getProfileData = async () => {
    const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq ('id', id)
    .single();

    if (!error) {
      setProfile(data);
        };
    };
    const getAvailability = async () => {
        //FETCH ARTISTS AVAILABILITY DATES FROM SUPABASE TABLE
        const {data, error} = await supabase
        .from('availability') 
        .select('*')
        .eq('artist_id', id);
        if (error) {
            console.log(error); 
            return;
        }
        const formattedDates = {};

        //CONVERTS DATABASE ROWS TO REACT CALENDAR FORMAT
        data.forEach((item) => {
            formattedDates[item.date] = {
                selected: true,
                selectedColor: item.status === 'available' ? '#27cc4b93' : '#bd00008e',
            };
        });

        //SELECTED DATE STYLING - ALLOWS USER TO SEE CURRENT SELECTED ON MARKED DATES
        if (selected) {
            formattedDates[selected] = {
                selected: true,
                selectedColor: selectedStatus === 'available' ? '#27cc4b93' 
                    : selectedStatus === 'unavailable' ? '#bd00008e' 
                    : formattedDates[selected]?.selectedColor || '#00d3efb0',
                marked: true,
                dotColor: 'white',
            };
        }
        setMarkedDates(formattedDates);
    }

    //SAVE AVAILABILITY FUCNTION AND UPLOAD TO SUPABASE TABLE
    const updateAvailability = async () => {
        if (!selected || !selectedStatus){
            return;
        }
        const {error} = await supabase
        .from('availability')
        .upsert({
            artist_id: id,
            date: selected,
            status: selectedStatus,
        })
        if (error){
            console.log(error);
            return; 
        }
        setSelectedStatus('');
        getAvailability();
        Alert.alert('Availability Updated', 'Your Calendar Has Been Updated!')
    };
    
    //RELOADS PROFILE INFO AND AVAILABILITY IF ID OR SELECTED DATE CHANGES
    useEffect(()=> {
        if(id) {
            getProfileData();
            getAvailability();
        }
    }, [id, selected, selectedStatus]);


    //REQUEST APPOINTMENT FUNCTION
    const requestAppointment = async () => {
        if(!selected){
            Alert.alert('Select Date', 'Please Select a Date To Request a Booking!')
        }
        //INSERTS APPOINTMENT REQUEST INTO SUPABASE TABLE
        const {error} = await supabase
        .from('appointments')
        .insert({
            artist_id: id,
            chat_id: chatId,
            client_id: user.id,
            appointment_date: selected,
            status: 'pending',
        })
        if (error){
            Alert.alert('Appointment Error', error.message)
        }
        Alert.alert('Request Sent', 'Your appointment request has been sent.')
        router.back();
    }

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
                      <Text style={styles.title}>Availability</Text>
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

            <View style={styles.calendarContainer}>
                {/* https://www.npmjs.com/package/react-native-calendars */}
                <Calendar  
                    style={{
                        borderWidth: 0.6,
                        borderColor: theme.colors.gray,
                        borderRadius: 20,
                        padding: 15, 
                    }} 
                    theme={{
                        calendarBackground: '#ffffff48',
                        backgroundColor: '#ffffff48',
                        monthTextColor: 'white',
                        dayTextColor: 'white',
                        padding: 5,
                        textMonthFontSize: 20, 
                        textMonthFontWeight: 'bold', 
                    }}
                    onDayPress={day => { 
                        setSelected(day.dateString);
                    }}
                    markedDates={markedDates}
                />
            </View>
            
            {/* IF ARTIST IS VIEWING OWN PROFILE - SHOW AVAILABILITY BUTTONS TO UPDATE CALENDAR */}
            {isOwnProfile && (
                <View style={styles.availabilityButtonRow}>
                    {/* MARK AVAILABLE BUTTON */}
                    <Pressable style={[selectedStatus === 'available']} onPress={() => setSelectedStatus('available')}>
                        <Text style={styles.availabilityButton} > Mark Available</Text>
                    </Pressable>

                    {/* MARK UNAVAILABLE BUTTON */}
                    <Pressable style={[selectedStatus === 'unavailable']} onPress={() => setSelectedStatus('unavailable')}>
                        <Text style={styles.availabilityButton} > Mark Unavailable</Text>
                    </Pressable>

                    {/* SAVE AVAILABILITY CHANGES BUTTON */}
                    <Pressable onPress={updateAvailability}>
                        <Text style={styles.availabilityButton}> Save </Text>
                    </Pressable>
                </View>
            )} 

            <View>
                <Text style={styles.disclaimer}>Appointments should not be requested by individuals under the age of 18. </Text>
            </View>

            {!isOwnProfile && (
                <View style={styles.availabilityButtonRow}>
                    <Pressable onPress={requestAppointment}>
                        <Text style={styles.availabilityButton}> Request Appointment </Text>
                    </Pressable>
                </View>
            )}
      </ImageBackground>
      </KeyboardAvoidingView>
      <NavBar/>  
    </ScreenLayout>
  )
};

export default availabilityPage 
 
const styles = StyleSheet.create({
    disclaimer: {
        fontSize: 15,
        color: '#ffffffac',
        textAlign: 'center',
        justifyContent: 'center',
        paddingTop: 20,

    },
    calendarContainer: {
        marginTop: 25,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    availabilityButtonRow: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderWidth: 0,
      borderColor: theme.colors.gray,
      borderRadius: 20,  
      padding: 8,
      marginTop: 20,
 
    }, 
    availabilityButton: {
      fontSize: 17,
      color: 'white',  
      fontWeight: theme.fonts.medium,
      marginTop: 2,
      marginLeft: 5,
      borderWidth: 0.6,
      borderColor: theme.colors.gray,
      borderRadius: 24, 
      padding: 10, 
      justifyContent: 'center',
      alignItems: 'center',
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