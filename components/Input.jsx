import { StyleSheet, TextInput } from 'react-native'
import { theme } from '../constants/theme'

const Input = (props) => {

    return (
        <TextInput
        {...props}
        style={styles.input}
        placeholderTextColor={theme.colors.gray}
        />
    )

}


export default Input

const styles = StyleSheet.create({

    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: theme.colors.gray,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 15,
        color: "#e7e7e7",
        backgroundColor: "#2626268f",
        
        
    }
})