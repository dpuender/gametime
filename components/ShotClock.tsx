import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  TouchableOpacity,
  Button,
  Modal,
  TextInput,
} from "react-native";
import { displayShotClock, displayTime } from "./TimerUtils";
import { Audio } from "expo-av";
import { colors } from "@/constants/theme";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

const beepSound = require("../assets/sounds/beep.mp3");
const buzzerSound = require("../assets/sounds/buzzer.wav");

interface TimerProps {
  isRunning: boolean;
  reset: boolean;
  reset24: boolean;
  reset14: boolean;
  isSoundOn: boolean;
}

const ShotClock: React.FC<TimerProps> = ({
  isRunning,
  reset,
  reset24,
  reset14,
  isSoundOn,
}) => {
  const [time, setTime] = useState<number>(24);

  const beepSoundRef = useRef<Audio.Sound | null>(null);
  const buzzerSoundRef = useRef<Audio.Sound | null>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const minutesOrig = Math.floor(time / 60);
  const secondsOrig = time % 60;

  const [minutes, setMinutes] = useState(minutesOrig);
  const [seconds, setSeconds] = useState(secondsOrig);

  const handleTimePress = () => {
    if (!isRunning) {
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
      const { sound: beep } = await Audio.Sound.createAsync(beepSound);
      beepSoundRef.current = beep;

      const { sound: buzzer } = await Audio.Sound.createAsync(buzzerSound);
      buzzerSoundRef.current = buzzer;
    };

    loadSounds();

    return () => {
      if (beepSoundRef.current) beepSoundRef.current.unloadAsync();
      if (buzzerSoundRef.current) buzzerSoundRef.current.unloadAsync();
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
    setTime(14); // Reset auf 14 Sekunden
  }, [reset14]);

  useEffect(() => {
    setTime(24); // Reset auf 24 Sekunden
  }, [reset, reset24]);

  useEffect(() => {
    if (!isSoundOn) return;

    if ([5, 4, 3, 2, 1].includes(time) && beepSoundRef.current) {
      beepSoundRef.current.replayAsync();
    }

    if (time === 0 && buzzerSoundRef.current) {
      buzzerSoundRef.current.replayAsync();
    }
  }, [time, isSoundOn]);

  return (
    <View style={styles.display as ViewStyle}>
      <TouchableOpacity onPress={handleTimePress} disabled={isRunning}>
        <Text style={styles.displayText as TextStyle}>
          {displayShotClock(time)}
        </Text>
      </TouchableOpacity>

      <Modal visible={isEditing} animationType="slide">
        <ThemedView style={styles.modalContainer}>
          <ThemedText style={{ fontSize: 20 }}>Change Shotclock:</ThemedText>
          <View style={styles.inputFieldContainer}>
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
    color: "#fd0101",
    fontSize: 130,
    fontWeight: "200",
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
    color: "#fd0101",
  },
  button: {
    width: "45%",
    borderRadius: 20,
    overflow: "hidden",
  },
});

export default ShotClock;
