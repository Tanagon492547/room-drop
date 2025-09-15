
import { View } from '@/components/Themed';
import LogoTitle from '@/components/ui/LogoTitle';
import { colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

const Search =()=>{
  return (
     <View style={styles.container}>
      <LogoTitle color='black' />
          <View style={{width:360, borderRadius:10, minHeight:314, backgroundColor:colors.background}}>
            
          </View>       
     </View>
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center',
   },
   title: {
     fontSize: 20,
     fontWeight: 'bold',
   },
   separator: {
     marginVertical: 30,
     height: 1,
     width: '80%',
   },
 });

export default Search;