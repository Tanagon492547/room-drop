import React from 'react';
import { StyleSheet, Text, View } from "react-native";

const AuthSeparator = () =>{
  return(
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>OR</Text>
      <View style={styles.line} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  text: {
    marginHorizontal: 15,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
});

export default AuthSeparator;