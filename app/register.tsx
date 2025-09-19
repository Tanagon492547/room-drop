import AuthNavigationPrompt from "@/components/ui/AuthNavigationPrompt";
import AuthSeparator from "@/components/ui/AuthSeparator";
import SocialAuth from "@/components/ui/SocialAuth";
import { colors } from "@/constants/Colors";
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { subscribeToAuth } from './auth';


const Register = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Firebase auth state
  const [user, setUser] = React.useState<any>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  React.useEffect(() => {
    const unsub = subscribeToAuth(setUser);
    return unsub;
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#314071' }}>
      <View style={styles.loginBg}>
        <View style={styles.loginCard}>
          <View style={styles.textArea}>
            <Text style={styles.h1}>Create account</Text>
          </View>
          <View>
            <TextInput style={styles.inputCSS} placeholder="Username" />
            <View style={{ position: 'relative' }}>
              <TextInput style={styles.inputCSS} placeholder="Password" secureTextEntry={!isPasswordVisible} />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)} // <-- กดเพื่อสลับ state
              >
                <FontAwesome
                  name={isPasswordVisible ? 'eye-slash' : 'eye'} // <-- สลับชื่อไอคอน
                  size={22}
                  color="grey"
                />
              </TouchableOpacity>
            </View>
            <View style={{ position: 'relative' }}>
              <TextInput style={styles.inputCSS} placeholder="Confirm Password" secureTextEntry={!isPasswordVisible} />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)} // <-- กดเพื่อสลับ state
              >
                <FontAwesome
                  name={isPasswordVisible ? 'eye-slash' : 'eye'} // <-- สลับชื่อไอคอน
                  size={22}
                  color="grey"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => {
            // ส่วนนี้จำลองเข้า ระบบ ชัวร์คราว
            //router.replace('/login'); 

            // registration logic here

            }}>
            <Text style={styles.h2}>Sign up</Text>
          </TouchableOpacity>

          <AuthNavigationPrompt
            text="Already gave an account? "
            linkText="Login"
            href="/login"
          />

          <AuthSeparator />

          <SocialAuth />

        </View>
      </View>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  loginBg: {
    backgroundColor: colors.secondaryLight,
    width: 349,
    minHeight: 579,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  h1: {
    fontSize: 32,
    fontWeight: '500',
    color: colors.primary,
  },
  h2: {
    fontSize: 22,
    fontWeight: '500',
    color: colors.textWhite,
  },
  inputCSS: {
    borderWidth: 1,
    borderColor: '#DFDFDF',
    borderRadius: 30,
    width: 278,
    height: 44,
    paddingInlineStart: 20,
    paddingInlineEnd: 50,
    fontWeight: '600',
    marginBlock: 10,
  },
  eyeIcon: {
    position: 'absolute', // <-- ทำให้ไอคอนลอยได้
    right: 20, // <-- จัดตำแหน่งไปทางขวา
    top: 20

  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5
  },
  loginCard: {
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: colors.info,
    paddingHorizontal: 40,
    paddingBlock: 5,
    marginBlock: 10,
    borderRadius: 30,
  },
  textArea:{
    marginBlock:20
  }

}
)
export default Register;
