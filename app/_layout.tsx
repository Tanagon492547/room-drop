import { SessionProvider } from '@/hooks/useAuth';
import { Slot } from 'expo-router';
import 'react-native-reanimated';

//เป็นต้นกำเนิด root ทั้งหมด จะเเส้งทุกอย่าง
const Root = () => {

  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}

export default Root;
