import { Tabs } from 'expo-router';
import React from 'react';

import { AnimatedTabBar } from '@/components/animated-tab-bar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <AnimatedTabBar {...props} />}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
