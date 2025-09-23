import { View } from '@/components/Themed';
import { colors } from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

type Props = {
  url?: string;
  dayCount?: number;
  roomId?: string;
  nameHotel?: string;
};

const FALLBACK = 'https://picsum.photos/seed/696/3000/2000';

const ImgCard = ({ url, dayCount, roomId, nameHotel }: Props) => {
  const goToDetail = () => {
    if (!roomId) {
      console.error('Missing roomId, cannot navigate');
      return;
    }

    // ✅ Route groups like (tabs) are ignored at runtime – use the route path only
    router.push({
      pathname: '/roomdetails/[roomId]',
      params: {
        roomId,
        nameHotel: nameHotel ?? '',
      },
    });
  };

  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        // expo-image accepts a string URL directly; keep your working logic
        source={url || FALLBACK}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />

      <Pressable
        onPress={goToDetail}
        style={({ hovered, pressed }) => [
          styles.eye,
          styles.shadow,
          hovered && styles.buttonHovered,
          pressed && styles.buttonPressed,
        ]}
      >
        <FontAwesome name="eye" size={25} color="#686868" />
      </Pressable>

      <View style={[styles.indicator, styles.shadow]}>
        <Text style={styles.h3}>พัก {dayCount ?? 0} วัน</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0553',
    borderRadius: 20,
    overflow:'hidden'
  },
  card: { width: '100%', height: '100%',flex: 1, backgroundColor: 'transparent', position: 'relative' },
  eye: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'white',
    width: 50,
    minHeight: 31.45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 20,
    borderTopEndRadius: 20,
    top: -2,
    left: -1,
  },
  indicator: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: colors.yellow,
    width: 90,
    minHeight: 31.45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 20,
    borderTopEndRadius: 20,
    top: 39,
    left: -1,
  },
  h1: {
    fontSize: 30,
    fontWeight: '700'
  },
  h2: {
    fontSize: 20,
    fontWeight: '800',
    paddingTop: 10
  },
  h3: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700'
  },
  p: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  p2: {
    fontSize: 12,
    fontWeight: '800',
  },
  shadow: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
      android: { elevation: 10 },
    }),
  },
  buttonPressed: { opacity: 0.8 },
  buttonHovered: { backgroundColor: '#6495ED' },
});

export default ImgCard;
