
import { View } from '@/components/Themed';
import LogoTitle from '@/components/ui/LogoTitle';
import FormCard from '@/components/ui/searchs/FormCard';
import { colors } from '@/constants/Colors';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import Header from '../../components/ui/Header';


const Search = () => {

  return (
    <View style={styles.container}>
      <Header showSearch={false} />
      <View style={styles.content}>
        <LogoTitle color={colors.primary} size={100} fontSize={30} />
      <FormCard />
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
  content: {
    flex: 1,
    justifyContent: "center",   
    alignItems: "center",
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