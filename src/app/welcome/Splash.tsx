import React, { useState, useEffect } from "react";
import type { SplashScreenProps } from "../../types/navigation";
import { View, Text, StyleSheet, Dimensions, Image, Alert } from "react-native";
import ScreenFrame from "../../components/screen-frames/ScreenFrame";
import ButtonKvStd from "../../components/buttons/ButtonKvStd";
import ButtonKvImage from "../../components/buttons/ButtonKvImage";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../types/store";
import { loginUser, logoutUser } from "../../reducers/user";
import { userReducerOffline } from "../../data/userReducerOffline";
import {
	GoogleSignin,
	isSuccessResponse,
	isErrorWithCode,
	statusCodes,
} from "@react-native-google-signin/google-signin";

export default function Splash({ navigation }: SplashScreenProps) {
	const dispatch = useDispatch();
	const userReducer = useSelector((state: RootState) => state.user);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleLoginGuestOffline = () => {
		console.log("Guest login");

		dispatch(
			loginUser({
				email: userReducerOffline.user.email,
				token: userReducerOffline.token,
				username: userReducerOffline.user.username,
			})
		);
		navigation.navigate("SelectTeam");
	};

	useEffect(() => {
		if (userReducer.token) {
			navigation.navigate("SelectTeam");
		}
	}, [userReducer.token, navigation]);

	const handleUserClickGoogleSignIn = async () => {
		Alert.alert(
			"Google Sign In",
			"By clicking Yes, you agree that Kyber Vision will store your Google email and name in our database. Your password will NOT be stored.",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Yes",
					onPress: () => {
						handleGoogleSignIn();
					},
				},
			],
			{ cancelable: true }
		);
	};

	const handleGoogleSignIn = async () => {
		try {
			setIsSubmitting(true);
			await GoogleSignin.hasPlayServices();
			const response = await GoogleSignin.signIn();
			if (isSuccessResponse(response)) {
				const { idToken, user } = response.data;
				const { name, email } = user;
				const safeName = name ?? email.split("@")[0];
				// console.log("Google Sign In success", { idToken, name, email });
				// Save
				await requestRegisterOrLoginGoogle(email, safeName);
			} else {
				// This means the user cancelled the signin process
				console.log("Google Sign In failed");
			}
			setIsSubmitting(false);
		} catch (error) {
			console.error(`Google Sign In error: ${error}`);
			if (isErrorWithCode(error)) {
				switch (error.code) {
					case statusCodes.IN_PROGRESS:
						Alert.alert("Google Sign In", "User is already signing in");
						break;
					case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
						Alert.alert("Google Sign In", "Play Services not available");
						break;
					case statusCodes.SIGN_IN_CANCELLED:
						Alert.alert("Google Sign In", "User cancelled the sign in");
						break;
					default:
						Alert.alert("Google Sign In", error.code);
						break;
				}
			} else {
				Alert.alert(
					"Google Sign in",
					"an error unrelated to google sign occured during the process"
				);
				console.log(error);
			}
			setIsSubmitting(false);
		}
	};

	const requestRegisterOrLoginGoogle = async (email: string, name: string) => {
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/users/register-or-login-via-google`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, username: name }),
			}
		);

		console.log("Received response:", response.status);

		let resJson = null;
		const contentType = response.headers.get("Content-Type");

		if (contentType?.includes("application/json")) {
			resJson = await response.json();
		}

		if (response.status === 200) {
			console.log(`response ok`);
			resJson.email = email;
			// dispatch(
			//   loginUser({
			//     email: resJson.email,
			//     token: resJson.token,
			//   })
			// );
			dispatch(
				loginUser({
					email: resJson.user.email,
					token: resJson.token,
					username: resJson.user.email.split("@")[0],
					// contractTeamUserArray: resJson.user.ContractTeamUsers || [],
				})
			);
			navigation.navigate("Home");
		} else if (resJson?.error) {
			// setMessage(resJson.error);
			Alert.alert(
				"There was a KV server error while signing in with Google",
				resJson.error
			);
		} else {
			Alert.alert("There was a KV server error while signing in with Google");
		}
	};

	return (
		<ScreenFrame>
			<View style={styles.container}>
				{/* -------- TOP ----- */}
				<View style={styles.containerTop}>
					<Text style={{ color: "gray" }}>
						API: {process.env.EXPO_PUBLIC_API_BASE_URL}
					</Text>
					<View style={styles.vwEmailButtons}>
						<ButtonKvStd
							title="Register"
							onPress={() => {
								navigation.navigate("Register");
							}}
							style={styles.btnEmailRegister}
						>
							Email Register
						</ButtonKvStd>
						<ButtonKvStd
							title="Login"
							onPress={() => {
								if (userReducer.token) {
									navigation.navigate("SelectTeam");
								} else {
									navigation.navigate("Login");
								}
							}}
							style={styles.btnEmailLogin}
						>
							{userReducer.token ? "Select Squad" : "Email Login"}
						</ButtonKvStd>
						{userReducer.token && (
							<ButtonKvStd
								title="Logout"
								onPress={() => {
									dispatch(logoutUser());
								}}
								style={styles.btnEmailLogin}
							>
								Logout
							</ButtonKvStd>
						)}
					</View>
					<View style={styles.vwLineContainer}>
						<View style={styles.vwLine} />
					</View>
					<View style={styles.vwOr}>
						<Text>or</Text>
					</View>
					<View style={styles.vwSocials}>
						<ButtonKvImage
							onPress={handleUserClickGoogleSignIn}
							style={styles.btnGoogle}
							disabled={isSubmitting}
						>
							<Image
								source={require("../../assets/images/welcome/btnGoogle.png")}
							/>
						</ButtonKvImage>
					</View>
					<View style={styles.vwLineContainer}>
						<View style={styles.vwLine} />
					</View>
				</View>
				<View style={styles.containerBottom}>
					<ButtonKvStd
						title="Guest signin"
						onPress={() => {
							console.log("Guest Login");
							handleLoginGuestOffline();
						}}
						style={styles.btnContinueWithoutLogin}
					>
						continue without login
					</ButtonKvStd>
					<Text style={{ position: "absolute", bottom: 20, right: 30 }}>
						Version 0.21.5
					</Text>
				</View>
			</View>
		</ScreenFrame>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDFDFD",
	},

	// ----- TOP -----
	containerTop: {
		flex: 1,
	},
	vwEmailButtons: {
		width: "100%",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 20,
	},
	btnEmailRegister: {
		width: Dimensions.get("window").width * 0.8,
		backgroundColor: "#806181",
		fontSize: 24,
		height: 50,
		justifyContent: "center",
	},
	btnEmailLogin: {
		width: Dimensions.get("window").width * 0.8,
		backgroundColor: "white",
		color: "#585858",
		fontSize: 24,
		borderColor: "#585858",
		borderWidth: 2,
		borderStyle: "solid",
		padding: 5,
		height: 50,
		justifyContent: "center",
	},

	vwLineContainer: {
		width: Dimensions.get("window").width,
		alignItems: "center",
	},
	vwLine: {
		width: "80%",
		borderColor: "#A3A3A3",
		borderWidth: 1,
		borderStyle: "solid",
	},
	vwOr: {
		width: Dimensions.get("window").width,
		alignItems: "center",
	},
	vwSocials: {
		width: Dimensions.get("window").width,
		alignItems: "center",
	},
	btnGoogle: {
		// width: Dimensions.get("window").width * 0.8,
		// backgroundColor: "#4285F4",
		height: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	containerBottom: {
		width: Dimensions.get("window").width,
		height: 150,
		alignItems: "center",
		justifyContent: "center",
	},
	btnContinueWithoutLogin: {
		width: Dimensions.get("window").width * 0.8,
		backgroundColor: "transparent",
		color: "#585858",
		justifyContent: "center",
	},
});
