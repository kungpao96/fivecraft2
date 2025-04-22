import React from "react";
import { Tabs } from "expo-router";
import { Hammer, BookOpen, Settings } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.subtext,
        tabBarStyle: {
          backgroundColor: Colors.light.card,
          borderTopColor: Colors.light.border,
        },
        headerStyle: {
          backgroundColor: Colors.light.card,
        },
        headerTitleStyle: {
          color: Colors.light.text,
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        headerShown: false, // Hide the default header, we'll use our custom BrandHeader
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Crafting",
          tabBarIcon: ({ color }) => <Hammer size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}