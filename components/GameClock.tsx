import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { displayTime } from "./TimerUtils";
import { Audio } from "expo-av";
import { colors } from "@/constants/theme";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

const buzzerSound = require("../assets/sounds/buzzer.wav");
const countDownSound = require("../assets/sounds/10-second-count-down.mp3");

interface TimerProps {
  isRunning: boolean;
  reset: boolean;
  isSoundOn: boolean;
}

const GameClock: React.FC<TimerProps> = ({ isRunning, reset, isSoundOn }) => {
  const [time, setTime] = useState<number>(600);
  const buzzerSoundRef = useRef<Audio.Sound | null>(null);
  const countDownSoundRef = useRef<Audio.Sound | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);

  const handleTimePress = () => {
    if (!isRunning) {
      setMinutes(Math.floor(time / 60));
      setSeconds(time % 60);
      setIsEditing(true);
    }
  };

  const handleSaveTime = () => {
    setTime(minutes * 60 + seconds);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    const loadSounds = async () => {
      const { sound: buzzer } = await Audio.Sound.createAsync(buzzerSound);
      buzzerSoundRef.current = buzzer;

      const { sound: countDown } = await Audio.Sound.createAsync(
        countDownSound
      );
      countDownSoundRef.current = countDown;
    };

    loadSounds();

    return () => {
      if (buzzerSoundRef.current) buzzerSoundRef.current.unloadAsync();
      if (countDownSoundRef.current) countDownSoundRef.current.unloadAsync();
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timer) {
      clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  useEffect(() => {
    setTime(600); // Reset auf 10 Minuten
  }, [reset]);

  useEffect(() => {
    if (!isSoundOn) return;

    if (time === 11 && countDownSoundRef.current) {
      countDownSoundRef.current.replayAsync();
    }

    if (time === 0 && buzzerSoundRef.current) {
      buzzerSoundRef.current.replayAsync();
    }
  }, [time, isSoundOn]);

  return (
    <View style={styles.display as ViewStyle}>
      <TouchableOpacity onPress={handleTimePress} disabled={isRunning}>
        <Text style={styles.displayText}>{displayTime(time)}</Text>
      </TouchableOpacity>

      <Modal visible={isEditing} animationType="slide">
        <ThemedView style={styles.modalContainer}>
          <ThemedText style={{ fontSize: 20 }}>Change Gameclock:</ThemedText>
          <View style={styles.inputFieldContainer}>
            <View style={styles.timeInput}>
              <ThemedText>Minutes: </ThemedText>
              <TextInput
                style={styles.input}
                placeholder={minutes.toString()}
                value={minutes.toString()}
                onChangeText={(text) =>
                  setMinutes(text != "" ? parseInt(text) : 0)
                }
              ></TextInput>
            </View>
            <View style={styles.timeInput}>
              <ThemedText>Seconds: </ThemedText>
              <TextInput
                style={styles.input}
                placeholder={seconds.toString()}
                value={
                  seconds < 10 ? "0" + seconds.toString() : seconds.toString()
                }
                onChangeText={(text) =>
                  setSeconds(text != "" ? parseInt(text) : 0)
                }
              ></TextInput>
            </View>
          </View>
          <View style={styles.inputFieldContainer}>
            <View style={styles.button}>
              <Button title="Save" onPress={handleSaveTime} />
            </View>
            <View style={styles.button}>
              <Button title="Cancel" onPress={handleCancelEdit} />
            </View>
          </View>
        </ThemedView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  display: {
    justifyContent: "center",
    alignItems: "center",
  },
  displayText: {
    color: "#fd7401",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 130,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "Digital7",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  inputFieldContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 16,
  },

  timeInput: {
    width: "45%",
  },
  input: {
    borderColor: colors.black,
    borderWidth: 1,
    textAlign: "center",
    fontSize: 32,
    color: "#fd7401",
  },
  button: {
    width: "45%",
    borderRadius: 20,
    overflow: "hidden",
  },
});

export default GameClock;
