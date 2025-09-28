import { Image, StyleSheet, View } from "react-native"; // or "expo-image" if you prefer

type Props = {
  urlImage: string | undefined;
  width: number;
  height: number;
};

const AvatarProfile = ({ urlImage, width, height }: Props) => {
  return (
    <View style={styles.cardBody}>
      <Image
        source={{
          uri:
            urlImage ||
            "https://as1.ftcdn.net/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
        }}
        style={[styles.avatar, { width, height, borderRadius: width / 2 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardBody: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  avatar: {
    backgroundColor: "#777777ff",
  },
});

export default AvatarProfile;
