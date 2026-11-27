import React from 'react';
import { Tabs } from 'expo-router';
import { Activity, BrainCircuit, ChartNoAxesCombined, House, UserRound } from 'lucide-react-native';
import { colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.purple,
      tabBarInactiveTintColor: colors.muted,
      tabBarStyle: {
        backgroundColor: '#101017', borderTopColor: colors.border, borderTopWidth: 1,
        height: 58 + Math.max(insets.bottom, 12), paddingTop: 8, paddingBottom: Math.max(insets.bottom, 12),
      },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 3 },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <House color={color} size={size} /> }} />
      <Tabs.Screen name="training" options={{ title: 'Training', tabBarIcon: ({ color, size }) => <Activity color={color} size={size} /> }} />
      <Tabs.Screen name="coach" options={{ title: 'AI Coach', tabBarIcon: ({ color, size }) => <BrainCircuit color={color} size={size} /> }} />
      <Tabs.Screen name="analytics" options={{ title: 'Analytics', tabBarIcon: ({ color, size }) => <ChartNoAxesCombined color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} /> }} />
    </Tabs>
  );
}
