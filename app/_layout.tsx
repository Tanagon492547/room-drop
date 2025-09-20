import { SessionProvider } from '@/hooks/useAuth';

import { Stack } from 'expo-router';
import 'react-native-reanimated';

//เป็นต้นกำเนิด root ทั้งหมด จะเเส้งทุกอย่าง
const Root = () => {

  return (
    //<SessionProvider>
    //  <Slot />
    //</SessionProvider>

    <SessionProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SessionProvider>
  );
}

export default Root;
