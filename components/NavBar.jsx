import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { theme } from '../constants/theme';

const NavBar = () => {
  
  const router = useRouter();
  
  
  
    return (
    <View style={styles.container}>
        <View style={styles.bar}>

          <Pressable onPress={() => router.push('home')}>
            <Ionicons name="home-outline" size={35} color = "white"/>
          </Pressable>

          <Pressable onPress={() => router.push('searchPage')}>
            <Ionicons name="search-outline" size={35} color = "white"/>
          </Pressable>

          <Pressable onPress={() => router.push('flashFeed')}>
            <Ionicons name="pricetags-outline" size={35} color = "white"/>
          </Pressable>

          <Pressable onPress={() => router.push('usersBookings')}>
            <Ionicons name="today-outline" size={35} color = "white"/>
          </Pressable>

        </View>
    </View>
  )
}

export default NavBar

const styles = StyleSheet.create({
    container: {
        
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        bottom: 0,
        

    }, 
    bar: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '80%',
        backgroundColor: '#000000eb',
        paddingVertical: 15,
        borderWidth: 0.6,
        borderColor: theme.colors.gray,
        borderRadius: 100,
    }
})