// app/(app)/(tabs)/paymentscreen/[roomId].tsx
import PaymentCheckoutCard from "@/components/ui/payments/PaymentCheckoutCard";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

const PaymentScreen = () => {
  const params = useLocalSearchParams();
  const finalRoomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;

  return (
    <ScrollView>
      <View style={styles.wrap}>
        <PaymentCheckoutCard roomId={finalRoomId ?? ""} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrap: { width: "100%", alignItems: "center", paddingVertical: 16, gap: 12 },
});

export default PaymentScreen;
