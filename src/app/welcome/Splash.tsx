import React from "react";
import type { SplashScreenProps } from "../../types/navigation";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ScreenFrame from "../../components/screen-frames/ScreenFrame";

// export default function Splash({ navigation }: SplashScreenProps) {
export default function Splash({ navigation }: SplashScreenProps) {
	console.log("Kvber Vision Mobile 20 - Splash");
	return (
		<ScreenFrame>
			<View style={styles.container}>
				<Text>Splash</Text>

				<TouchableOpacity onPress={() => navigation.navigate("Login")}>
					<Text>Login</Text>
				</TouchableOpacity>
			</View>
		</ScreenFrame>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDFDFD",
		justifyContent: "center",
		alignItems: "center",
	},
});
