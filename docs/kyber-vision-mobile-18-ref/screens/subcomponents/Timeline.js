import { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

export default function Timeline({
  timelineWidth = Dimensions.get("window").width,
  playerRef,
  currentTime,
  duration,
  onSeek,
}) {
  const [timelineLayout, setTimelineLayout] = useState(0);
  const calculateTimelineLength = (event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setTimelineLayout({ x, y, width, height });
  };

  // Tap timeline position
  const gestureTapTimeline = Gesture.Tap().onEnd((event) => {
    if (!timelineLayout) return;
    const newProgress = Math.min(
      Math.max(event.x / timelineLayout.width, 0),
      1
    );
    console.log("- newProgress: ", newProgress);
    handleTimelineNewPosition(newProgress);
  });

  // Slide timeline position
  const gestureSwipeTimeline = Gesture.Pan().onUpdate((event) => {
    if (!timelineLayout) return;
    const newProgress = Math.min(
      Math.max(event.x / timelineLayout.width, 0),
      1
    );
    handleTimelineNewPosition(newProgress);
  });

  const handleTimelineNewPosition = (newProgress) => {
    const newTime = newProgress * duration;
    playerRef.current.seekTo(newTime);
    if (onSeek) onSeek(newTime);
  };

  const combinedTimelineGesture = Gesture.Race(
    gestureTapTimeline,
    gestureSwipeTimeline
  );
  return (
    <GestureDetector gesture={combinedTimelineGesture}>
      <View
        style={[styles.vwTimeline, { width: timelineWidth }]}
        onLayout={calculateTimelineLength}
      >
        <View
          style={[
            styles.vwTimelineProgress,
            {
              width: `${(currentTime / duration) * 100}%`,
            },
          ]}
        />
      </View>
    </GestureDetector>
  );
}
const styles = StyleSheet.create({
  vwTimeline: {
    height: 15,
    backgroundColor: "#170418",
    overflow: "visible",
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
  },
  vwTimelineProgress: {
    height: "100%",
    backgroundColor: "#8D0B90",
  },
  vwTimelineProgressCircle: {
    position: "absolute",
    top: "50%",
    width: 16,
    height: 16,
    backgroundColor: "#C3C3C3",
    borderRadius: 8, // rule of thumb: half the height and width
    borderColor: "#A3A3A3",
    borderWidth: 2,
    transform: [{ translateY: -8 }, { translateX: -2.5 }],
    zIndex: 1,
  },
  vwActionMarker: {
    backgroundColor: "#838383",
    borderRadius: 5,
    width: 9,
    height: 9,
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -5 }],
    zIndex: 2,
  },
});
