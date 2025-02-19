import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Alert,
  useColorScheme,
} from "react-native";
import ShotClock from "./ShotClock";
import GameClock from "./GameClock";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useSound } from "./SoundContext";
import { Audio } from "expo-av";
import TimerButton from "./TimerButton";
import { colors } from "@/constants/theme";

const buzzerSound = require("../assets/sounds/buzzer.wav");

const TimerController: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const buzzerSoundRef = useRef<Audio.Sound | null>(null);
  const [soundBuzzer, setSoundBuzzer] = useState<boolean>(false);
  const [reset24, setReset24] = useState<boolean>(false);
  const [reset14, setReset14] = useState<boolean>(false);

  const colorScheme = useColorScheme();

  const buttonBackground = colorScheme === "dark" ? colors.black : colors.white;
  const buttonBorder = colorScheme === "dark" ? colors.white : colors.black;
  const iconColor = colorScheme === "dark" ? colors.white : colors.black;

  const timerBackgroundImage =
    colorScheme === "dark"
      ? require("../assets/images/1.png")
      : require("../assets/images/2.png");

  const createTwoButtonAlert = () =>
    Alert.alert("Reset Timers", "Are you sure you want to reset the timers?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Yes", onPress: () => resetTimers() },
    ]);

  useEffect(() => {
    const loadSounds = async () => {
      const { sound: buzzer } = await Audio.Sound.createAsync(buzzerSound);
      buzzerSoundRef.current = buzzer;
    };

    loadSounds();

    return () => {
      if (buzzerSoundRef.current) buzzerSoundRef.current.unloadAsync();
    };
  }, []);

  const toggleTimers = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimers = () => {
    setReset((prev) => !prev);
    setIsRunning(false);
  };

  const resetShotClock24 = () => {
    setReset24((prev) => !prev);
  };

  const resetShotClock14 = () => {
    setReset14((prev) => !prev);
  };

  const soundBuzzerHandler = () => {
    setSoundBuzzer(true);
  };

  const { isSoundOn } = useSound();

  useEffect(() => {
    if (!isSoundOn) return;
    if (soundBuzzer && buzzerSoundRef.current) {
      buzzerSoundRef.current.replayAsync();

      setSoundBuzzer(false);
    }
  }, [isSoundOn, soundBuzzer]);

  return (
    <View style={styles.container}>
      {/* Game and Shotclock*/}
      <View style={styles.timerContainer}>
        <ImageBackground
          source={timerBackgroundImage}
          resizeMode="cover"
          style={[styles.backgroundImage, { borderColor: buttonBorder }]}
        >
          <GameClock
            isRunning={isRunning}
            reset={reset}
            isSoundOn={isSoundOn}
          />
          <ShotClock
            isRunning={isRunning}
            reset={reset}
            reset24={reset24}
            reset14={reset14}
            isSoundOn={isSoundOn}
          />
        </ImageBackground>
      </View>

      {/* Control buttons */}
      <View style={styles.controlContainer}>
        {/* Play button */}
        <View style={styles.playContainer}>
          <TimerButton
            style={
              isRunning
                ? { backgroundColor: colors.primary, borderColor: buttonBorder }
                : {
                    backgroundColor: buttonBackground,
                    borderColor: buttonBorder,
                  }
            }
            onPress={toggleTimers}
          >
            <Text>
              {isRunning ? (
                <FontAwesome5 name="pause" size={32} color={iconColor} />
              ) : (
                <FontAwesome5 name="play" size={32} color={iconColor} />
              )}
            </Text>
          </TimerButton>
        </View>

        {/* Shotclockreset buttons */}
        <View style={styles.shotclockResetContainer}>
          <TimerButton
            style={{
              backgroundColor: buttonBackground,
              borderColor: "red",
            }}
            onPress={resetShotClock24}
          >
            <Text
              style={[
                styles.resetNumber,
                {
                  backgroundColor: buttonBackground,
                  color: buttonBorder,
                },
              ]}
            >
              24
            </Text>
          </TimerButton>

          <TimerButton
            style={{
              backgroundColor: buttonBackground,
              borderColor: buttonBorder,
            }}
            onPress={soundBuzzerHandler}
          >
            <FontAwesome5 size={32} name="bullhorn" color={iconColor} />
          </TimerButton>

          <TimerButton
            style={{
              backgroundColor: buttonBackground,
              borderColor: buttonBorder,
            }}
            onPress={resetShotClock14}
          >
            <Text
              style={[
                styles.resetNumber,
                {
                  backgroundColor: buttonBackground,
                  color: buttonBorder,
                },
              ]}
            >
              14
            </Text>
          </TimerButton>
        </View>

        {/* Reset button */}
        <View style={styles.resetContainer}>
          <TimerButton
            style={{
              backgroundColor: buttonBackground,
              borderColor: buttonBorder,
            }}
            onPress={createTwoButtonAlert}
          >
            <Text>
              <FontAwesome5 name="undo" size={32} color={iconColor} />
            </Text>
          </TimerButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  controlContainer: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  playContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 15,
  },
  shotclockResetContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 15,
  },
  resetContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    paddingBottom: 15,
    width: "100%",
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 5,
  },
  resetNumber: {
    fontSize: 32,
    fontWeight: "bold",
  },
});

export default TimerController;
