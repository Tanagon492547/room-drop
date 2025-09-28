import { View } from "@/components/Themed";
import { colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, FlatList, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Divider, List, Modal, Portal, TextInput } from "react-native-paper";
import { searchRoomsFirebase } from './searchRooms';

const STORAGE_KEY = 'searchForm:v1';

const format = (d?: Date | null) => {
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const today = startOfDay(new Date());

// ====== ข้อมูลจังหวัด + เมืองดัง ======
const PROVINCES_TH = [
  "กรุงเทพมหานคร","กระบี่","กาฬสินธุ์","กำแพงเพชร","ขอนแก่น","จันทบุรี","ฉะเชิงเทรา","ชลบุรี","ชัยนาท",
  "ชัยภูมิ","ชุมพร","เชียงราย","เชียงใหม่","ตรัง","ตราด","ตาก","นครนายก","นครปฐม","นครพนม","นครราชสีมา",
  "นครศรีธรรมราช","นครสวรรค์","นนทบุรี","นราธิวาส","น่าน","บึงกาฬ","บุรีรัมย์","ปทุมธานี","ประจวบคีรีขันธ์",
  "ปราจีนบุรี","ปัตตานี","พระนครศรีอยุธยา","พังงา","พัทลุง","พิจิตร","พิษณุโลก","เพชรบุรี","เพชรบูรณ์",
  "แพร่","พะเยา","ภูเก็ต","มหาสารคาม","มุกดาหาร","แม่ฮ่องสอน","ยโสธร","ยะลา","ร้อยเอ็ด","ระนอง","ระยอง",
  "ราชบุรี","ลพบุรี","ลำปาง","ลำพูน","เลย","ศรีสะเกษ","สกลนคร","สงขลา","สตูล","สมุทรปราการ","สมุทรสงคราม",
  "สมุทรสาคร","สระแก้ว","สระบุรี","สิงห์บุรี","สุโขทัย","สุพรรณบุรี","สุราษฎร์ธานี","สุรินทร์","หนองคาย",
  "หนองบัวลำภู","อ่างทอง","อำนาจเจริญ","อุดรธานี","อุตรดิตถ์","อุทัยธานี","อุบลราชธานี","นครปฐม" // (ถ้าซ้ำตัดออกได้)
].filter((v, i, a) => a.indexOf(v) === i);

const FAMOUS_CITIES = [
  { label: "กรุงเทพฯ (Bangkok), กรุงเทพมหานคร" },
  { label: "เชียงใหม่, เชียงใหม่" },
  { label: "เชียงราย, เชียงราย" },
  { label: "ภูเก็ต, ภูเก็ต" },
  { label: "กระบี่, กระบี่" },
  { label: "พัทยา, ชลบุรี" },
  { label: "หัวหิน, ประจวบคีรีขันธ์" },
  { label: "อยุธยา, พระนครศรีอยุธยา" },
  { label: "กาญจนบุรี, กาญจนบุรี" },
  { label: "โคราช (นครราชสีมา), นครราชสีมา" },
  { label: "เกาะสมุย, สุราษฎร์ธานี" },
  { label: "เกาะพะงัน, สุราษฎร์ธานี" },
  { label: "ตรัง, ตรัง" },
  { label: "ขอนแก่น, ขอนแก่น" },
  { label: "อุบลราชธานี, อุบลราชธานี" },
  { label: "นครศรีธรรมราช, นครศรีธรรมราช" },
  { label: "หาดใหญ่, สงขลา" },
  { label: "สุโขทัย, สุโขทัย" },
  { label: "ตราด (เกาะช้าง), ตราด" },
  { label: "แม่ฮ่องสอน, แม่ฮ่องสอน" },
  { label: "น่าน, น่าน" },
];

const OPTIONS = [
  // เมืองดัง
  ...FAMOUS_CITIES.map(o => ({ type: "city", value: o.label, label: o.label })),
  // จังหวัด
  ...PROVINCES_TH.map(p => ({ type: "province", value: p, label: p })),
];

// helper: รับเฉพาะตัวเลข
const onlyDigits = (s: string) => s.replace(/[^\d]/g, "");

const FormCard = () => {
  const router = useRouter();
  const [text, setText] = useState(""); // Location (เลือกจากรายการ)
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);

  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);

  // ====== Modal เลือก Location ======
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");

  // โหลดค่าที่เคยเซฟ
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        setText(data.text ?? '');
        setPriceMin(data.priceMin ?? '');
        setPriceMax(data.priceMax ?? '');
        setCheckInDate(data.checkIn ? new Date(data.checkIn) : null);
        setCheckOutDate(data.checkOut ? new Date(data.checkOut) : null);
      } catch (e) {
        console.warn('Failed to load saved form', e);
      }
    })();
  }, []);

  // เซฟอัตโนมัติ (debounce)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const save = (payload: any) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        console.warn('Failed to save form', e);
      }
    }, 250);
  };

  useEffect(() => {
    save({
      text,
      priceMin,
      priceMax,
      checkIn: checkInDate ? checkInDate.toISOString() : null,
      checkOut: checkOutDate ? checkOutDate.toISOString() : null,
    });
  }, [text, priceMin, priceMax, checkInDate, checkOutDate]);

  const minCheckout = useMemo(
    () => (checkInDate ? startOfDay(checkInDate) : today),
    [checkInDate]
  );

  const onChangeCheckIn = (_: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowCheckIn(false);
    if (selected) {
      const picked = startOfDay(selected);
      setCheckInDate(picked);
      if (checkOutDate && startOfDay(checkOutDate) < picked) {
        setCheckOutDate(null);
      }
    }
  };

  const onChangeCheckOut = (_: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowCheckOut(false);
    if (selected) {
      const picked = startOfDay(selected);
      setCheckOutDate(picked);
    }
  };

  const onSubmit = async () => {
    const min = priceMin ? parseInt(priceMin, 10) : undefined;
    const max = priceMax ? parseInt(priceMax, 10) : undefined;

    if ((min !== undefined && isNaN(min)) || (max !== undefined && isNaN(max))) {
      Alert.alert("Invalid price", "Please enter numbers only.");
      return;
    }
    if (min !== undefined && max !== undefined && min > max) {
      Alert.alert("Price range error", "Minimum price should be less than or equal to maximum price.");
      return;
    }
    const payload = {
      text,
      priceMin,
      priceMax,
      checkIn: checkInDate ? checkInDate.toISOString() : null,
      checkOut: checkOutDate ? checkOutDate.toISOString() : null,
      updatedAt: Date.now(),
    };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save form', e);
    }

    await onSearch();

    console.log({
      location: text,
      checkIn: checkInDate?.toISOString(),
      checkOut: checkOutDate?.toISOString(),
      priceMin: min,
      priceMax: max,
    });
    router.navigate('/');
  };

  async function onSearch() {
    console.log('Searching rooms...');
    const res = await searchRoomsFirebase({
      location: text || undefined,
      checkIn: checkInDate!,    // สมมติ validate มาแล้วว่ามีค่า
      checkOut: checkOutDate!,
      minPrice: priceMin ? Number(priceMin) : undefined,
      maxPrice: priceMax ? Number(priceMax) : undefined,
      pageSize: 20
    });
    console.log('found rooms', res.rooms.length, res.rooms);
    // เก็บ res.last ไว้เป็น cursor ถ้าจะกด "โหลดเพิ่ม"
  }


  // กรองตัวเลือกจาก query
  const filteredOptions = useMemo(() => {
    const q = locationQuery.trim().toLowerCase();
    if (!q) return OPTIONS;
    return OPTIONS.filter(o => o.label.toLowerCase().includes(q));
  }, [locationQuery]);

  return (
    <View style={styles.inputArea}>
      {/* Location with choices */}
      <View style={styles.inputBox}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => setShowLocationModal(true)}>
          <TextInput
            label="Choose Location..."
            placeholder="จังหวัด หรือ เมือง, จังหวัด"
            value={text}
            mode="outlined"
            outlineStyle={{ borderRadius: 50 }}
            style={{ paddingHorizontal: 25 }}
            editable={false}
            right={
              <TextInput.Icon
                icon={text ? "chevron-down" : "magnify"}
                onPress={() => setShowLocationModal(true)}
              />
            }
          />
        </TouchableOpacity>
      </View>

      {/* ===== Modal เลือก Location ===== */}
      <Portal>
        <Modal
          visible={showLocationModal}
          onDismiss={() => setShowLocationModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <TextInput
            mode="outlined"
            label="ค้นหา (พิมพ์ชื่อจังหวัด/เมือง)"
            value={locationQuery}
            onChangeText={setLocationQuery}
            style={{ marginBottom: 8 }}
            left={<TextInput.Icon icon="magnify" />}
            right={
              locationQuery ? <TextInput.Icon icon="close" onPress={() => setLocationQuery("")} /> : null
            }
          />
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={filteredOptions}
            keyExtractor={(item, idx) => `${item.type}-${item.value}-${idx}`}
            ItemSeparatorComponent={Divider}
            renderItem={({ item }) => (
              <List.Item
                title={item.label}
                left={() => <List.Icon icon={item.type === "city" ? "map-marker" : "map"} />}
                onPress={() => {
                  setText(item.label);
                  setShowLocationModal(false);
                }}
              />
            )}
            style={{ maxHeight: 380 }}
          />
          <Button mode="text" onPress={() => setShowLocationModal(false)} style={{ marginTop: 6 }}>
            ปิด
          </Button>
        </Modal>
      </Portal>

      {/* Dates */}
      <View style={styles.datesArea}>
        {/* Check-In */}
        <View style={styles.dateinputArea}>
          <FontAwesome
            name="calendar-check-o"
            size={25}
            color="#6C6C6C"
            style={{ position: "absolute", zIndex: 1, paddingLeft: 15 }}
            pointerEvents="none"
          />
          <TouchableOpacity activeOpacity={0.85} onPress={() => setShowCheckIn(true)}>
            <TextInput
              label="Check-In"
              placeholder="DD/MM/YY"
              value={format(checkInDate)}
              mode="outlined"
              outlineStyle={{ borderRadius: 50 }}
              style={{ paddingHorizontal: 30 }}
              editable={false}
            />
          </TouchableOpacity>

          {showCheckIn && (
            <DateTimePicker
              value={checkInDate ?? today}
              mode="date"
              accentColor="#314071"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onChangeCheckIn}
              minimumDate={today}
            />
          )}
        </View>

        {/* Check-Out */}
        <View style={styles.dateinputArea}>
          <FontAwesome
            name="calendar-times-o"
            size={25}
            color="#6C6C6C"
            style={{ position: "absolute", zIndex: 1, paddingLeft: 15 }}
            pointerEvents="none"
          />
          <TouchableOpacity activeOpacity={0.85} onPress={() => setShowCheckOut(true)}>
            <TextInput
              label="Check-out"
              placeholder="DD/MM/YY"
              value={format(checkOutDate)}
              mode="outlined"
              outlineStyle={{ borderRadius: 50 }}
              style={{ paddingHorizontal: 30 }}
              editable={false}
            />
          </TouchableOpacity>

          {showCheckOut && (
            <DateTimePicker
              value={checkOutDate ?? minCheckout}
              mode="date"
              accentColor="#314071"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={onChangeCheckOut}
              minimumDate={minCheckout}
            />
          )}
        </View>
      </View>

      {/* Price Range */}
      <View style={styles.priceRow}>
        <View style={styles.priceInputBox}>
          <TextInput
            label="Min price (Baht)"
            placeholder="e.g. 1000"
            value={priceMin}
            mode="outlined"
            outlineStyle={{ borderRadius: 50 }}
            keyboardType="numeric"
            onChangeText={(v) => setPriceMin(onlyDigits(v))}
            right={priceMin ? <TextInput.Icon icon="close" onPress={() => setPriceMin("")} /> : null}
          />
        </View>
        <View style={styles.priceInputBox}>
          <TextInput
            label="Max price (Baht)"
            placeholder="e.g. 5000"
            value={priceMax}
            mode="outlined"
            outlineStyle={{ borderRadius: 50 }}
            keyboardType="numeric"
            onChangeText={(v) => setPriceMax(onlyDigits(v))}
            right={priceMax ? <TextInput.Icon icon="close" onPress={() => setPriceMax("")} /> : null}
          />
        </View>
      </View>

      <Button style={styles.button} mode="contained" onPress={onSubmit}>
        Search
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  inputArea: {
    width: 360,
    borderRadius: 10,
    minHeight: 314,
    backgroundColor: colors.background,
    marginTop: 50,
    paddingTop: 30,
    display: "flex",
    alignItems: "center",
    gap: 15,
  },
  inputBox: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    width: "90%",
    backgroundColor: "transparent",
  },
  datesArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: "5%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  dateinputArea: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    width: "48%",
    backgroundColor: "transparent",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: "5%",
    alignItems: "center",
    gap: 12,
  },
  priceInputBox: { width: "48%" },
  button: { width: "90%", marginTop: 10 },

  // Modal
  modalContainer: {
    backgroundColor: "white",
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
  },
});

export default FormCard;
