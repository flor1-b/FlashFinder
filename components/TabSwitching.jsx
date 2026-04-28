import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

const TabSwitching = ({tabs, onChange, activeTab}) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
            <Pressable
                key={tab}
                onPress={()=> onChange(tab)}
                >
                    <Text style={[styles.tabText, activeTab === tab && styles.currentTab]}>
                        {tab}
                    </Text>
            </Pressable>
      ))}
    </View>
  );
};

export default TabSwitching

const styles = StyleSheet.create({
    tabText: {
        color: 'white',
        fontSize: 25,
        fontWeight: theme.fonts.extraBold,
        textTransform: 'capitalize',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginTop: 15,

    },
    currentTab: {
        textDecorationLine: 'underline',
    }
})