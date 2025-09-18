import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Dimensions,
	Alert,
} from "react-native";
import React, { useState } from "react";
import type { LoginScreenProps } from "../../types/navigation";
import ScreenFrame from "../../components/screen-frames/ScreenFrame";
import { FontAwesome } from "@expo/vector-icons";
import ButtonKvImage from "../../components/buttons/ButtonKvImage";
import ButtonKvStd from "../../components/buttons/ButtonKvStd";
import { useDispatch } from "react-redux";
import { loginUser } from "../../reducers/user";

export default function Login({ navigation }: LoginScreenProps) {
	const dispatch = useDispatch();
	const [email, setEmail] = useState(
		process.env.EXPO_PUBLIC_ENVIRONMENT_01 === "workstation"
			? "nrodrig1@gmail.com"
			: ""
	);
	const [password, setPassword] = useState(
		process.env.EXPO_PUBLIC_ENVIRONMENT_01 === "workstation" ? "test" : ""
	);
	const [showPassword, setShowPassword] = useState(false);

	const handleClickLogin = async () => {
		console.log(
			"Login ---> API URL:",
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/users/login`
		);

		const bodyObj = {
			email: email,
			password: password,
		};

		try {
			const response = await fetch(
				`${process.env.EXPO_PUBLIC_API_BASE_URL}/users/login`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(bodyObj),
				}
			);

			console.log("Received response:", response.status);

			let resJson = null;
			const contentType = response.headers.get("Content-Type");

			if (contentType?.includes("application/json")) {
				resJson = await response.json();
			}

			if (response.ok && resJson) {
				console.log("Response ok");
				dispatch(
					loginUser({
						email: resJson.user.email,
						token: resJson.token,
						username: resJson.user.username,
						contractTeamUserArray: resJson.user.ContractTeamUsers || [],
					})
				);

				navigation.navigate("SelectTeam");
			} else {
				const errorMessage =
					resJson?.error ||
					`There was a server error (and no resJson): ${response.status}`;
				Alert.alert("Login Error", errorMessage);
			}
		} catch (error) {
			console.error("Login error:", error);
			Alert.alert("Login Error", `Network error. ${error}`);
		}
	};

	return (
		<ScreenFrame>
			<View style={styles.container}>
				<View style={styles.containerMiddle}>
					<Text style={{ color: "gray" }}>
						API: {process.env.EXPO_PUBLIC_API_BASE_URL}
					</Text>
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
									setEmail(text);
								}}
								style={styles.txtInputWithIcon}
								autoCapitalize="none"
								keyboardType="email-address"
							/>
						</View>
					</View>

					<View style={styles.vwInputGroup}>
						<Text style={styles.txtInputGroupLabel}>Password</Text>
						<View style={styles.vwInputWrapper}>
							<ButtonKvImage
								onPress={() => setShowPassword((prev) => !prev)}
								style={styles.vwIconButton}
							>
								<FontAwesome
									name={showPassword ? "unlock" : "lock"}
									size={20}
									color="gray"
									style={styles.faIcon}
								/>
							</ButtonKvImage>
							<TextInput
								placeholder="••••••••••"
								placeholderTextColor="gray"
								secureTextEntry={!showPassword}
								value={password}
								onChangeText={(text) => setPassword(text)}
								style={styles.txtInputWithIcon}
							/>
						</View>
					</View>

					<View style={styles.vwInputGroupForgotPassword}>
						<ButtonKvStd
							onPress={() => {
								// TODO: Implement forgot password functionality
								console.log("ResetPasswordRequest");
								Alert.alert(
									"Coming Soon",
									"Forgot password feature will be implemented soon."
								);
							}}
							style={styles.btnForgotPassword}
						>
							Forgot password ?
						</ButtonKvStd>
					</View>

					<View style={styles.vwInputGroupLogin}>
						<ButtonKvStd
							onPress={() => handleClickLogin()}
							style={styles.btnLogin}
						>
							Login
						</ButtonKvStd>
					</View>

					<View style={styles.vwInputGroupCreateAccount}>
						<ButtonKvStd
							onPress={() => {
								navigation.navigate("Register");
							}}
							style={styles.btnCreateAccount}
						>
							Create an account
						</ButtonKvStd>
					</View>
				</View>
			</View>
		</ScreenFrame>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDFDFD",
		width: "100%",
	},
	containerMiddle: {
		width: "100%",
		alignItems: "center",
		paddingTop: 50,
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
	vwIconButton: {
		padding: 5,
		marginRight: 8,
		borderRadius: 20,
		backgroundColor: "transparent",
	},
	btnForgotPassword: {
		width: "auto",
		height: "auto",
		fontSize: 14,
		color: "#806181",
		backgroundColor: "transparent",
	},
	btnLogin: {
		width: Dimensions.get("window").width * 0.6,
		height: 50,
		justifyContent: "center",
		fontSize: 24,
		color: "#fff",
		backgroundColor: "#806181",
	},
	btnCreateAccount: {
		width: "auto",
		height: "auto",
		fontSize: 14,
		color: "#806181",
		backgroundColor: "transparent",
		borderBottomWidth: 1,
		borderBottomColor: "gray",
		// borderBottomStyle: "solid",
		borderRadius: 5,
	},
});
