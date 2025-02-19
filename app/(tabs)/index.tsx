import {
  ImageBackground,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import TimerController from "@/components/TimerController";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  const backgroundImage =
    colorScheme === "dark"
      ? require("../../assets/images/pexels-derice-jason-fahnkow-745824-2282497.jpg")
      : require("../../assets/images/pexels-didsss-2643276.jpg");

  return (
    <ThemedView style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        style={styles.image}
        resizeMode="stretch"
      >
        <TimerController />
      </ImageBackground>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
});
