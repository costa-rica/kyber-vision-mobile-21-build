import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	FlatList,
	Pressable,
	TextInput,
	Alert,
} from "react-native";
import type { SelectTeamScreenProps } from "../../types/navigation";
import ScreenFrameWithTopChildren from "../../components/screen-frames/ScreenFrameWithTopChildren";
import ButtonKvStd from "../../components/buttons/ButtonKvStd";
import ButtonKvNoDefaultTextOnly from "../../components/buttons/ButtonKvNoDefaultTextOnly";
import ButtonKvNoDefault from "../../components/buttons/ButtonKvNoDefault";
import Tribe from "../../assets/images/welcome/Tribe.svg";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../types/store";
import { updateTeamsArray } from "../../reducers/team";
import { updateContractTeamUserArray, logoutUser } from "../../reducers/user";
import * as Clipboard from "expo-clipboard";
import { teamReducerOffline } from "../../data/teamReducerOffline";
import type { Team } from "../../reducers/team";

export default function SelectTeam({ navigation }: SelectTeamScreenProps) {
	const userReducer = useSelector((state: RootState) => state.user);
	const teamReducer = useSelector((state: RootState) => state.team);
	const dispatch = useDispatch();

	const [inviteCode, setInviteCode] = useState("");

	const fetchTeams = async () => {
		try {
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

			let resJson = null;
			const contentType = response.headers.get("Content-Type");

			if (contentType?.includes("application/json")) {
				resJson = await response.json();
			}

			if (response.ok && resJson.teamsArray && resJson.contractTeamUserArray) {
				const tempArray = resJson.teamsArray.map((item: any) => ({
					...item,
					selected: false,
				}));
				dispatch(updateTeamsArray(tempArray));
				dispatch(updateContractTeamUserArray(resJson.contractTeamUserArray));
			} else {
				const errorMessage =
					resJson?.error ||
					`There was a server error (and no resJson): ${response.status}`;
				Alert.alert("Error", errorMessage);
			}
		} catch (error) {
			console.error("Fetch teams error:", error);
			Alert.alert("Error", "Network error. Please try again.");
		}
	};

	const fetchTeamsOffline = () => {
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
				Welcome {userReducer.user.username}
			</Text>
		</View>
	);

	const selectTeamRow = ({ item }: { item: Team }) => {
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
					navigation.navigate("Home");
				}}
				style={[styles.vwTeamRow, isSelected && styles.vwTeamRowSelected]}
			>
				<Text style={styles.txtTeamName}>{item.teamName}</Text>
			</Pressable>
		);
	};

	const handleRequestJoinTeam = async () => {
		try {
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
				Alert.alert("Success", "Team joined successfully");
				setInviteCode("");
			} else {
				const errorMessage =
					resJson?.message ||
					`There was a server error (and no resJson): ${response.status}`;

				Alert.alert("Error", errorMessage);
				if (errorMessage.includes("User already in team")) {
					setInviteCode("");
				}
			}
		} catch (error) {
			console.error("Join team error:", error);
			Alert.alert("Error", "Network error. Please try again.");
		}
	};

	return (
		<ScreenFrameWithTopChildren
			navigation={navigation}
			topChildren={topChildren}
			screenName="SelectTeamScreen"
			onBackPress={() => {
				// TODO: Implement LogoutScreen
				dispatch(logoutUser());
				navigation.navigate("Splash");
				return false;
			}}
		>
			<View style={styles.container}>
				<View style={styles.containerTop}>
					<Tribe width={80} height={80} />

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
						</View>
					)}
				</View>
				<View style={styles.containerBottom}>
					<View style={styles.vwInputGroup}>
						<ButtonKvNoDefaultTextOnly
							onPress={() => {
								// TODO: Implement CreateTeamScreen
								// console.log("Create team - not implemented yet");
								// Alert.alert(
								// 	"Coming Soon",
								// 	"Create team feature will be implemented soon."
								// );
								navigation.navigate("CreateTeam");
							}}
							styleView={styles.btnTribe}
							styleText={styles.btnTribeText}
						>
							Create your team
						</ButtonKvNoDefaultTextOnly>
					</View>
					<View style={styles.vwInputGroup}>
						<ButtonKvNoDefaultTextOnly
							onPress={() => {
								// TODO: Implement join public squad
								console.log("Join a public squad");
								Alert.alert(
									"Coming Soon",
									"Join public squad feature will be implemented soon."
								);
							}}
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
									Alert.alert("Clipboard Empty", "Clipboard is empty");
								}
							}}
						>
							{/* TODO: Add proper link icon */}
							<Image
								source={require("../../assets/images/welcome/iconLink.png")}
								resizeMode="contain"
								// style={styles.imgIconForLink}
							/>
						</ButtonKvNoDefault>

						<View style={styles.vwInputWithLabel}>
							<View style={styles.vwInputWithLabelForUnderline}>
								<TextInput
									placeholder="paste invite code here"
									placeholderTextColor="#806181"
									style={styles.txtInputInvite}
									value={inviteCode}
									onChangeText={setInviteCode}
								/>
							</View>
						</View>
						<ButtonKvNoDefaultTextOnly
							onPress={() => {
								if (inviteCode) {
									handleRequestJoinTeam();
								} else {
									Alert.alert("Required", "Invite code is required");
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
		</ScreenFrameWithTopChildren>
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
	// Top
	containerTop: {
		alignItems: "center",
		// justifyContent: "center",
		paddingHorizontal: 10,
		flex: 1,
		// backgroundColor: "blue",
		height: "100%",
	},
	vwInputGroup: {
		width: "90%",
		alignItems: "center",
		paddingTop: 10,
	},
	// FlatList
	flatListTeamNames: {
		width: "100%",
		borderColor: "gray",
		borderWidth: 1,
		borderStyle: "solid",
		borderRadius: 10,
		padding: 5,
		// marginTop: 20,
		minHeight: 100,
	},
	vwTeamRow: {
		padding: 15,
		marginVertical: 5,
		backgroundColor: "#F0F0F0",
		borderRadius: 5,
		width: "100%",
	},
	vwTeamRowSelected: {
		backgroundColor: "#D3D3D3",
	},
	txtTeamName: {
		fontSize: 16,
		textAlign: "center",
		fontWeight: "500",
	},
	vwNoTeamInfo: {
		alignItems: "center",
		width: "70%",
		gap: 20,
		marginTop: 20,
	},
	txtNoTeamInfo: {
		fontSize: 16,
		color: "#806181",
		textAlign: "center",
	},
	// Bottom
	containerBottom: {
		alignItems: "center",
		justifyContent: "center",
		paddingBottom: Dimensions.get("window").height * 0.075,
		// backgroundColor: "green",
	},
	btnTribe: {
		width: Dimensions.get("window").width * 0.6,
		height: 50,
		justifyContent: "center",
		backgroundColor: "#C0A9C0",
		borderRadius: 35,
		alignItems: "center",
	},
	btnTribeText: {
		color: "white",
		fontSize: 18,
	},
	vwInputAndButton: {
		width: "100%",
		// gap: 10,
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
		flex: 1,
	},
	vwInputWithLabelForUnderline: {
		borderBottomWidth: 1,
		borderBottomColor: "#806181",
	},
	txtInputInvite: {
		height: 40,
		padding: 5,
		color: "black",
	},
	btnGo: {
		justifyContent: "center",
		alignItems: "center",
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: "#806181",
		borderColor: "#806181",
		borderWidth: 2,
		padding: 5,
	},
	txtBtnGo: {
		fontSize: 18,
		color: "white",
		fontWeight: "bold",
	},
});
