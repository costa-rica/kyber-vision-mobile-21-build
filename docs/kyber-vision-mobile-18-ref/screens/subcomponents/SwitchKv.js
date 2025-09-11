import { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Switch,
  ScrollView,
} from "react-native";

export default function SwitchKv({
  state,
  setState,

  // onPress,
  // colorBackground = "#A3A3A3",
  // colorText = "white",
  // width = 140,
  // children
}) {
  return (
    <TouchableOpacity
      style={[styles.switch]}
      onPress={() => setState((previousState) => !previousState)}
    >
      {/* "Y" on the left */}
      <Text style={[styles.trackText, { left: 10 }]}>Y</Text>

      {/* "N" on the right */}
      <Text style={[styles.trackText, { right: 10 }]}>N</Text>

      {/* Thumb */}
      <View
        style={[
          styles.thumb,
          {
            left: state ? 2 : 32,
          },
        ]}
      >
        <Text style={styles.thumbText}>{state ? "Y" : "N"}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  switch: {
    width: 60,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: "center",
    position: "relative",
    borderColor: "#970F9A",
    borderWidth: 1,
    backgroundColor: "white",
  },
  thumb: {
    backgroundColor: "#970F9A",
    width: 26,
    height: 26,
    borderRadius: 13,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    fontFamily: "ApfelGrotezk",
  },
  trackText: {
    position: "absolute",
    fontSize: 14,
    fontWeight: "bold",
    color: "rgba(200,200,200,.7)",
  },
});
