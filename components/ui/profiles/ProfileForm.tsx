import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import { ensureUploaded } from '../../../src/lib/uploadImage';
import AvatarProfile from "./AvatarProfile";
// ✅ Firebase
import { auth, db } from "@/constants/firebaseConfig";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

// ✅ Image Picker
import * as ImagePicker from "expo-image-picker";

type Props = {
  redirectAfterSave?: boolean; // ใช้ตอน register เท่านั้น
};

const ProfileForm = ({ redirectAfterSave }: Props) => {
  const [userEmail, setUserEmail] = useState<string>("");
  const [userFname, setUserFname] = useState("");
  const [userLname, setUserLname] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userPromptPay, setUserPromptPay] = useState("");
  const [urlImage, setUrlImage] = useState("");
  const [gender, setGender] = useState("");
  const [uploading, setUploading] = useState(false);

  const genders = ["ชาย", "หญิง"];

  // ✅ โหลดข้อมูลเดิม + อีเมลจาก Auth
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // email จาก Auth คือแหล่งความจริง
        setUserEmail(user.email ?? "");

        const ref = doc(db, "profile", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          setUserFname(data.fname ?? "");
          setUserLname(data.lname ?? "");
          setUserPhone(data.telephone_number ?? "");
          setUserPromptPay(data.promptPay ?? "");
          setGender(data.gender ?? "");
          setUrlImage(data.photoURL ?? "");
          // ถ้าเอกสารมี email เก่า/ผิด ให้ UI ใช้ของ Auth อยู่ดี
        }
      } catch (error) {
        console.error("โหลดข้อมูลโปรไฟล์ล้มเหลว:", error);
      }
    };
    loadProfile();
  }, []);

  const isFormReady = useMemo(() => {
    return !!(userFname && userLname && userPhone && userPromptPay && gender);
  }, [userFname, userLname, userPhone, userPromptPay, gender]);

  const selectingImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("ต้องการสิทธิ์", "กรุณาอนุญาตเข้าถึงรูปภาพ");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setUrlImage(result.assets[0].uri);
      }
    } catch (err: any) {
      Alert.alert("ผิดพลาด", err.message);
    }
  };

  const sendingData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "No logged-in user");
        return;
      }

      setUploading(true);

      const httpsPhotoURL = await ensureUploaded(urlImage, () => `users/${user.uid}/profile.jpg`);

      await setDoc(
        doc(db, "profile", user.uid),
        {
          fname: userFname,
          lname: userLname,
          gender,
          telephone_number: userPhone,
          promptPay: userPromptPay,
          email: user.email ?? null,
          photoURL: httpsPhotoURL, // <- now HTTPS or null
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      Alert.alert("Success", "Profile updated");
      if (redirectAfterSave) router.replace("/login"); else router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not update profile");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.selectProfile}>
        <Pressable onPress={selectingImage} disabled={uploading}>
          <Text style={styles.underline}>
            {uploading ? "กำลังอัปโหลด..." : "เปลี่ยนรูปโปรไฟล์"}
          </Text>
        </Pressable>
      </View>

      <AvatarProfile urlImage={urlImage} width={190} height={190} />

      <View style={styles.formContarin}>
        <View style={styles.formCard}>
          <Text style={styles.h1}>ข้อมูลส่วนตัว</Text>

          <View style={styles.select}>
            <RNPickerSelect
              onValueChange={(value) => setGender(value)}
              placeholder={{ label: "เลือกเพศของคุณ...", value: null }}
              items={genders.map((g) => ({ label: g, value: g }))}
              style={pickerSelectStyles}
              value={gender}
            />
          </View>

          <TextInput
            label="ชื่อ"
            value={userFname}
            onChangeText={setUserFname}
            mode="outlined"
            outlineStyle={{ borderRadius: 18 }}
          />
          <TextInput
            label="นามสกุล"
            value={userLname}
            onChangeText={setUserLname}
            mode="outlined"
            outlineStyle={{ borderRadius: 18 }}
          />

          {/* ✅ อีเมล: แสดงค่าเป็น value และปิดแก้ไข */}
          <TextInput
            label="อีเมล"
            value={userEmail}
            mode="outlined"
            disabled
            outlineStyle={{ borderRadius: 18 }}
          />

          <TextInput
            label="หมายเลขมือถือ"
            value={userPhone}
            onChangeText={setUserPhone}
            mode="outlined"
            outlineStyle={{ borderRadius: 18 }}
            keyboardType="phone-pad"
          />
          <TextInput
            label="หมายเลขพร้อมเพย์"
            value={userPromptPay}
            onChangeText={setUserPromptPay}
            mode="outlined"
            outlineStyle={{ borderRadius: 18 }}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", width: "100%", justifyContent: "center", marginBlock: 40, gap: 15 }}>
        <Button
          mode="contained"
          buttonColor="green"
          onPress={sendingData}
          disabled={!isFormReady || uploading}
          style={styles.button}
        >
          <FontAwesome name="check" size={20} />
        </Button>
      </View>
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { fontSize: 16, paddingHorizontal: 10, color: "black", backgroundColor: "#fff" },
  inputAndroid: { fontSize: 16, paddingHorizontal: 10, color: "black", backgroundColor: "#fff" },
  placeholder: { color: "grey" },
  iconContainer: { top: 15, right: 15 },
});

const styles = StyleSheet.create({
  scrollView: { flex: 1, width: "100%" },
  selectProfile: { width: "100%", alignItems: "flex-end", marginTop: 20, paddingEnd: 10 },
  underline: { textDecorationLine: "underline", color: "blue" },
  formContarin: { width: "100%", alignItems: "center" },
  h1: { fontSize: 25, fontWeight: "800" },
  formCard: { width: "90%", display: "flex", gap: 10 },
  button: { alignItems: "center" },
  select: { width: "100%", borderWidth: 1, borderRadius: 18, borderColor: "gray", opacity: 0.5 },
});

export default ProfileForm;
