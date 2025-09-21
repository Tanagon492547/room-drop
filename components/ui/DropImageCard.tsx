import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

type props = {
  url?: string,
  width?: number,
  height?: number,
  detailCard?: boolean,
}
const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


const DropImageCard = ({ url, width, height, detailCard }: props) => {
  return (
    <View style={{ width: width ? width : 200, height: height ? height : 100 }}>
      <Image
        style={[
          styles.image,
          !detailCard && styles.borderR // <-- ✨ ใช้ ! (not) และ &&
        ]}
        source={url ? url : "https://picsum.photos/seed/696/3000/2000"}
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
    backgroundColor: 'rgba(85, 0, 0, 0.2)',
  },
  borderR: {
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