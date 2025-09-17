import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity, View } from "react-native";

const SocialAuth = () =>{
  return(
    <View style={{width:'100%', display:'flex', flexDirection:'row', justifyContent:'center', gap:100}}>
      <TouchableOpacity style={{backgroundColor:'#1877F2', borderRadius:59, paddingHorizontal:18, paddingBlock:10 }}>
        <FontAwesome name="facebook" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={{backgroundColor:'#e5e5e5ff', borderRadius:59, paddingHorizontal:15, borderColor: '#6e6e6eff', paddingBlock:10 }}>
        <FontAwesome name="google" size={30} color="black" />
      </TouchableOpacity>
    </View>
  )
}

export default SocialAuth;