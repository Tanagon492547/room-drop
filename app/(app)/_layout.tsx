import LogoTitle from "@/components/ui/LogoTitle";
import SearchFeature from "@/components/ui/SearchFeature";
import { useColorScheme } from '@/components/useColorScheme';
import { colors } from '@/constants/Colors';
import { useSession } from '@/hooks/useAuth';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
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
      <Stack
        screenOptions={{ // <-- ✨ เพิ่ม screenOptions ที่นี่
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          
          headerTitle: () => <LogoTitle color='white' size={30} fontSize={20} />,
          
          headerRight: () => <SearchFeature />,

        }}
      />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}


export default AppLayout;