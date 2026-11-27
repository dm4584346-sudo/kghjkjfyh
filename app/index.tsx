import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getProfile } from '@/db/repository';
import { colors } from '@/constants/theme';

export default function IndexRoute() {
  const db = useSQLiteContext();
  const router = useRouter();
  useEffect(() => {
    let mounted = true;
    getProfile(db).then((profile) => {
      if (!mounted) return;
      router.replace(profile ? '/(tabs)' as never : '/onboarding' as never);
    }).catch(() => {
      if (mounted) router.replace('/onboarding' as never);
    });
    return () => { mounted = false; };
  }, [db, router]);
  return <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.purple} /></View>;
}
