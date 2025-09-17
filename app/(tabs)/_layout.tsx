import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

function TabBarIcon({ name, color }: { name: string; color: string }) {
  return (
    <FontAwesome
      size={28}
      style={{ marginBottom: -3 }}
      name={name as any}
      color={color}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="cart-plus" color={color} />,
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="suitcase" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      //<Tabs.Screen
        name="search"
        options={{
          href:null
        }}
/>
    </Tabs>
  );
}

