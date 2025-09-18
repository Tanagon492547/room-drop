import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

type props = {
  url: string | undefined,
}
const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


const DropImageCard = ({ url }: props) => {
  return (
    <View style={{width:200, height:100}}>
      <Image
        style={styles.image}
        source={ url? url: "https://picsum.photos/seed/696/3000/2000" }
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0553',
    borderRadius: 20,
  },
  card: {
    width: '100%',
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative'
  },
 
})

export default DropImageCard;