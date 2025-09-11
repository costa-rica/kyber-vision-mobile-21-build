import React, { useState, useEffect } from "react";
import type { SplashScreenProps } from "../../types/navigation";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import ScreenFrame from "../../components/screen-frames/ScreenFrame";
import ButtonKvStd from "../../components/buttons/ButtonKvStd";
import ButtonKvImage from "../../components/buttons/ButtonKvImage";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../types/store";
import { loginUser, logoutUser } from "../../reducers/user";
import { userReducerOffline } from "../../data/userReducerOffline";

export default function Splash({ navigation }: SplashScreenProps) {
	console.log("Kyber Vision Mobile 20 - Splash");

	// const [isSubmitting, setIsSubmitting] = useState(false);
	const dispatch = useDispatch();
	const userReducer = useSelector((state: RootState) => state.user);

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

	return (
		<ScreenFrame>
			<View style={styles.container}>
				{/* -------- TOP ----- */}
				<View style={styles.containerTop}>
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
							onPress={() => {
								// TODO: Implement Google sign-in
								console.log("Google sign-in - not implemented yet");
							}}
							style={styles.btnGoogle}
						>
							{/* TODO: Add Google button image */}
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
						Version 0.20.0
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
