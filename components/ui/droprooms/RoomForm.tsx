import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-paper";

// ✅ Firebase
import { auth, db } from "@/constants/firebaseConfig";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";

// ✅ Image Picker
import * as ImagePicker from "expo-image-picker";

const RoomForm = () => {
  const [hotel_name, setHotelName] = useState("");
  const [hotel_location, setHotelLocation] = useState("");
  const [hotel_photoURL, setHotelPhoto] = useState("");
  const [room_name, setRoomName] = useState("");
  const [room_date_checkIn, setCheckIn] = useState("");
  const [room_date_checkOut, setCheckOut] = useState("");
  const [room_price, setRoomPrice] = useState("");
  const [room_description, setRoomDescription] = useState("");
  const [room_photoURL, setRoomPhoto] = useState("");
  const [room_bill, setRoomBill] = useState("");
  const [promptPay, setPromptPay] = useState("");
  const room_status = 1

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, "profile", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setPromptPay(data.promptPay || ""); // set PromptPay from profile
      }
    };
    loadProfile();
  }, []);

  // ✅ Pick image helper
  const pickImage = async (setImage: (uri: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ✅ Upload to Firebase Storage
  {/*const uploadFile = async (uri: string, path: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };*/}

  // ✅ Submit form
  const sendForm = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      // Hotel photo
      const selectHotelPhoto = async () => {
        try {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Permission required", "Please allow access to your photos");
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
            setHotelPhoto(pickedUri); // Save to state
          }
        } catch (err: any) {
          Alert.alert("Error", err.message);
        }
      };

      // Room photo
      const selectRoomPhoto = async () => {
        try {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Permission required", "Please allow access to your photos");
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
            setRoomPhoto(pickedUri); // Save to state
          }
        } catch (err: any) {
          Alert.alert("Error", err.message);
        }
      };

      // Room bill
      const selectRoomBill = async () => {
        try {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Permission required", "Please allow access to your photos");
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
            setRoomBill(pickedUri); // Save to state
          }
        } catch (err: any) {
          Alert.alert("Error", err.message);
        }
      };

      // ✅ Create hotel document
      const hotelRef = await addDoc(collection(db, "hotels"), {
        hotel_name,
        hotel_location,
        hotel_photoURL: hotel_photoURL,
        createdAt: new Date(),
      });

      // ✅ Create room document (linked to hotel)
      await addDoc(collection(db, "rooms"), {
        room_name,
        room_description,
        room_price,
        room_date_checkIn,
        room_date_checkOut,
        room_photoURL: room_photoURL,
        room_bill: room_bill,
        room_status,
        hotel_id: hotelRef.id,
        hotel_name,
        user_id: user.uid,
        createdAt: new Date(),
      });

      console.log("Room posted successfully 🚀");

      router.replace('/(app)/(tabs)/dropping')
    } catch (error) {
      console.error("Error posting room:", error);
    }
  }

  return (
    <View style={styles.form}>
      <ScrollView>
        <View style={styles.formIn}>
          <Text style={styles.h1}>Post a Room</Text>

          <View style={styles.inputArea}>
            <Text>Hotel Name</Text>
            <TextInput
              placeholder="Hotel Name"
              style={styles.input}
              value={hotel_name}
              onChangeText={setHotelName}
            />
          </View>

          <View style={styles.inputArea}>
            <Text>Hotel Location</Text>
            <TextInput
              placeholder="Hotel Location"
              style={styles.input}
              value={hotel_location}
              onChangeText={setHotelLocation}
            />
          </View>

          {/* ✅ Hotel Photo */}
          <View style={styles.inputArea}>
            <Button
              icon="upload"
              mode="outlined"
              onPress={() => pickImage(setHotelPhoto)}
            >
              Upload Hotel Photo
            </Button>
          </View>

          <View style={styles.inputArea}>
            <Text>Room Name</Text>
            <TextInput
              placeholder="Room Name"
              style={styles.input}
              value={room_name}
              onChangeText={setRoomName}
            />
          </View>

          <View style={styles.dateinputArea}>
            <View>
              <Text>Check-in Date</Text>
              <TextInput
                style={styles.inputDate}
                placeholder="22/09/2025"
                value={room_date_checkIn}
                onChangeText={setCheckIn}
              />
            </View>
            <View>
              <Text>Check-out Date</Text>
              <TextInput
                style={styles.inputDate}
                placeholder="25/09/2025"
                value={room_date_checkOut}
                onChangeText={setCheckOut}
              />
            </View>
          </View>

          <View style={styles.inputArea}>
            <Text>Room Price</Text>
            <TextInput
              placeholder="Room Price"
              style={styles.input}
              value={room_price}
              onChangeText={setRoomPrice}
            />
          </View>

          <View style={styles.inputArea}>
            <Text>Room Description</Text>
            <TextInput
              placeholder="Room Description"
              style={styles.input}
              value={room_description}
              onChangeText={setRoomDescription}
            />
          </View>

          {/* ✅ Room Photo */}
          <View style={styles.inputArea}>
            <Button
              icon="upload"
              mode="outlined"
              onPress={() => pickImage(setRoomPhoto)}
            >
              Upload Room Photo
            </Button>
          </View>

          {/* ✅ Room Bill */}
          <View style={styles.inputArea}>
            <Button
              icon="paperclip"
              mode="outlined"
              onPress={() => pickImage(setRoomBill)}
            >
              Upload Booking Evidence
            </Button>
          </View>

          {/* Display PromptPay (read-only) */}
          <View style={styles.inputArea}>
            <Text style={{color: "red"}}>*PromptPay Number</Text>
            <TextInput
              placeholder=""
              style={styles.input}
              value={promptPay}
              editable={false} // 🚨 read-only
            />
          </View>

          <View style={styles.inputArea}>
            <View style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
              <Button
                mode="contained"
                buttonColor="#1C5CB7"
                style={{ width: 200, borderRadius: 5 }}
                onPress={sendForm}
              >
                Submit
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: 359,
    padding: 10,
    height: 580,
    paddingBottom: 20,
  },
  formIn: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 17,
    paddingHorizontal: 20,
    gap: 10,
    paddingVertical: 20,
  },
  input: {
    borderColor: "#9d9d9db3",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputArea: {
    gap: 10,
    marginHorizontal: 10,
  },
  button: {
    width: 150,
  },
  dateinputArea: {
    gap: 10,
    marginHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputDate: {
    borderColor: "#9d9d9db3",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 12,
    width: 140,
  },
  h1: {
    fontSize: 20,
    fontWeight: "800",
  },
});

export default RoomForm;
