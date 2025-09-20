import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

type  props = {
  urlImage : string | undefined,
  width: number,
  height: number
}

const AvatarProfile =({urlImage, width, height}:props)=>{
  return(
     <View style={styles.cardBody}>
            <Image
               source={{ uri: `${urlImage ? urlImage : 'https://as1.ftcdn.net/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'}` }}
              style={[styles.avatar, {width: width, height: height,}]}
            />
      </View>
  )
}

const styles = StyleSheet.create({
  cardBody: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  avatar: {
    
    borderRadius: 100,
    backgroundColor: '#777777ff',
  },
})

export default AvatarProfile;