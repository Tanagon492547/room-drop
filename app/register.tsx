import AuthNavigationPrompt from "@/components/ui/AuthNavigationPrompt";
import AuthSeparator from "@/components/ui/AuthSeparator";
import SocialAuth from "@/components/ui/SocialAuth";
import { colors } from "@/constants/Colors";
import { FontAwesome } from '@expo/vector-icons';
import { router } from "expo-router";
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const register = async () => {
  try {
    // Use email + password to create auth user
    const email = `${username}@myapp.com`; // 👈 Trick: convert username into email
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save extra info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username,
      createdAt: new Date(),
    });

    console.log("User registered:", user.uid);
    router.replace("/login");
  } catch (err: any) {
    console.error("Error registering:", err.message);
  }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#314071' }}>
      <View style={styles.loginBg}>
        <View style={styles.loginCard}>
          <View style={styles.textArea}>
            <Text style={styles.h1}>Create account</Text>
          </View>

          <TextInput
            style={styles.inputCSS}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />

          <View style={{ position: 'relative' }}>
            <TextInput
              style={styles.inputCSS}
              placeholder="Password"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <FontAwesome
                name={isPasswordVisible ? 'eye-slash' : 'eye'}
                size={22}
                color="grey"
              />
            </TouchableOpacity>
          </View>

          <View style={{ position: 'relative' }}>
            <TextInput
              style={styles.inputCSS}
              placeholder="Confirm Password"
              secureTextEntry={!isPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <FontAwesome
                name={isPasswordVisible ? 'eye-slash' : 'eye'}
                size={22}
                color="grey"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={register}>
            <Text style={styles.h2}>Sign up</Text>
          </TouchableOpacity>

          <AuthNavigationPrompt
            text="Already have an account? "
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
    position: 'absolute',
    right: 20,
    top: 20
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
  textArea: {
    marginBlock: 20
  }
});

export default Register;

