import { View } from '@/components/Themed';
import Profile from '@/components/ui/profiles/ProfileCard';
import ProfileForm from "@/components/ui/profiles/ProfileForm";
import { useSession } from '@/hooks/useAuth';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

export default function TabOneScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const { signOut, isLoading } = useSession();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut();
      // _layout.tsx will handle redirect to sign-in
    } catch (e) {
      console.warn('Sign out failed:', e);
      setLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.editProfile}>
        <Pressable onPress={() => setIsEditing(!isEditing)}>
          <Text style={styles.underline}>
            {isEditing ? (<FontAwesome name="times" size={23} color='red' />) : ('Edit profile')}
          </Text>
        </Pressable>
      </View>

      {isEditing ? (
        // ⬇️ No email prop here
        <ProfileForm />
      ) : (
        <>
          <Profile />

          {/* Logout button under the profile card */}
          <View style={styles.logoutWrap}>
            <Pressable
              onPress={handleLogout}
              disabled={isLoading || loggingOut}
              style={({ pressed }) => [
                styles.logoutBtn,
                (isLoading || loggingOut) && styles.logoutBtnDisabled,
                pressed && styles.logoutBtnPressed,
              ]}
            >
              {loggingOut ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.logoutText}>Sign out</Text>
              )}
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
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
    // ❌ marginBlock: 20,
    marginVertical: 20, // ✅ React Native supported
    paddingEnd: 25,
    backgroundColor: 'transparent',
  },
  underline: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
  logoutWrap: {
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  logoutBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnPressed: {
    opacity: 0.85,
  },
  logoutBtnDisabled: {
    opacity: 0.6,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});



