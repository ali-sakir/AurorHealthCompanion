import React, { useState, useRef, useEffect } from "react";
import * as Speech from "expo-speech";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

export default function AuroraAIScreen() {

  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Aurora. How can I help you today?",
      sender: "ai",
    },
  ]);

  useEffect(() => {
    Speech.speak(
      "Hello. I am Aurora, your health companion."
    );
  }, []);

  const speakResponse = (
    text: string
  ) => {
    Speech.speak(text, {
      language: "en-US",
      pitch: 1,
      rate: 1,
    });
  };

  const generateResponse = async (text: string): Promise<string> => {
    const lower = text.toLowerCase();
    const calorieMatch = lower.match(/(\d+)/);
    const sleepMatch = lower.match(/(\d+(\.\d+)?)/);



    const waterMatch =
      lower.match(/(\d+)\s*ml/);

    if (
      waterMatch &&
      lower.includes("water")
    ) {
      const ml = Number(
        waterMatch[1]
      );

      const glasses =
        Math.round(ml / 250);

      const current =
        await AsyncStorage.getItem(
          "waterCount"
        );

      const updated =
        Number(current || 0) +
        glasses;

      await AsyncStorage.setItem(
        "waterCount",
        updated.toString()
      );

      return `💧 Added ${ml}ml water (${glasses} glasses) to your hydration tracker.`;
    }


    if (
      sleepMatch &&
      (
        lower.includes("sleep") ||
        lower.includes("slept")
      )
    ) {
      const hours =
        Number(sleepMatch[1]);

      await AsyncStorage.setItem(
        "sleepHours",
        hours.toString()
      );

      const historyData =
        await AsyncStorage.getItem(
          "sleepHistory"
        );

      const history =
        historyData
          ? JSON.parse(historyData)
          : [];

      const updatedHistory = [
        ...history,
        hours,
      ].slice(-7);

      await AsyncStorage.setItem(
        "sleepHistory",
        JSON.stringify(
          updatedHistory
        )
      );

      return `🌙 Logged ${hours} hours of sleep successfully.`;
    }


    if (
      calorieMatch &&
      (
        lower.includes("breakfast") ||
        lower.includes("lunch") ||
        lower.includes("dinner")
      )
    ) {
      const calories = calorieMatch[1];

      const data = await AsyncStorage.getItem("nutrition");

      const nutrition = data
        ? JSON.parse(data)
        : {
          breakfast: "",
          lunch: "",
          dinner: "",
        };

      if (lower.includes("breakfast")) {
        nutrition.breakfast =
          (
            Number(
              nutrition.breakfast || 0
            ) +
            Number(calories)
          ).toString();
      }

      if (lower.includes("lunch")) {
        nutrition.lunch =
          (
            Number(
              nutrition.lunch || 0
            ) +
            Number(calories)
          ).toString();
      }


      if (lower.includes("dinner")) {
        nutrition.dinner =
          (
            Number(
              nutrition.dinner || 0
            ) +
            Number(calories)
          ).toString();
      }

      await AsyncStorage.setItem(
        "nutrition",
        JSON.stringify(nutrition)
      );

      return `🍎 Logged ${calories} calories successfully.`;
    }


    const createHabitMatch =
      lower.match(/add habit (.+)/);

    if (createHabitMatch) {
      const habitName =
        createHabitMatch[1].trim();

      const savedHabits =
        await AsyncStorage.getItem(
          "habits"
        );

      const habits = savedHabits
        ? JSON.parse(savedHabits)
        : [];

      habits.push({
        id: Date.now(),
        name: habitName,
        completed: false,
      });

      await AsyncStorage.setItem(
        "habits",
        JSON.stringify(habits)
      );

      return `📋 Added habit: ${habitName}`;
    }

    const completeHabitMatch =
      lower.match(/complete habit (.+)/);

    if (completeHabitMatch) {
      const habitName =
        completeHabitMatch[1]
          .trim()
          .toLowerCase();

      const savedHabits =
        await AsyncStorage.getItem(
          "habits"
        );

      if (!savedHabits) {
        return "📋 No habits found.";
      }

      const habits =
        JSON.parse(savedHabits);

      const updatedHabits =
        habits.map((habit: any) =>
          habit.name
            .toLowerCase()
            .includes(habitName)
            ? {
              ...habit,
              completed: true,
            }
            : habit
        );

      await AsyncStorage.setItem(
        "habits",
        JSON.stringify(
          updatedHabits
        )
      );

      return `✅ Habit completed: ${habitName}`;
    }



    //     if (
    //       lower.includes("health advice") ||
    //       lower.includes("give me advice") ||
    //       lower.includes("health report") ||
    //       lower.includes("health summary")
    //     ) {
    //       const profileData =
    //         await AsyncStorage.getItem(
    //           "profile"
    //         );

    //       const waterData =
    //         await AsyncStorage.getItem(
    //           "waterCount"
    //         );

    //       const sleepData =
    //         await AsyncStorage.getItem(
    //           "sleepHours"
    //         );

    //       const nutritionData =
    //         await AsyncStorage.getItem(
    //           "nutrition"
    //         );

    //       const habitsData =
    //         await AsyncStorage.getItem(
    //           "habits"
    //         );

    //       let name = "User";
    //       let bmi = "0";
    //       let waterGoal = 8;
    //       let sleepGoal = 8;
    //       let calorieGoal = 2000;

    //       if (profileData) {
    //         const profile =
    //           JSON.parse(profileData);

    //         name =
    //           profile.name || "User";

    //         waterGoal =
    //           Number(
    //             profile.waterGoal || 8
    //           );

    //         sleepGoal =
    //           Number(
    //             profile.sleepGoal || 8
    //           );

    //         calorieGoal =
    //           Number(
    //             profile.calorieGoal ||
    //             2000
    //           );

    //         if (
    //           profile.height &&
    //           profile.weight
    //         ) {
    //           bmi = (
    //             Number(profile.weight) /
    //             Math.pow(
    //               Number(profile.height) /
    //               100,
    //               2
    //             )
    //           ).toFixed(1);
    //         }
    //       }

    //       const water =
    //         Number(waterData || 0);

    //       const sleep =
    //         Number(sleepData || 0);

    //       let calories = 0;

    //       if (nutritionData) {
    //         const nutrition =
    //           JSON.parse(
    //             nutritionData
    //           );

    //         calories =
    //           Number(
    //             nutrition.breakfast ||
    //             0
    //           ) +
    //           Number(
    //             nutrition.lunch || 0
    //           ) +
    //           Number(
    //             nutrition.dinner || 0
    //           );
    //       }

    //       let completedHabits = 0;
    //       let totalHabits = 0;

    //       if (habitsData) {
    //         const habits =
    //           JSON.parse(habitsData);

    //         totalHabits =
    //           habits.length;

    //         completedHabits =
    //           habits.filter(
    //             (h: any) =>
    //               h.completed
    //           ).length;
    //       }

    //       let advice =
    //         "Keep up the great work!";

    //       if (water < waterGoal) {
    //         advice =
    //           `Drink ${waterGoal - water
    //           } more glasses of water today.`;
    //       } else if (
    //         sleep < sleepGoal
    //       ) {
    //         advice =
    //           `Try to get ${sleepGoal - sleep
    //           } more hours of sleep.`;
    //       } else if (
    //         calories <
    //         calorieGoal
    //       ) {
    //         advice =
    //           `You still need ${calorieGoal -
    //           calories
    //           } calories to reach your daily goal.`;
    //       }

    //       return `
    // 👋 ${name}

    // 📊 Today's Health Summary

    // 💧 Water:
    // ${water}/${waterGoal} glasses

    // 🍎 Calories:
    // ${calories}/${calorieGoal} kcal

    // 🌙 Sleep:
    // ${sleep}/${sleepGoal} hours

    // 📋 Habits:
    // ${completedHabits}/${totalHabits} completed

    // ⚖️ BMI:
    // ${bmi}

    // 💡 Recommendation:
    // ${advice}
    // `;
    //     }


    if (
      lower.includes("health advice") ||
      lower.includes("give me advice") ||
      lower.includes("health report") ||
      lower.includes("health summary")
    ) {
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

      let name = "User";
      let bmi = "0";
      let waterGoal = 8;
      let sleepGoal = 8;
      let calorieGoal = 2000;

      if (profileData) {
        const profile =
          JSON.parse(profileData);

        name =
          profile.name || "User";

        waterGoal =
          Number(
            profile.waterGoal || 8
          );

        sleepGoal =
          Number(
            profile.sleepGoal || 8
          );

        calorieGoal =
          Number(
            profile.calorieGoal ||
            2000
          );

        if (
          profile.height &&
          profile.weight
        ) {
          bmi = (
            Number(profile.weight) /
            Math.pow(
              Number(profile.height) /
              100,
              2
            )
          ).toFixed(1);
        }
      }

      const water =
        Number(waterData || 0);

      const sleep =
        Number(sleepData || 0);

      let calories = 0;

      if (nutritionData) {
        const nutrition =
          JSON.parse(
            nutritionData
          );

        calories =
          Number(
            nutrition.breakfast ||
            0
          ) +
          Number(
            nutrition.lunch || 0
          ) +
          Number(
            nutrition.dinner || 0
          );
      }

      let completedHabits = 0;
      let totalHabits = 0;

      if (habitsData) {
        const habits =
          JSON.parse(habitsData);

        totalHabits =
          habits.length;

        completedHabits =
          habits.filter(
            (h: any) =>
              h.completed
          ).length;
      }

      let advice =
        "Keep up the great work!";

      if (water < waterGoal) {
        advice =
          `Drink ${waterGoal - water
          } more glasses of water today.`;
      } else if (
        sleep < sleepGoal
      ) {
        advice =
          `Try to get ${sleepGoal - sleep
          } more hours of sleep.`;
      } else if (
        calories <
        calorieGoal
      ) {
        advice =
          `You still need ${calorieGoal -
          calories
          } calories to reach your daily goal.`;
      }

      const hydrationScore = Math.min(
        Math.round((water / waterGoal) * 100),
        100
      );

      const sleepScore = Math.min(
        Math.round((sleep / sleepGoal) * 100),
        100
      );

      const nutritionScore = Math.min(
        Math.round(
          (calories / calorieGoal) * 100
        ),
        100
      );

      const habitsScore =
        totalHabits > 0
          ? Math.round(
            (completedHabits /
              totalHabits) *
            100
          )
          : 0;

      const overallHealthScore =
        Math.round(
          (
            hydrationScore +
            sleepScore +
            nutritionScore +
            habitsScore
          ) / 4
        );

      let healthRating = "";

      if (overallHealthScore >= 90) {
        healthRating = "🏆 Excellent";
      } else if (
        overallHealthScore >= 75
      ) {
        healthRating = "💪 Very Good";
      } else if (
        overallHealthScore >= 60
      ) {
        healthRating = "🙂 Good";
      } else if (
        overallHealthScore >= 40
      ) {
        healthRating = "⚠️ Needs Improvement";
      } else {
        healthRating = "🚨 Poor";
      }

      const healthBar =
        "🟩".repeat(
          Math.floor(
            overallHealthScore / 10
          )
        ) +
        "⬜".repeat(
          10 -
          Math.floor(
            overallHealthScore / 10
          )
        );

      return `
👋 ${name}

🏆 Health Score:
${overallHealthScore}/100
${healthBar}


${healthRating}

📊 Today's Health Summary

💧 Hydration:
${water}/${waterGoal} glasses
(${hydrationScore}%)

🍎 Nutrition:
${calories}/${calorieGoal} kcal
(${nutritionScore}%)

🌙 Sleep:
${sleep}/${sleepGoal} hours
(${sleepScore}%)

📋 Habits:
${completedHabits}/${totalHabits}
(${habitsScore}%)

⚖️ BMI:
${bmi}

💡 Recommendation:
${advice}
`;
    }

    return "🤖 I'm Aurora. I can help track hydration, sleep, nutrition and habits.";
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    //const aiResponse = await generateResponse(input);
    const aiResponse =
      await generateResponse(input);

    speakResponse(aiResponse);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      sender: "ai",
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      aiMessage,
    ]);

    setInput("");
  };



  const renderItem = ({
    item,
  }: {
    item: Message;
  }) => (
    <View
      style={[
        styles.message,
        item.sender === "user"
          ? styles.userMessage
          : styles.aiMessage,
      ]}
    >
      <Text
        style={
          item.sender === "user"
            ? styles.userText
            : styles.aiText
        }
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
        keyboardVerticalOffset={90}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              🤖 Aurora AI
            </Text>

            <Text
              style={styles.subtitle}
            >
              Your Personal Health Companion
            </Text>
          </View>


          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>💧 Water</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>🌙 Sleep</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>🍎 Nutrition</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.chip}>
              <Text style={styles.chipText}>📋 Habits</Text>
            </TouchableOpacity>
          </View>



          <FlatList
            style={{ flex: 1 }}
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              padding: 15,
              paddingBottom: 20,
            }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd()
            }
          />

          <View style={styles.inputContainer}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask Aurora..."
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.voiceBtn}
              onPress={() =>
                Speech.speak(
                  "Hello, I am Aurora. Voice mode is ready."
                )
              }
            >
              <MaterialCommunityIcons
                name="microphone"
                size={30}
                color="#fff"
                style={styles.icon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sendBtn}
              onPress={sendMessage}
            >
              <Text style={styles.icon}>
                ➤
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      "#F3F4F6",
  },

  header: {
    backgroundColor:
      "#8B5CF6",
    padding: 25,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#EDE9FE",
    marginTop: 5,
  },

  message: {
    padding: 15,
    borderRadius: 18,
    marginBottom: 12,
    maxWidth: "80%",
  },

  userMessage: {
    alignSelf: "flex-end",
    backgroundColor:
      "#2563EB",
  },

  aiMessage: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  userText: {
    color: "#fff",
  },

  aiText: {
    color: "#111",
  },

  inputRow: {
    flexDirection: "row",
    padding: 15,
    backgroundColor:
      "#fff",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor:
      "#E5E7EB",
    borderRadius: 15,
    paddingHorizontal: 15,
  },

  sendBtn: {
    backgroundColor:
      "#8B5CF6",
    marginLeft: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 15,
  },

  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },

  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    marginTop: 10,
  },

  chip: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  chipText: {
    fontWeight: "600",
    color: "#4F46E5",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
  },

  voiceBtn: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    marginHorizontal: 8,
  },

  icon: {
    fontSize: 18,
  },
});
import { MaterialCommunityIcons } from '@expo/vector-icons';
