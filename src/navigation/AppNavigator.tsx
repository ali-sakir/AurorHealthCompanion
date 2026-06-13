import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/theme";

import HomeScreen from "../screens/HomeScreen";
import HydrationScreen from "../screens/HydrationScreen";
import NutritionScreen from "../screens/NutritionScreen";
import SleepScreen from "../screens/SleepScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HabitsScreen from "../screens/HabitsScreen";
import AuroraAIScreen from "../screens/AuroraAIScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, any> = {
            Home: "home",
            Hydration: "water",
            Nutrition: "restaurant",
            Sleep: "moon",
            Habits: "checkmark-circle",
            "Aurora AI": "sparkles",
            Profile: "person",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Hydration" component={HydrationScreen} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen name="Sleep" component={SleepScreen} />
      <Tab.Screen name="Habits" component={HabitsScreen} />
      <Tab.Screen name="Aurora AI" component={AuroraAIScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}