import { StyleSheet, TextInput } from 'react-native'
import { theme } from '../constants/theme'

const InputBio = (props) => {

    return (
        <TextInput
        {...props}
        style={styles.input}
        placeholderTextColor={theme.colors.gray}
        />
    )

}


export default InputBio

const styles = StyleSheet.create({

    input: {
        flex: 1,
        flexDirection: 'row',
        
        height: 200,
        borderWidth: 1,
        borderColor: theme.colors.gray,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 15,
        color: "#e7e7e7",
        backgroundColor: "#2626268f",
        
        
    }
})