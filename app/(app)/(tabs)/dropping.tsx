import DropCard from "@/components/ui/drops/DropCard";
import TitleText from "@/components/ui/TitleText";
import { colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";



const DropPing = () => {

    const addRoom = () => {
        console.log('เพิ่มห้อง');
        router.replace('/(app)/(tabs)/droproom')
    }

    return (
        <View style={{ width: '100%', flex: 1, alignItems: 'center', position: 'relative' }}>
            <TitleText textTitle='Dropping' />
            <View style={{ flex: 1, width:'100%' }}>
                <DropCard />
            </View>
            <Pressable style={({ hovered, pressed }) => [
                styles.plus, 
                hovered && styles.plusHovered, 
                pressed && styles.plusHovered, 
            ]} onPress={addRoom} >
                <FontAwesome
                    name="plus" size={40}
                    color='white'
                />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    plus: {
        backgroundColor: colors.primaryPlus,
        display: 'flex',
        paddingBlock: 10,
        paddingHorizontal: 15,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 25,
        right: 8
    },
    plusHovered: {
        backgroundColor: 'skyblue'
    },
})

export default DropPing;