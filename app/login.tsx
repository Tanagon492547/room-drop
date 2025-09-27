import AuthNavigationPrompt from "@/components/ui/AuthNavigationPrompt";
import AuthSeparator from "@/components/ui/AuthSeparator";
import SocialAuth from "@/components/ui/SocialAuth";
import { colors } from "@/constants/Colors";
import { useSession } from "@/hooks/useAuth";
import { FontAwesome } from '@expo/vector-icons';
import Checkbox from "expo-checkbox";
import { Link, router } from "expo-router";
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mapAuthError = (code?: string) => {
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/missing-password":
    case "auth/weak-password":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    default:
      return "Login failed. Please try again.";
  }
};

const SignIn = () => {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg("Please fill email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await signIn(email.trim(), password);
      router.replace('/');
    } catch (error: any) {
      const friendly = mapAuthError(error?.code);
      setErrorMsg(friendly);
      console.log("Login error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#314071' }}>
      <View style={styles.loginBg}>
        <View style={styles.loginCard}>
          <View style={styles.textArea}>
            <Text style={styles.h1}>Login</Text>
          </View>

          {/* Error banner */}
          {errorMsg ? (
            <View style={styles.errorBanner}>
              <FontAwesome name="exclamation-circle" size={16} color="#7f1d1d" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <View>
            <TextInput
              style={styles.inputCSS}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              inputMode="email"
            />

            <View style={{ position: 'relative' }}>
              <TextInput
                style={styles.inputCSS}
                placeholder="Password"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                disabled={submitting}
              >
                <FontAwesome
                  name={isPasswordVisible ? 'eye-slash' : 'eye'}
                  size={22}
                  color="grey"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.forgotandRemeberMe}>
            <Pressable
              style={styles.checkboxContainer}
              onPress={() => setChecked(!isChecked)}
            >
              <Checkbox
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? '#4630EB' : undefined}
              />
              <Text>Remember me</Text>
            </Pressable>

            {/* TODO: wire this to your real forgot-password flow */}
            <Link href="/">
              <Text>Forgot password?</Text>
            </Link>
          </View>

          <TouchableOpacity
            style={[styles.button, submitting && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={submitting}
          >
            <Text style={styles.h2}>{submitting ? "Logging in..." : "Login"}</Text>
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
};

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
    paddingLeft: 20,
    paddingRight: 50,
    fontWeight: '600',
    marginVertical: 10,
    backgroundColor: 'white',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 10,
    height: 44,
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  loginCard: {
    width: '80%',
    alignItems: 'center'
  },
  forgotandRemeberMe: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginVertical: 10,
  },
  button: {
    backgroundColor: colors.info,
    paddingHorizontal: 40,
    paddingVertical: 8,
    marginVertical: 10,
    borderRadius: 30,
  },
  textArea: {
    marginVertical: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    width: 278,
  },
  errorText: {
    color: '#7f1d1d',
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignIn;
