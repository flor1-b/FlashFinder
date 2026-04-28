import { Image } from 'expo-image'
import { StyleSheet } from 'react-native'
import { theme } from '../constants/theme'
import { getUserImageSrc } from '../services/imageService'

const Avatar = ({
  uri,
  size = 40,
  rounded = theme.radius.md,
  style = {}
}) => {


  return (
    <Image
      source = {getUserImageSrc(uri)}
      transition = {100}
      cachePolicy="none"
      style = {[styles.avatar, {height: size, width: size, borderRadius: rounded},]}
    
    />

    
  )
}

export default Avatar

const styles = StyleSheet.create({
  avatar: {
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
    borderWidth: 0.5
  }
})


