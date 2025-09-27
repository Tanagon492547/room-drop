import { colors } from "@/constants/Colors";
import { StyleSheet, Text, View } from "react-native";
import DropImageCard from "../DropImageCard";

type props = {
  bedType?: string;
  roomDetail?: string;
  url?: string; // ✅ add
};

const RoomDetailCard = ({ bedType, roomDetail, url }: props) => {
  return (
    <View style={styles.card}>
      <View style={styles.imgCard}>
        <DropImageCard detailCard={true} width={382} height={117} url={url} />
        <Text style={styles.h1}>{bedType}</Text>
      </View>
      <View style={styles.detail}>
        <Text style={styles.h2}>รายละเอียด</Text>
        <Text style={styles.p}>{roomDetail}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { width: "100%", padding: 4, marginBlock: 9 },
  imgCard: { backgroundColor: "#D9D9D9", marginBlockEnd: 8, overflow:'hidden' },
  detail: { padding: 10, gap: 10 },
  h1: { fontSize: 23, fontWeight: "bold", padding: 20 },
  h2: { fontSize: 20, fontWeight: "bold", color: colors.textBlue },
  p: { fontSize: 15, color: colors.text, opacity: 0.9 },
});

export default RoomDetailCard;
