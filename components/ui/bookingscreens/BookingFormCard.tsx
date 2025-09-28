// BookingFormCard.tsx
import { colors } from "@/constants/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

type props = {
  fname?: string;
  lname?: string;
  email?: string;
  phone_number?: string;
};

const BookingFormCard = ({ fname, lname, email, phone_number }: props) => {
  const params = useLocalSearchParams();
  const finalRoomId = useMemo(() => {
    const v = params.roomId;
    return Array.isArray(v) ? v[0] : v;
  }, [params]);

  const country = "ไทย"; // fixed and read-only

  const goPayment = () => {
    if (!finalRoomId) {
      console.error("No roomId; cannot navigate");
      return;
    }
    router.replace({
      pathname: "/(app)/(tabs)/paymentscreen/[roomId]",
      params: { roomId: finalRoomId },
    });
  };

  return (
    <View style={styles.card}>
      <View style={[styles.form, styles.shadow]}>
        <Text style={[styles.p, styles.b]}>ผู้เข้าพักหลัก</Text>

        <TextInput
          label="ชื่อ"
          mode="outlined"
          outlineStyle={{ borderRadius: 15, borderColor: colors.borderColor, backgroundColor: colors.background }}
          value={fname ?? ""}
          editable={false}
        />
        <TextInput
          label="นามสกุล"
          mode="outlined"
          outlineStyle={{ borderRadius: 15, borderColor: colors.borderColor, backgroundColor: colors.background }}
          value={lname ?? ""}
          editable={false}
        />
        <TextInput
          label="อีเมล์"
          mode="outlined"
          outlineStyle={{ borderRadius: 15, borderColor: colors.borderColor, backgroundColor: colors.background }}
          value={email ?? ""}
          editable={false}
        />
        <TextInput
          label="ประเทศ"
          mode="outlined"
          outlineStyle={{ borderRadius: 15, borderColor: colors.borderColor, backgroundColor: colors.background }}
          value={country}
          editable={false}
        />
        <TextInput
          label="หมายเลขโทรศัพท์"
          mode="outlined"
          outlineStyle={{ borderRadius: 15, borderColor: colors.borderColor, backgroundColor: colors.background }}
          value={phone_number ?? ""}
          editable={false}
        />
      </View>

      <Button
        mode="contained"
        buttonColor={colors.secondary}
        onPress={goPayment}
        style={styles.button}
      >
        ไปขั้นตอนสุดท้ายชำระเงิน
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { alignItems: "center" },
  form: {
    width: 364,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.background,
    padding: 20,
    gap: 10,
  },
  p: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.text,
    opacity: 1,
  },
  b: { fontWeight: "bold" },
  button: { margin: 20 },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
      },
      android: { elevation: 4 },
    }),
  },
});

export default BookingFormCard;
