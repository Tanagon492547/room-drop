import AuthNavigationPrompt from "@/components/ui/AuthNavigationPrompt";
import AuthSeparator from "@/components/ui/AuthSeparator";
import SocialAuth from "@/components/ui/SocialAuth";
import { colors } from "@/constants/Colors";
import { auth } from '@/constants/firebaseConfig'; // 2. Import ฟังก์ชันล็อกอิน
import { useSession } from "@/hooks/useAuth";
import { FontAwesome } from '@expo/vector-icons';
import Checkbox from "expo-checkbox";
import { Link, router } from "expo-router";
import { signInWithEmailAndPassword } from 'firebase/auth'; // 1. Import auth
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isChecked, setChecked] = useState(false);

  const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    
    // ✨ ส่ง email ที่ผู้ใช้กรอก เข้าไปในฟังก์ชัน signIn()
    signIn(email); 

    router.replace('/');
  } catch (error) {
    console.log("ว๊า", error)
  }
};

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#314071' }}>
      <View style={styles.loginBg}>
        <View style={styles.loginCard}>
          <View style={styles.textArea}>
            <Text style={styles.h1}>Login</Text>
          </View>
          <View>
            <TextInput style={styles.inputCSS} placeholder="Email" value={email} onChangeText={(email)=>{setEmail(email)}} />
            <View style={{ position: 'relative' }}>

              <TextInput 
              style={styles.inputCSS} 
              placeholder="password" 
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={(password)=>{setPassword(password)}}
              />
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

          <View style={styles.forgotandRemeberMe}>
            <Pressable
              style={styles.checkboxContainer}
              onPress={() => setChecked(!isChecked)} // <-- ทำให้กดที่ข้อความได้ด้วย
            >
              <Checkbox
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? '#4630EB' : undefined}
              />
              <Text>Remember me</Text>
            </Pressable>
            <Link href="/">
              <Text style={{}}>
                Forgot password?
              </Text>
            </Link>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.h2}>Login</Text>
          </TouchableOpacity>

          <AuthNavigationPrompt
            text="Don’t have an account? "
            linkText="Sign up"
            href="/register"
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
  forgotandRemeberMe: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginBlock: 10,
  },
  button: {
    backgroundColor: colors.info,
    paddingHorizontal: 40,
    paddingBlock: 5,
    marginBlock: 10,
    borderRadius: 30,
  },
  textArea: {
    marginBlock: 20
  }
}
)
export default SignIn;
