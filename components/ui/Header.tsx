// components/ui/CustomHeader.tsx
import LogoTitle from "@/components/ui/LogoTitle";
import SearchFeature from "@/components/ui/SearchFeature";
import { colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  showSearch?: boolean;
};

export default function CustomHeader({ showSearch = true }: Props) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Left menu button */}
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        style={styles.left}
      >
        <FontAwesome name="bars" size={28} color={colors.textWhite} />
      </TouchableOpacity>

      {/* Center logo */}
      <LogoTitle color="white" size={30} fontSize={10} />

      {/* Right search */}
      {showSearch ? (
        <View style={styles.right}>
          <SearchFeature />
        </View>
      ) : (
        <View style={styles.right} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.primary, // ✅ fills gap with same color
  },
  container: {
    height: 100,
    width: "100%",
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  left: { width: 40 },
  right: { width: 40, alignItems: "flex-end" },
});
