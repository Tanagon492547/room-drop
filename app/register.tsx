import { colors } from "@/constants/Colors";
import { FontAwesome } from '@expo/vector-icons';
import { router } from "expo-router";
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const Register = () => {
  const [email, setEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  // คำนวณค่า Error และความพร้อมของฟอร์มโดยตรง ไม่ต้องใช้ useEffect
  const isEmailValid = useMemo(() => {
    if (!email) return true; // ยังไม่พิมพ์ ไม่ต้องโชว์ error
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }, [email]);

  const doPasswordsMatch = useMemo(() => {
    if (!createPassword || !confirmPassword) return true;
    return createPassword === confirmPassword;
  }, [createPassword, confirmPassword]);

  const isFormReady = email && createPassword && confirmPassword && isEmailValid && doPasswordsMatch;

  const handleSubmit = () => {
    if (!isFormReady) return;
    // ส่วนนี้จำลองเข้า ระบบ ชัวร์คราว
    router.replace({
      pathname: '/profilecreate',
      params: {
        email: email,
        password: confirmPassword
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#314071' }}>
      <View style={styles.loginBg}>
        <View style={styles.loginCard}>
          <View style={styles.textArea}>
            <Text style={styles.h1}>Create account</Text>
          </View>
          <View>

            <TextInput style={styles.inputCSS} placeholder="Email" value={email} onChangeText={setEmail} />
            {!isEmailValid && <Text style={{ color: 'red' }}>รูปแบบอีเมลไม่ถูกต้อง</Text>}

            <View style={{ position: 'relative' }}>
              <TextInput
                style={styles.inputCSS}
                placeholder="Password"
                secureTextEntry={!isPasswordVisible}
                value={createPassword}
                onChangeText={setCreatePassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <FontAwesome name={isPasswordVisible ? 'eye-slash' : 'eye'} size={22} color="grey" />
              </TouchableOpacity>
            </View>

            <View style={{ position: 'relative' }}>
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
                <FontAwesome name={isConfirmPasswordVisible ? 'eye-slash' : 'eye'} size={22} color="grey" />
              </TouchableOpacity>
            </View>
          </View>

          {!doPasswordsMatch && (<View><Text style={{ color: 'red' }}>รหัสไม่ถูกต้อง โปรดกรอกให้ตรงกันทั้งสอง</Text></View>)}

          <TouchableOpacity
            style={isFormReady ? styles.button : styles.disabledButton}
            disabled={!isFormReady}
            onPress={handleSubmit}
          >
            <Text style={styles.h2}>Sign up</Text>
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
