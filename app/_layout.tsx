import 'react-native-gesture-handler';
import React from 'react';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { initializeDatabase } from '@/db/schema';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="dota-pro-lab.db" onInit={initializeDatabase}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="training/situations" />
        <Stack.Screen name="training/item-builder" />
        <Stack.Screen name="training/draft-trainer" />
        <Stack.Screen name="training/dashboard" />
        <Stack.Screen name="analytics/pro" />
      </Stack>
    </SQLiteProvider>
  );
}
