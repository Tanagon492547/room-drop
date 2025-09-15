
import { Text, View } from '@/components/Themed';
import LogoTitle from '@/components/ui/LogoTitle';
import { StyleSheet } from 'react-native';

const Search =()=>{
  return (
     <View style={styles.container}>
      <LogoTitle color='black' />
       <Text style={styles.title}>Search</Text>
       <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
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