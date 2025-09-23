import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import AvatarProfile from "./AvatarProfile";

// ✅ Firebase
import { auth, db } from "@/constants/firebaseConfig";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

// ✅ Image Picker
import * as ImagePicker from "expo-image-picker";

type Props = {
  email: string | undefined;
  redirectAfterSave?: boolean; // 👈 new prop
};

const ProfileForm = ({ email, redirectAfterSave }: Props) => {
  const [userFname, setUserFname] = useState("");
  const [userLname, setUserLname] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState(""); // ฝากทำให้อีเมล์ขึ้นด้วยนะ
  const [userPropPay, setUserPropPay] = useState("");
  const [urlImage, setUrlImage] = useState("");
  const [gender, setGender] = useState("");
  const [uploading, setUploading] = useState(false);

  const genders = ["ชาย", "หญิง"];

  // ✅ โหลดข้อมูลเดิม
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const ref = doc(db, "profile", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setUserFname(data.fname || "");
          setUserLname(data.lname || "");
          setUserPhone(data.telephone_number || "");
          setUserPropPay(data.promptPay || "");
          setGender(data.gender || "");
          setUrlImage(data.photoURL || "");
          setUserEmail(data.email || "") // ฝากทำให้อีเมล์ขึ้นด้วยนะ
        }
      } catch (error) {
        console.error("โหลดข้อมูลโปรไฟล์ล้มเหลว:", error);
      }
    };
    loadProfile();
  }, []);

  const doStatusMatch = useMemo(() => {
    return !!(userFname && userLname && userPhone && userPropPay && gender);
  }, [userFname, userLname, userPhone, userPropPay, gender]);

  const isFormReady = doStatusMatch;

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
      const pickedUri = result.assets[0].uri;

      // ✅ แสดงทันที
      setUrlImage(pickedUri);

    }
  } catch (err: any) {
    Alert.alert("ผิดพลาด", err.message);
    }
  };
 
  const sendingData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("ผิดพลาด", "ไม่พบผู้ใช้ที่ล็อกอิน");
        return;
      }
      const ref = doc(db, "profile", user.uid);
      await setDoc(
        ref,
        {
          fname: userFname,
          lname: userLname,
          gender,
          telephone_number: userPhone,
          promptPay: userPropPay,
          email:userEmail, // ฝากทำให้อีเมล์ขึ้นด้วยนะ
          photoURL: urlImage || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      Alert.alert("สำเร็จ", "อัปเดตข้อมูลโปรไฟล์เรียบร้อย");

      if (redirectAfterSave) {
        router.replace("/login"); // 👈 only when register
      } else {
        router.back(); // 👈 when editing in profile tab
      }
    } catch (error) {
      console.error("อัปเดตโปรไฟล์ล้มเหลว:", error);
      Alert.alert("ผิดพลาด", "ไม่สามารถอัปเดตโปรไฟล์ได้");
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

          <TextInput label="ชื่อ" value={userFname} onChangeText={setUserFname} mode="outlined" outlineStyle={{ borderRadius: 18 }} />
          <TextInput label="นามสกุล" value={userLname} onChangeText={setUserLname} mode="outlined" outlineStyle={{ borderRadius: 18 }} />
          <TextInput label={email} mode="outlined" disabled outlineStyle={{ borderRadius: 18 }} />
          <TextInput label="หมายเลขมือถือ" value={userPhone} onChangeText={setUserPhone} mode="outlined" outlineStyle={{ borderRadius: 18 }} />
          <TextInput label="หมายเลขพร้อมเพย์" value={userPropPay} onChangeText={setUserPropPay} mode="outlined" outlineStyle={{ borderRadius: 18 }} />
        </View>
      </View>

      <View style={{ flexDirection: "row", width: "100%", justifyContent: "center", marginBlock: 40, gap: 15 }}>
        <Button mode="contained" buttonColor="green" onPress={sendingData} disabled={!isFormReady || uploading} style={styles.button}>
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
