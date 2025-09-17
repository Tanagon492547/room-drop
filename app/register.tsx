import { colors } from "@/constants/Colors"; // สมมติว่า path ถูกต้อง
import { auth } from "@/constants/firebaseConfig"; // ✨ 1. Import auth จาก Firebase config
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth"; // ✨ 2. Import ฟังก์ชันสมัครสมาชิก
import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Register = () => {
  const [email, setEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✨ 3. เพิ่ม State สำหรับ Loading

  // --- VALIDATION LOGIC (ปรับปรุงใหม่) ---
  const isEmailValid = useMemo(() => {
    if (!email) return true;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }, [email]);

  const isPasswordLengthValid = useMemo(() => {
    return createPassword.length >= 6;
  }, [createPassword]);

  const doPasswordsMatch = useMemo(() => {
    return createPassword === confirmPassword;
  }, [createPassword, confirmPassword]);

  const isFormReady = isEmailValid && isPasswordLengthValid && doPasswordsMatch;

  // ✨ 4. ฟังก์ชันสมัครสมาชิกกับ Firebase จริง
  const handleRegister = async () => {
    if (!isFormReady) return;
    setIsLoading(true); // เริ่ม loading
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, confirmPassword);
      console.log('สมัครสมาชิกสำเร็จ!', userCredential.user.uid);
      Alert.alert('สำเร็จ', 'คุณได้สมัครสมาชิกเรียบร้อยแล้ว');
      // เมื่อสำเร็จ ให้ redirect ไปหน้าสร้างโปรไฟล์
      router.replace({
        pathname: '/profilecreate',
        params: { email: email},
      });
    } catch (error: any) {
      console.error('สมัครสมาชิกล้มเหลว:', error);
      // แสดงข้อความ Error ที่เข้าใจง่ายขึ้น
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('ผิดพลาด', 'อีเมลนี้ถูกใช้งานแล้ว');
      } else {
        Alert.alert('ผิดพลาด', 'ไม่สามารถสมัครสมาชิกได้ โปรดลองอีกครั้ง');
      }
    } finally {
      setIsLoading(false); // หยุด loading
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#314071' }}>
      <View style={styles.loginBg}>
        <View style={styles.loginCard}>
          <View style={styles.textArea}>
            <Text style={styles.h1}>Create account</Text>
          </View>
          <View>
            {/* ... Email Input ... */}
            <TextInput style={styles.inputCSS} placeholder="Email" value={email} onChangeText={setEmail} />
            {!isEmailValid && <Text style={{ color: 'red' }}>รูปแบบอีเมลไม่ถูกต้อง</Text>}

            {/* ... Password Input ... */}
            <View style={{ position: 'relative' }}>
              <TextInput
                style={styles.inputCSS}
                placeholder="Password (6 ตัวขึ้นไป)"
                secureTextEntry={!isPasswordVisible}
                value={createPassword}
                onChangeText={setCreatePassword}
              />
              {/* ... Eye Icon ... */}
            </View>
            {/* ✨ 5. แสดง Error ความยาวรหัสผ่าน */}
            {createPassword.length > 0 && !isPasswordLengthValid && (
              <Text style={{ color: 'red' }}>รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</Text>
            )}

            {/* ... Confirm Password Input ... */}
            <View style={{ position: 'relative' }}>
              <TextInput
                style={styles.inputCSS}
                placeholder="Confirm Password"
                secureTextEntry={!isConfirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              {/* ... Eye Icon ... */}
            </View>
            {/* ✨ 6. แสดง Error รหัสผ่านไม่ตรงกัน */}
            {confirmPassword.length > 0 && !doPasswordsMatch && (
              <Text style={{ color: 'red' }}>รหัสผ่านไม่ตรงกัน</Text>
            )}
          </View>

          <TouchableOpacity
            style={isFormReady ? styles.button : styles.disabledButton}
            disabled={!isFormReady || isLoading} // ปิดปุ่มตอน loading ด้วย
            onPress={handleRegister} // <-- เรียกใช้ฟังก์ชันใหม่
          >
            <Text style={styles.h2}>{isLoading ? 'กำลังสมัคร...' : 'Sign up'}</Text>
          </TouchableOpacity>
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
  disabledButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 40,
    paddingBlock: 5,
    marginBlock: 10,
    borderRadius: 30,
    opacity: 50
  },
  textArea: {
    marginBlock: 20
  }

}
)
export default Register;
