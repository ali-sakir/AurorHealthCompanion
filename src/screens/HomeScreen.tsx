import React, {
  useState,
  useCallback,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useFocusEffect,
} from "@react-navigation/native";

export default function HomeScreen({
  navigation,
}: any) {
  const [userName, setUserName] =
    useState("User");

  const [healthScore, setHealthScore] =
    useState(0);

  const [water, setWater] =
    useState(0);

  const [waterGoal, setWaterGoal] =
    useState(8);

  const [sleep, setSleep] =
    useState(0);

  const [sleepGoal, setSleepGoal] =
    useState(8);

  const [calories, setCalories] =
    useState(0);

  const [calorieGoal, setCalorieGoal] =
    useState(2000);

  const [completedHabits,
    setCompletedHabits] =
    useState(0);

  const [totalHabits,
    setTotalHabits] =
    useState(0);

  const [recommendation,
    setRecommendation] =
    useState("Keep up the great work!");

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour> 5 && hour< 12) {
    return "🌅 Good Morning";
  }

  if (hour> 12 && hour< 17) {
    return "☀️ Good Afternoon";
  }

  if (hour> 17 && hour< 20) {
    return "☀️ Good Evening";
  }

  return "🌙 Good Night";
};

  const loadDashboard =
    async () => {
      const profileData =
        await AsyncStorage.getItem(
          "profile"
        );

      const waterData =
        await AsyncStorage.getItem(
          "waterCount"
        );

      const sleepData =
        await AsyncStorage.getItem(
          "sleepHours"
        );

      const nutritionData =
        await AsyncStorage.getItem(
          "nutrition"
        );

      const habitsData =
        await AsyncStorage.getItem(
          "habits"
        );

      let localWaterGoal = 8;
      let localSleepGoal = 8;
      let localCalorieGoal = 2000;

      if (profileData) {
        const profile =
          JSON.parse(profileData);

        setUserName(
          profile.name ||
            "User"
        );

        localWaterGoal =
          Number(
            profile.waterGoal ||
              8
          );

        localSleepGoal =
          Number(
            profile.sleepGoal ||
              8
          );

        localCalorieGoal =
          Number(
            profile.calorieGoal ||
              2000
          );

        setWaterGoal(
          localWaterGoal
        );

        setSleepGoal(
          localSleepGoal
        );

        setCalorieGoal(
          localCalorieGoal
        );
      }

      const currentWater =
        Number(
          waterData || 0
        );

      const currentSleep =
        Number(
          sleepData || 0
        );

      setWater(
        currentWater
      );

      setSleep(
        currentSleep
      );

      let totalCalories = 0;

      if (nutritionData) {
        const nutrition =
          JSON.parse(
            nutritionData
          );

        totalCalories =
          Number(
            nutrition.breakfast ||
              0
          ) +
          Number(
            nutrition.lunch ||
              0
          ) +
          Number(
            nutrition.dinner ||
              0
          );

        setCalories(
          totalCalories
        );
      }

      let doneHabits = 0;
      let allHabits = 0;

      if (habitsData) {
        const habits =
          JSON.parse(
            habitsData
          );

        allHabits =
          habits.length;

        doneHabits =
          habits.filter(
            (h: any) =>
              h.completed
          ).length;

        setCompletedHabits(
          doneHabits
        );

        setTotalHabits(
          allHabits
        );
      }

      const hydrationScore =
        Math.min(
          (
            currentWater /
            localWaterGoal
          ) *
            100,
          100
        );

      const sleepScore =
        Math.min(
          (
            currentSleep /
            localSleepGoal
          ) *
            100,
          100
        );

      const nutritionScore =
        Math.min(
          (
            totalCalories /
            localCalorieGoal
          ) *
            100,
          100
        );

      const habitsScore =
        allHabits > 0
          ? (
              doneHabits /
              allHabits
            ) *
            100
          : 0;

      const overall =
        Math.round(
          (
            hydrationScore +
            sleepScore +
            nutritionScore +
            habitsScore
          ) / 4
        );

      setHealthScore(
        overall
      );

      if (
        currentWater <
        localWaterGoal
      ) {
        setRecommendation(
          `Drink ${
            localWaterGoal -
            currentWater
          } more glasses of water today.`
        );
      } else if (
        currentSleep <
        localSleepGoal
      ) {
        setRecommendation(
          `Try to sleep ${
            localSleepGoal -
            currentSleep
          } more hours today.`
        );
      } else {
        setRecommendation(
          "Excellent progress today!"
        );
      }
    };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={
        false
      }
    >
      <View style={styles.header}>
        <Text style={styles.logo}>
          👋
        </Text>

        {/* <Text style={styles.title}>
          Hello, {userName}
        </Text> */}

        <Text style={styles.greeting}>
  {getGreeting()}
</Text>

<Text style={styles.title}>
  {userName}
</Text>

        <Text
          style={styles.subtitle}
        >
          Aurora Health Companion
        </Text>
      </View>

      <View
        style={styles.scoreCard}
      >
        <Text
          style={styles.score}
        >
          {healthScore}
        </Text>

        <Text
          style={styles.scoreText}
        >
          Health Score
        </Text>
      </View>

      <View style={styles.aiCard}>
        <Text
          style={styles.aiTitle}
        >
          🤖 Aurora Recommendation
        </Text>

        <Text>
          {recommendation}
        </Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity
          style={[
            styles.statCard,
            {
              backgroundColor:
                "#DDF5FF",
            },
          ]}
          onPress={() =>
            navigation.navigate(
              "Hydration"
            )
          }
        >
          <Text>
            💧 Water
          </Text>

          <Text
            style={
              styles.statValue
            }
          >
            {water}/{waterGoal}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statCard,
            {
              backgroundColor:
                "#EAFBEA",
            },
          ]}
          onPress={() =>
            navigation.navigate(
              "Nutrition"
            )
          }
        >
          <Text>
            🍎 Calories
          </Text>

          <Text
            style={
              styles.statValue
            }
          >
            {calories}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statCard,
            {
              backgroundColor:
                "#EFE7FF",
            },
          ]}
          onPress={() =>
            navigation.navigate(
              "Sleep"
            )
          }
        >
          <Text>
            🌙 Sleep
          </Text>

          <Text
            style={
              styles.statValue
            }
          >
            {sleep}/{sleepGoal}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statCard,
            {
              backgroundColor:
                "#FFF4E5",
            },
          ]}
          onPress={() =>
            navigation.navigate(
              "Habits"
            )
          }
        >
          <Text>
            📋 Habits
          </Text>

          <Text
            style={
              styles.statValue
            }
          >
            {completedHabits}/
            {totalHabits}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({


  subtitle: {
  color: "#fff",
  textAlign: "center",
},

scoreCard: {
  margin: 20,
  backgroundColor: "#fff",
  borderRadius: 25,
  padding: 25,
  alignItems: "center",
},

score: {
  fontSize: 52,
  fontWeight: "bold",
  color: "#3B82F6",
},

scoreText: {
  fontSize: 18,
  color: "#666",
},

aiCard: {
  marginHorizontal: 20,
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 20,
  marginBottom: 20,
},

aiTitle: {
  fontWeight: "bold",
  fontSize: 18,
  marginBottom: 10,
},

grid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  paddingHorizontal: 20,
},

statCard: {
  width: "48%",
  borderRadius: 20,
  padding: 20,
  marginBottom: 15,
},

statValue: {
  fontSize: 24,
  fontWeight: "bold",
  marginTop: 10,
},

  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  header: {
    backgroundColor: "#3B82F6",
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    borderRadius:20,
    margin:20,
  },

  logo: {
    fontSize: 60,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  title: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
  },

  greeting: {
  color: "#fff",
  fontSize: 20,
  textAlign: "center",
  marginBottom: 8,
  fontWeight: "600",
},






});