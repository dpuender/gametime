import React, { useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  Image,
  Switch,
} from "react-native";
import { useSound } from "./SoundContext";
import { ThemedText } from "./ThemedText";

const Options = () => {
  const { isSoundOn, toggleSound } = useSound();

  return (
    <View style={styles.container}>
      <View style={styles.optionContainer}>
        <ThemedText>Sound: </ThemedText>
        <Switch value={isSoundOn} onValueChange={toggleSound} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  optionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default Options;
