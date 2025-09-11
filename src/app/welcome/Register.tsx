import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Dimensions,
	Alert,
	TouchableWithoutFeedback,
	Keyboard,
	Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type { RegisterScreenProps } from "../../types/navigation";
import ScreenFrame from "../../components/screen-frames/ScreenFrame";
import { FontAwesome } from "@expo/vector-icons";
import ButtonKvImage from "../../components/buttons/ButtonKvImage";
import ButtonKvStd from "../../components/buttons/ButtonKvStd";
import { useDispatch } from "react-redux";
import { loginUser } from "../../reducers/user";

export default function Register({ navigation }: RegisterScreenProps) {
	const dispatch = useDispatch();
	
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordRepeat, setPasswordRepeat] = useState("");
	const [passwordsMatch, setPasswordsMatch] = useState(true);
	const [message, setMessage] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

	const handleClickRegister = async () => {
		if (password !== passwordRepeat) {
			Alert.alert("Error", "Passwords do not match");
			return;
		}
		if (!firstName || !lastName || !email || !password || !passwordRepeat) {
			Alert.alert("Error", "All fields are required");
			return;
		}
		if (!email.includes("@")) {
			Alert.alert("Error", "Invalid email");
			return;
		}

		console.log(
			"Register ---> API URL:",
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/users/register`
		);

		const bodyObj = { email, password, firstName, lastName };

		try {
			const response = await fetch(
				`${process.env.EXPO_PUBLIC_API_BASE_URL}/users/register`,
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

			if (response.status === 201 && resJson) {
				console.log("Registration successful");
				dispatch(
					loginUser({
						email: resJson.user.email,
						token: resJson.token,
						username: resJson.user.username,
						contractTeamUserArray: resJson.user.ContractTeamUsers || [],
					})
				);
				setMessage("Successfully registered");
				navigation.navigate("SelectTeam");
			} else {
				const errorMessage = resJson?.error || `There was a server error: ${response.status}`;
				setMessage(errorMessage);
				Alert.alert("Registration Error", errorMessage);
			}
		} catch (error) {
			console.error("Registration error:", error);
			const errorMessage = "Network error. Please try again.";
			setMessage(errorMessage);
			Alert.alert("Registration Error", errorMessage);
		}
	};

	const handlePasswordRepeatMatching = (text: string) => {
		setPasswordRepeat(text);
		if (password !== text) {
			setPasswordsMatch(false);
		} else {
			setMessage("");
			setPasswordsMatch(true);
		}
	};

	return (
		<ScreenFrame>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<KeyboardAwareScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					enableOnAndroid={true}
					extraScrollHeight={Platform.OS === "android" ? 80 : 0}
					enableAutomaticScroll={true}
					keyboardShouldPersistTaps="handled"
				>
					<View style={styles.container}>
						<View style={styles.containerTop}>
							<View style={styles.vwInputGroup}>
								<Text style={styles.txtInputGroupLabel}>First Name</Text>
								<View style={styles.vwInputWrapper}>
									<FontAwesome
										name="user"
										size={20}
										color="gray"
										style={styles.faIcon}
									/>
									<TextInput
										placeholder="First Name"
										placeholderTextColor="gray"
										value={firstName}
										onChangeText={(text) => setFirstName(text)}
										style={styles.txtInputWithIcon}
										autoCapitalize="words"
									/>
								</View>
							</View>

							<View style={styles.vwInputGroup}>
								<Text style={styles.txtInputGroupLabel}>Last Name</Text>
								<View style={styles.vwInputWrapper}>
									<FontAwesome
										name="user"
										size={20}
										color="gray"
										style={styles.faIcon}
									/>
									<TextInput
										placeholder="Last Name"
										placeholderTextColor="gray"
										value={lastName}
										onChangeText={(text) => setLastName(text)}
										style={styles.txtInputWithIcon}
										autoCapitalize="words"
									/>
								</View>
							</View>

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
										onChangeText={(text) => setEmail(text)}
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

							<View style={styles.vwInputGroup}>
								<Text style={styles.txtInputGroupLabel}>Confirm Password</Text>
								<View
									style={[
										styles.vwInputWrapper,
										{ borderColor: passwordsMatch ? "gray" : "red" },
									]}
								>
									<ButtonKvImage
										onPress={() => setShowPasswordRepeat((prev) => !prev)}
										style={styles.vwIconButton}
									>
										<FontAwesome
											name={showPasswordRepeat ? "unlock" : "lock"}
											size={20}
											color="gray"
											style={styles.faIcon}
										/>
									</ButtonKvImage>
									<TextInput
										placeholder="••••••••••"
										placeholderTextColor="gray"
										secureTextEntry={!showPasswordRepeat}
										value={passwordRepeat}
										onChangeText={(text) => handlePasswordRepeatMatching(text)}
										style={styles.txtInputWithIcon}
									/>
								</View>
								{!passwordsMatch && (
									<Text style={styles.txtPasswordMismatch}>
										Passwords do not match
									</Text>
								)}
							</View>

							<View style={styles.vwInputGroupLogin}>
								<ButtonKvStd
									onPress={() => handleClickRegister()}
									style={styles.btnRegister}
								>
									Register
								</ButtonKvStd>
							</View>

							{message !== "" && (
								<View style={styles.vwMessage}>
									<Text style={styles.txtMessage}>{message}</Text>
								</View>
							)}
						</View>
					</View>
				</KeyboardAwareScrollView>
			</TouchableWithoutFeedback>
		</ScreenFrame>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDFDFD",
		width: "100%",
	},
	containerTop: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	vwInputGroup: {
		width: "90%",
		alignItems: "flex-start",
		marginTop: 15,
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
		width: "100%",
	},
	faIcon: {
		marginRight: 8,
	},
	txtInputWithIcon: {
		flex: 1,
		paddingVertical: 12,
		color: "black",
		fontSize: 16,
	},
	txtInputGroupLabel: {
		fontSize: 14,
		color: "#5B5B5B",
		paddingLeft: 15,
		marginBottom: 5,
	},
	vwIconButton: {
		padding: 5,
		marginRight: 8,
		borderRadius: 20,
		backgroundColor: "transparent",
	},
	btnRegister: {
		width: Dimensions.get("window").width * 0.7,
		height: 50,
		justifyContent: "center",
		fontSize: 24,
		color: "#fff",
		backgroundColor: "#806181",
	},
	txtPasswordMismatch: {
		color: "red",
		fontSize: 12,
		marginTop: 5,
		paddingLeft: 15,
	},
	vwMessage: {
		width: "90%",
		alignItems: "center",
		marginTop: 20,
	},
	txtMessage: {
		color: "#806181",
		fontSize: 16,
		textAlign: "center",
	},
});