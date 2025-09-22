import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import AvatarProfile from "./AvatarProfile";

// ✅ Firebase
import { auth, db } from "@/constants/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const ProfileCard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const ref = doc(db, "profile", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data());
        }
      } catch (error) {
        console.error("โหลดโปรไฟล์ล้มเหลว:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0065C3" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.datailCard}>
        <AvatarProfile urlImage={profile?.photoURL || ""} width={100} height={100} />
        <View>
          <Text style={styles.h1}>
            {profile?.fname || "ไม่มีข้อมูล"} {profile?.lname || ""}
          </Text>

          <View style={styles.detail}>
            <Text style={styles.h2}>เพศ :</Text>
            <Text style={styles.p}>{profile?.gender || "ไม่มีข้อมูล"}</Text>
          </View>

          <View style={styles.detail}>
            <Text style={styles.h2}>Email :</Text>
            <Text style={styles.p}>{profile?.email || "ไม่มีข้อมูล"}</Text>
          </View>

          <View style={styles.detail}>
            <Text style={styles.h2}>phone number :</Text>
            <Text style={styles.p}>{profile?.telephone_number || "ไม่มีข้อมูล"}</Text>
          </View>

          <View style={styles.detail}>
            <Text style={styles.h2}>PromptPay :</Text>
            <Text style={styles.p}>{profile?.promptPay || "ไม่มีข้อมูล"}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center", justifyContent: "center" },
  datailCard: {
    width: "90%",
    backgroundColor: "#0065C3",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    gap: 20,
    paddingBlock: 50,
  },
  detail: { flexDirection: "row" },
  h1: { fontSize: 20, fontWeight: "800", color: "white" },
  h2: { fontSize: 10, fontWeight: "500", color: "white" },
  p: { fontSize: 10, fontWeight: "300", color: "white" },
});
export default ProfileCard;
