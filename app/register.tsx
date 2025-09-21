// app/register.tsx
import { colors } from "@/constants/Colors";
import { auth, db } from "@/constants/firebaseConfig";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Register = () => {
  const [email, setEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // === VALIDATION ===
  const isEmailValid = useMemo(() => {
    if (!email) return true;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }, [email]);

  const isPasswordLengthValid = useMemo(
    () => createPassword.length >= 6,
    [createPassword]
  );

  const doPasswordsMatch = useMemo(
    () => createPassword === confirmPassword,
    [createPassword, confirmPassword]
  );

  const isFormReady = isEmailValid && isPasswordLengthValid && doPasswordsMatch && !!email;

  // === Create / ensure user doc ===
  async function ensureUserDoc(uid: string, displayName?: string | null) {
    const ref = doc(db, "users", uid);
    await setDoc(
      ref,
      {
        displayName: displayName ?? "",
        promptpayRef: null,
        promptpayMasked: null,
        stats: { activeListings: 0, completedOrders: 0, rating: null },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  // === REGISTER ===
  const handleRegister = async () => {
    if (!isFormReady) return;

    setIsLoading(true);
    try {
      // ใช้รหัสผ่านจาก createPassword (ไม่ใช่ confirm)
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        createPassword
      );

      // ตั้งชื่อเริ่มต้นจากส่วนหน้าของอีเมล (optional)
      const defaultName = email.split("@")[0];
      await updateProfile(cred.user, { displayName: defaultName });

      // สร้างเอกสารผู้ใช้ใน Firestore
      await ensureUserDoc(cred.user.uid, defaultName);

      Alert.alert("สำเร็จ", "สมัครสมาชิกเรียบร้อย");
      // ไปหน้าสร้างโปรไฟล์ (อยู่ในกลุ่ม (app) ของคุณ)
      router.replace({
        pathname: "./profilecreate",
        params: { email: email.trim() },
      });
    } catch (error: any) {
      console.error("สมัครสมาชิกล้มเหลว:", error);
      const code = error?.code as string | undefined;

      // map ข้อความให้เข้าใจง่าย
      if (code === "auth/email-already-in-use") {
        Alert.alert("ผิดพลาด", "อีเมลนี้ถูกใช้งานแล้ว");
      } else if (code === "auth/invalid-email") {
        Alert.alert("ผิดพลาด", "อีเมลไม่ถูกต้อง");
      } else if (code === "auth/weak-password") {
        Alert.alert("ผิดพลาด", "รหัสผ่านควรมีอย่างน้อย 6 ตัวอักษร");
      } else if (code === "auth/network-request-failed") {
        Alert.alert("ผิดพลาด", "เครือข่ายมีปัญหา โปรดลองใหม่");
      } else {
        Alert.alert("ผิดพลาด", "ไม่สามารถสมัครสมาชิกได้ โปรดลองอีกครั้ง");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#314071" }}>
      <View style={styles.loginBg}>
        <View style={styles.loginCard}>
          <View style={styles.textArea}>
            <Text style={styles.h1}>Create account</Text>
          </View>

          <View>
            {/* Email */}
            <TextInput
              style={styles.inputCSS}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            {!isEmailValid && <Text style={{ color: "red" }}>รูปแบบอีเมลไม่ถูกต้อง</Text>}

            {/* Password */}
            <View style={{ position: "relative" }}>
              <TextInput
                style={styles.inputCSS}
                placeholder="Password (อย่างน้อย 6 ตัว)"
                secureTextEntry={!isPasswordVisible}
                value={createPassword}
                onChangeText={setCreatePassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <FontAwesome name={isPasswordVisible ? "eye-slash" : "eye"} size={22} color="grey" />
              </TouchableOpacity>
            </View>
            {createPassword.length > 0 && !isPasswordLengthValid && (
              <Text style={{ color: "red" }}>รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</Text>
            )}

            {/* Confirm Password */}
            <View style={{ position: "relative" }}>
              <TextInput
                style={styles.inputCSS}
                placeholder="Confirm Password"
                secureTextEntry={!isConfirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              >
                <FontAwesome name={isConfirmPasswordVisible ? "eye-slash" : "eye"} size={22} color="grey" />
              </TouchableOpacity>
            </View>
            {confirmPassword.length > 0 && !doPasswordsMatch && (
              <Text style={{ color: "red" }}>รหัสผ่านไม่ตรงกัน</Text>
            )}
          </View>

          <TouchableOpacity
            style={isFormReady ? styles.button : styles.disabledButton}
            disabled={!isFormReady || isLoading}
            onPress={handleRegister}
          >
            <Text style={styles.h2}>{isLoading ? "กำลังสมัคร..." : "Sign up"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginBg: {
    backgroundColor: colors.secondaryLight,
    width: 349,
    minHeight: 579,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  h1: { fontSize: 32, fontWeight: "500", color: colors.primary },
  h2: { fontSize: 22, fontWeight: "500", color: colors.textWhite },
  inputCSS: {
    borderWidth: 1,
    borderColor: "#DFDFDF",
    borderRadius: 30,
    width: 278,
    height: 44,
    paddingInlineStart: 20,
    paddingInlineEnd: 50,
    fontWeight: "600",
    marginBlock: 10,
    backgroundColor: "white",
  },
  eyeIcon: { position: "absolute", right: 20, top: 20 },
  loginCard: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: colors.info,
    paddingHorizontal: 40,
    paddingBlock: 5,
    marginBlock: 10,
    borderRadius: 30,
  },
  disabledButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 40,
    paddingBlock: 5,
    marginBlock: 10,
    borderRadius: 30,
    opacity: 0.5,
  },
  textArea: { marginBlock: 20 },
});

export default Register;
