import { Pressable, StyleSheet, Text } from 'react-native';

import { View } from '@/components/Themed';
import Profile from '@/components/ui/profiles/ProfileCard';
import ProfileForm from "@/components/ui/profiles/ProfileForm";
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';

export default function TabOneScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState('ex@gamil.com');


  return (
    <View style={styles.container}>
      <View style={styles.editProfile}>
        <Pressable onPress={() => setIsEditing(!isEditing)}>
          <Text style={styles.underline}>
            {isEditing ? (<FontAwesome name="times" size={23} color='red' />) : ('แก้ไขโปรไฟล์')}</Text>
        </Pressable>
      </View>
      {isEditing ? (
        <ProfileForm email={email}  />
      ) : (
        <Profile />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width:'100%'
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
  editProfile: {
    width: '100%',
    alignItems: 'flex-end',
    marginBlock: 20, paddingEnd: 25,
    backgroundColor: 'transparent'
  },
  underline: {
    textDecorationLine: 'underline',
    color: 'blue'
  },
});
