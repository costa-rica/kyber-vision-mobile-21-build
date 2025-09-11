import {
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	FlatList,
	Pressable,
	TextInput,
} from "react-native";
import TemplateViewWithTopChildren from "./subcomponents/TemplateViewWithTopChildren";
import ButtonKvStd from "./subcomponents/buttons/ButtonKvStd";
import ButtonKvNoDefaultTextOnly from "./subcomponents/buttons/ButtonKvNoDefaultTextOnly";
import ButtonKvNoDefault from "./subcomponents/buttons/ButtonKvNoDefault";
import Tribe from "../assets/images/navigationAndSmall/Tribe.svg";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateTeamsArray } from "../reducers/team";
import { updateContractTeamUserArray } from "../reducers/user";
import { logoutUser } from "../reducers/user";
import * as Clipboard from "expo-clipboard";

export default function SelectTeamScreen({ navigation }) {
	const userReducer = useSelector((state) => state.user);
	const teamReducer = useSelector((state) => state.team);
	const dispatch = useDispatch();

	const [inviteCode, setInviteCode] = useState("");

	const fetchTeams = async () => {
		// The id in the Tribe Array is the TEAM ID
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/contract-team-users`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userReducer.token}`,
				},
			}
		);

		// console.log("Received response:", response.status);

		let resJson = null;
		const contentType = response.headers.get("Content-Type");

		if (contentType?.includes("application/json")) {
			resJson = await response.json();
		}

		if (response.ok && resJson.teamsArray && resJson.contractTeamUserArray) {
			// console.log(`response ok`);
			// console.log(JSON.stringify(resJson));
			const tempArray = resJson.teamsArray.map((item) => {
				return {
					...item,
					selected: false,
				};
			});
			// console.log("tempArray");
			// console.log("--- contract-team-user ---");
			// console.log(JSON.stringify(resJson.contractTeamUserArray, null, 2));
			dispatch(updateTeamsArray(tempArray));
			dispatch(updateContractTeamUserArray(resJson.contractTeamUserArray));
		} else {
			const errorMessage =
				resJson?.error ||
				`There was a server error (and no resJson): ${response.status}`;
			alert(errorMessage);
		}
	};

	const fetchTeamsOffline = () => {
		const teamReducerOffline = require("../offlineData/teamReducer.json");
		dispatch(updateTeamsArray(teamReducerOffline.teamsArray));
	};

	useEffect(() => {
		if (userReducer.token === "offline") {
			fetchTeamsOffline();
		} else {
			fetchTeams();
		}
	}, []);

	const topChildren = (
		<View style={styles.vwTopChildren}>
			<Text style={styles.txtTopChildren}>
				{" "}
				Welcome {userReducer.user.username}
			</Text>
		</View>
	);

	const selectTeamRow = ({ item }) => {
		const isSelected = item.selected;

		return (
			<Pressable
				onPress={() => {
					const tempArray = teamReducer.teamsArray.map((team) => {
						if (team.id === item.id) {
							return {
								...team,
								selected: true,
							};
						} else {
							return {
								...team,
								selected: false,
							};
						}
					});
					dispatch(updateTeamsArray(tempArray));
					navigation.navigate("HomeScreen");
				}}
				style={[styles.vwTeamRow, isSelected && styles.vwTeamRowSelected]}
			>
				<Text style={styles.txtTeamName}>{item.teamName}</Text>
			</Pressable>
		);
	};

	const handleRequestJoinTeam = async () => {
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/contract-team-users/join/${inviteCode}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userReducer.token}`,
				},
			}
		);
		let resJson = null;
		const contentType = response.headers.get("Content-Type");
		if (contentType?.includes("application/json")) {
			resJson = await response.json();
		}

		if (response.ok && resJson) {
			fetchTeams();
			Alert.alert("Team joined successfully");
			setInviteCode("");
		} else {
			const errorMessage =
				resJson?.message ||
				`There was a server error (and no resJson): ${response.status}`;

			alert(errorMessage);
			if (errorMessage.includes("User already in team")) {
				setInviteCode("");
			}
		}
		// };
	};

	return (
		<TemplateViewWithTopChildren
			navigation={navigation}
			topChildren={topChildren}
			screenName={"SelectTeamScreen"}
			onBackPress={() => {
				navigation.navigate("LogoutScreen");
				return false;
			}}
		>
			<View style={styles.container}>
				<View style={styles.containerTop}>
					<Tribe />

					{teamReducer.teamsArray?.length > 0 ? (
						<FlatList
							data={teamReducer.teamsArray}
							renderItem={selectTeamRow}
							keyExtractor={(item) => item.id.toString()}
							style={styles.flatListTeamNames}
						/>
					) : (
						<View style={styles.vwNoTeamInfo}>
							<Text style={styles.txtNoTeamInfo}>
								You are not a member of any team yet
							</Text>
							<Text style={styles.txtNoTeamInfo}>
								You can use one of the three options below
							</Text>
							{/* <Text>{JSON.stringify(userReducer.user)}</Text>
              <Text>{JSON.stringify(userReducer.token)}</Text> */}
						</View>
					)}
				</View>
				<View style={styles.containerBottom}>
					<View style={styles.vwInputGroup}>
						<ButtonKvNoDefaultTextOnly
							onPress={() => navigation.navigate("CreateTeamScreen")}
							styleView={styles.btnTribe}
							styleText={styles.btnTribeText}
						>
							Create your team
						</ButtonKvNoDefaultTextOnly>
					</View>
					<View style={styles.vwInputGroup}>
						{/* <ButtonKvStd
              onPress={() => {
                dispatch(logoutUser());
                navigation.navigate("SplashScreen");
              }}
              style={styles.btnHomeNavigation}
            >
              Logout
            </ButtonKvStd> */}
						<ButtonKvNoDefaultTextOnly
							onPress={() => console.log("Join a public squad")}
							styleView={styles.btnTribe}
							styleText={styles.btnTribeText}
						>
							Join a public squad
						</ButtonKvNoDefaultTextOnly>
					</View>
					<View style={styles.vwInputAndButton}>
						<ButtonKvNoDefault
							styleView={styles.btnIconForLink}
							onPress={async () => {
								const clipboardContent = await Clipboard.getStringAsync();
								if (clipboardContent) {
									setInviteCode(clipboardContent);
								} else {
									Alert.alert("Clipboard is empty");
								}
							}}
						>
							<Image
								source={require("../assets/images/iconLink.png")}
								resizeMode="contain"
								style={styles.imgIconForLink}
							/>
						</ButtonKvNoDefault>

						<View style={styles.vwInputWithLabel}>
							<View style={styles.vwInputWithLabelForUnderline}>
								{/* <Text style={styles.txtInputLabel}>email:</Text> */}
								<TextInput
									placeholder="paste invite code here"
									style={styles.txtInputInvite}
									value={inviteCode}
									onChangeText={setInviteCode}
								/>
							</View>
						</View>
						<ButtonKvNoDefaultTextOnly
							onPress={() => {
								// console.log("Yes ....");
								if (inviteCode) {
									// onPressYes(inviteCode);
									handleRequestJoinTeam();
								} else {
									Alert.alert("Invite code is required");
								}
							}}
							styleView={styles.btnGo}
							styleText={styles.txtBtnGo}
						>
							go!
						</ButtonKvNoDefaultTextOnly>
					</View>
				</View>
			</View>
		</TemplateViewWithTopChildren>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDFDFD",
		width: "100%",
	},
	vwTopChildren: {
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	txtTopChildren: {
		color: "white",
		fontSize: 20,
		fontWeight: "bold",
	},
	// ------------
	// Top
	// ------------
	containerTop: {
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
		flex: 1,
		// borderColor: "gray",
		// borderWidth: 1,
		// borderStyle: "dashed",
	},

	vwInputGroup: {
		width: "90%",
		alignItems: "center",
		paddingTop: 30,
	},

	// ------------
	// FlatList
	// ------------

	flatListTeamNames: {
		width: "100%",
		borderColor: "gray",
		borderWidth: 1,
		borderStyle: "solid",
		borderRadius: 10,
		padding: 5,
	},
	vwTeamRow: {
		padding: 5,
		marginVertical: 5,
		backgroundColor: "#F0F0F0",
		borderRadius: 2.5,
		width: "100%",
		textAlign: "center",
		// height: 50,
	},
	vwTeamRowSelected: {
		backgroundColor: "#D3D3D3", // light gray
	},
	vwNoTeamInfo: {
		alignItems: "center",
		width: "70%",
		gap: 20,
	},
	txtNoTeamInfo: {
		fontSize: 16,
		color: "#806181",
		textAlign: "center",
	},
	// ------------
	// Bottom
	// ------------
	containerBottom: {
		// flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingBottom: Dimensions.get("window").height * 0.075,
		// borderColor: "gray",
		// borderWidth: 1,
		// borderStyle: "dashed",
	},

	btnTribe: {
		width: Dimensions.get("window").width * 0.6,
		height: 50,
		justifyContent: "center",
		fontSize: 24,
		color: "white",
		backgroundColor: "#C0A9C0",
		borderRadius: 35,
		alignItems: "center",
	},
	btnTribeText: {
		color: "white",
		fontSize: 24,
	},
	btnTribeTextInactive: {
		color: "#AB8EAB",
		fontSize: 24,
	},
	vwInputAndButton: {
		width: "100%",
		gap: 10,
		marginTop: 30,
		alignItems: "center",
		flexDirection: "row",
		paddingRight: 10,
		paddingLeft: 20,
	},
	btnIconForLink: {
		width: 50,
		height: 50,
		borderRadius: 25,
		color: "white",
		// backgroundColor: "#E8E8E8",
		backgroundColor: "transparent",
		borderColor: "transparent",
		borderWidth: 2,
		padding: 5,
		alignItems: "center",
		justifyContent: "center",
	},
	vwInputWithLabel: {
		backgroundColor: "white",
		padding: 5,
		// width: "100%",
		flex: 1,
	},

	vwInputWithLabelForUnderline: {
		borderBottomWidth: 1,
		borderBottomColor: "#806181",
		// marginBottom: 10,
	},
	txtInputLabel: {
		// fontSize: 16,
		// marginBottom: 5,
		color: "gray",
	},
	txtInputInviteUrl: {
		width: "100%",
		height: 40,
		borderRadius: 5,
		backgroundColor: "white",
		padding: 5,
		fontStyle: "italic",
		// fontSize: 10,
	},
	btnGo: {
		justifyContent: "center",
		alignItems: "center",
		width: 50,
		height: 50,
		borderRadius: 25,
		color: "white",
		// backgroundColor: "#E8E8E8",
		backgroundColor: "#806181",
		borderColor: "#806181",
		borderWidth: 2,
		padding: 5,
	},
	txtBtnGo: {
		fontSize: 24,
		color: "white",
		justifyContent: "center",
		alignItems: "center",
	},
});
