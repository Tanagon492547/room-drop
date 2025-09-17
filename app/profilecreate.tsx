import ProfileForm from "@/components/ui/profiles/ProfileForm";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileCreate =()=>{
  const params = useLocalSearchParams();
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
   
  return(
    <SafeAreaView  style={styles.contrainer}>
      <ProfileForm email={email}  />
       <StatusBar style="auto" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contrainer:{
    flex:1,
    width:'100%',
    backgroundColor:'white'
  },
  
})

export default ProfileCreate;