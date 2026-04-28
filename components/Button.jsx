import { Pressable, StyleSheet, Text } from 'react-native'
import { theme } from '../constants/theme'

const Button = ({
    buttonStyle,
    textStyle,
    title='',
    onPress=()=>{},
    hasShadow = true, 

}) => {

    const shadowStyle = {
      shadowColor: 'black', 
      shadowOffset: {width: 3, height: 10},
      shadowRadius: 10,
      elevation: 2
    }

  return (
    <Pressable onPress={onPress} style = {[styles.button, buttonStyle, hasShadow && shadowStyle]}>
      <Text style={[styles.text, textStyle ]}>{title}</Text>
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({
    button:{
        backgroundColor: "#2626268f",
        height: 35,
        width: 110,
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.xs,
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
    },
    text: {
        fontSize: 17,
        color: theme.colors.gray,
        fontWeight: theme.fonts.medium,
        textAlign: 'center',
        letterSpacing: 0.5,
        

        //BUTTON TEXT SHADOWS
        textShadowColor: 'black',
        textShadowRadius: 20,
        textShadowOffset: { width: 0, height: 4},
    }
})