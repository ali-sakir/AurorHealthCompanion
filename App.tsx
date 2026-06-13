import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] =
    useState<boolean | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token =
        await AsyncStorage.getItem(
          "token"
        );

      setIsLoggedIn(!!token);
    } catch (error) {
      console.log(error);
      setIsLoggedIn(false);
    }
  };

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <AppNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>

    //   <NavigationContainer>
      
    //     <AuthNavigator />
     
    // </NavigationContainer>
  );
}