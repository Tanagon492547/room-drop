import LogoTitle from '@/components/ui/LogoTitle';
import SearchFeature from '@/components/ui/SearchFeature';
import { useColorScheme } from '@/components/useColorScheme';
import { colors } from '@/constants/Colors';
import { useSession } from '@/hooks/useAuth';
import { FontAwesome } from '@expo/vector-icons';
import { DefaultTheme, DrawerActions, ThemeProvider } from '@react-navigation/native';
import { Redirect, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';



const AppLayout = () => {
  const colorScheme = useColorScheme();
  const { session, isLoading } = useSession();
  const pathname = usePathname();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            drawerStyle: {}, //เปลี่ยนสีพืนหลัง
            headerStyle: {
              backgroundColor: colors.primary, // กำหนดสีพื้นหลัง Header ที่นี่
            },
            headerTintColor: colors.textWhite,
          }}  >
          <Drawer.Screen
            name="(tabs)"
            options={({ navigation }) => ({
              drawerLabel: 'Home',
              title: '',
              headerShown: pathname !== '/search',
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                  style={{ marginLeft: 15 }}
                >
                  <FontAwesome name="bars" size={30} color="white" />
                </TouchableOpacity>
              ),

              headerTitle: () => <LogoTitle color='white' size={30} fontSize={10} />,
              headerRight: () => <SearchFeature />,
              headerTitleAlign: 'center',
            })}
          />

        </Drawer>
      </GestureHandlerRootView>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}


export default AppLayout;