import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

// const Splash = () => {
export default function Splash({ navigation }: any) {
	return (
		<View style={styles.container}>
			<Text>Splash</Text>
			<TouchableOpacity onPress={() => navigation.navigate("Login")}>
				<Text>Login</Text>
			</TouchableOpacity>
		</View>
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
