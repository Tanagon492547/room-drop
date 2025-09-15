import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable } from "react-native";

const SearchFeature = () => {
  return (
    <Link href='/(app)/(tabs)/search' asChild>
      <Pressable>
      {({ pressed }) => (
        <FontAwesome
          name="search"
          size={25}
          color="white"
          style={{ opacity: pressed ? 0.5 : 1 , marginRight:15}}
        />
      )}
    </Pressable></Link>
  )
}

export default SearchFeature;