import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Colors, Typography, NavBar } from '@src/constants/theme';

const TabIcon = ({ focused }: { focused: boolean }) => (
  <View
    style={{
      width: 18,
      height: 18,
      borderRadius: 3,
      backgroundColor: focused ? '#ffffff' : '#333333',
    }}
  />
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle:         { backgroundColor: Colors.bgBase },
        headerTintColor:     Colors.textPrimary,
        headerTitleStyle:    { color: Colors.textPrimary, fontWeight: Typography.semibold },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: Colors.navBg,
          borderTopColor:  Colors.bgElevated,
          borderTopWidth:  1,
          height:          NavBar.height,
        },
        tabBarActiveTintColor:   Colors.navIconActive,
        tabBarInactiveTintColor: Colors.navIconIdle,
        tabBarLabelStyle: {
          fontSize:     Typography.caption,
          fontWeight:   Typography.medium,
          marginBottom: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Wardrobe',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved Outfits',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} />,
        }}
      />
    </Tabs>
  );
}
