
import { View } from '@/components/Themed';
import LogoTitle from '@/components/ui/LogoTitle';
import FormCard from '@/components/ui/searchs/FormCard';
import { colors } from '@/constants/Colors';
import * as React from 'react';
import { StyleSheet } from 'react-native';


const Search = () => {

  return (
    <View style={styles.container}>
      <LogoTitle color={colors.primary} size={100} fontSize={30} />
      <FormCard />
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