import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

// we will deal with buttons here

interface ControlProps {
  isRunning: boolean;
  handleLeftButtonPress: () => void;
  handleRightButtonPress: () => void;
}
function Control({
  isRunning,
  handleLeftButtonPress,
  handleRightButtonPress,
}: ControlProps) {
  return (
    <>
      <TouchableOpacity
        style={[styles.controlButtonBorder, { backgroundColor: "#333333" }]}
        onPress={handleLeftButtonPress}
      >
        <View style={styles.controlButton}>
          <Text style={{ color: "#fff" }}>Reset</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.controlButtonBorder,
          { backgroundColor: isRunning ? "#340e0d" : "#0a2a12" },
        ]}
        onPress={handleRightButtonPress}
      >
        <View style={styles.controlButton}>
          <Text style={{ color: isRunning ? "#ea4c49" : "#37d05c" }}>
            {isRunning ? "Stop" : "Start"}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  controlButtonBorder: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 70,
    borderRadius: 70,
  },
  controlButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 65,
    height: 65,
    borderRadius: 65,
    borderColor: "#000",
    borderWidth: 1,
  },
});
export default React.memo(Control);
