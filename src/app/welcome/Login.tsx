import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
} from "react-native";
import React from "react";
import type { LoginScreenProps } from "../../types/navigation";
import ScreenFrame from "../../components/screen-frames/ScreenFrame";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
export default function Login({ navigation }: LoginScreenProps) {
	const [email, setEmail] = useState("");
	return (
		<ScreenFrame>
			<View style={styles.container}>
				<Text>Login</Text>
				<TouchableOpacity onPress={() => navigation.navigate("Splash")}>
					<Text>Splash</Text>
				</TouchableOpacity>

				<View style={styles.vwInputGroup}>
					<Text style={styles.txtInputGroupLabel}>E-mail</Text>
					<View style={styles.vwInputWrapper}>
						<FontAwesome
							name="envelope"
							size={20}
							color="gray"
							style={styles.faIcon}
						/>
						<TextInput
							placeholder="your.email@volleyball.com"
							placeholderTextColor="gray"
							value={email}
							onChangeText={(text) => {
								// console.log("text:", text);
								setEmail(text);
							}}
							style={styles.txtInputWithIcon}
						/>
					</View>
				</View>
			</View>
		</ScreenFrame>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "green",
		justifyContent: "center",
		alignItems: "center",
	},
	vwInputGroup: {
		width: "90%",
		alignItems: "flex-start",
		marginTop: 10,
	},
	vwInputGroupForgotPassword: {
		width: "90%",
		alignItems: "flex-start",
		marginTop: 5,
		paddingLeft: 15,
	},
	vwInputGroupCreateAccount: {
		width: "90%",
		alignItems: "center",
		marginTop: 20,
		backgroundColor: "transparent",
	},
	vwInputGroupLogin: {
		width: "90%",
		alignItems: "center",
		paddingTop: 30,
	},
	vwInputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 20,
		paddingHorizontal: 10,
		backgroundColor: "#fff",
	},
	faIcon: {
		marginRight: 8,
	},
	txtInputWithIcon: {
		flex: 1,
		paddingVertical: 10,
		color: "black",
	},
	txtInputGroupLabel: {
		fontSize: 14,
		color: "#5B5B5B",
		paddingLeft: 15,
	},
});
