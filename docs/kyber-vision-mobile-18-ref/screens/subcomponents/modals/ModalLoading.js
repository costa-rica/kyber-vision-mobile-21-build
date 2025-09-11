import { StyleSheet, View, Animated, Dimensions } from "react-native";
import { useEffect, useRef } from "react";

export default function ModalLoading() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (animatedValue, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createAnimation(dot1, 0).start();
    createAnimation(dot2, 200).start();
    createAnimation(dot3, 400).start();
  }, []);

  const animatedStyle = (animatedValue) => ({
    opacity: animatedValue,
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0.3, 1],
          outputRange: [0.8, 1.2],
        }),
      },
    ],
  });

  return (
    <View style={styles.modalContent}>
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, animatedStyle(dot1)]} />
        <Animated.View style={[styles.dot, animatedStyle(dot2)]} />
        <Animated.View style={[styles.dot, animatedStyle(dot3)]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    width: Dimensions.get("window").width * 0.95,
    height: Dimensions.get("window").height * 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 60,
    gap: 10,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
  },
});
