import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';


const MessageLayout = ({ message, isMyMessage }) => {

if (!message) return null;

  return (
    <View style={[styles.container, isMyMessage ? styles.myMessage : styles.otherMessage,]}>
        <Text style={styles.messageText}>
            {message.message}
        </Text>
    </View>

  )
}

export default MessageLayout;

const styles = StyleSheet.create({
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#4c4c4c68'

    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#00c8ff68'

    },
    messageText: {
        color: 'white',
        fontSize: 16,
        fontWeight: theme.fonts.medium,
        padding: 10,
    },
    container: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: 20,
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

