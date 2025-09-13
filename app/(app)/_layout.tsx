import { useColorScheme } from '@/components/useColorScheme';
import { colors } from '@/constants/Colors';
import { useSession } from '@/hooks/useAuth';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';



const AppLayout =()=> {
  const colorScheme = useColorScheme();
  const { session, isLoading } = useSession();

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
            headerTintColor:colors.textWhite,
          }}  >
          <Drawer.Screen
            name="(tabs)"
            options={{
              drawerLabel: 'Home',
              title: 'overview',
            }}
          />
          <Drawer.Screen
            name="+not-found"
            options={{
              drawerItemStyle: { display: 'none' }, //ซ่อนหน้า +not-found ออกจากเมนู
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}


export default AppLayout;