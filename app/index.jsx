import { useRouter } from 'expo-router';
import { Button, View } from 'react-native';

const index = () => {
    const router = useRouter();


    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center", gap: 12}}>
            
            <Button title = "start" onPress={()=> router.push('/welcome')} />
        </View>
        
    )
}

export default index