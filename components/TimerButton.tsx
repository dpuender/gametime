import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import { colors } from "@/constants/theme";

const TimerButton = ({
  style,
  onPress,
  children,
}: {
  style?: any;
  onPress: any;
  children: any;
}) => {
  const colorScheme = useColorScheme();

  const buttonBackground = colorScheme === "dark" ? colors.black : colors.white;
  const buttonBorder = colorScheme === "dark" ? colors.white : colors.black;

  return (
    <TouchableOpacity style={[styles.border, style]} onPress={onPress}>
      <View style={[styles.button, { borderColor: buttonBorder }]}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

export default TimerButton;

const styles = StyleSheet.create({
  border: {
    width: 100,
    borderRadius: 100,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 5,
  },
});
