import { SessionProvider } from '@/hooks/useAuth';
import { Slot } from 'expo-router';
import 'react-native-reanimated';


const Root = () => {

  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}

export default Root;
