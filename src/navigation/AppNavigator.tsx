import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

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
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: any;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Hydration") {
              iconName = "water";
            } else if (route.name === "Nutrition") {
              iconName = "restaurant";
            } else if (route.name === "Sleep") {
              iconName = "moon";
            } else if (route.name === "Habits") {
              iconName = "checkmark-circle";
            } else if (route.name === "Aurora AI") {
              iconName = "sparkles";
            } else if (route.name === "Profile") {
              iconName = "person";
            }

            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />
        

        <Tab.Screen
          name="Hydration"
          component={HydrationScreen}
        />

        <Tab.Screen
          name="Nutrition"
          component={NutritionScreen}
        />

        <Tab.Screen
          name="Sleep"
          component={SleepScreen}
        />

        <Tab.Screen
          name="Habits"
          component={HabitsScreen}
        />
        <Tab.Screen
          name="Aurora AI"
          component={AuroraAIScreen}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}