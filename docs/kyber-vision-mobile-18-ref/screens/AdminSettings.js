import {
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	TouchableOpacity,
	FlatList,
	Modal,
	Pressable,
	TouchableWithoutFeedback,
	Alert,
} from "react-native";
// import TemplateViewWithTopChildren from "./subcomponents/TemplateViewWithTopChildren";
import TemplateViewWithTopChildrenSmall from "./subcomponents/TemplateViewWithTopChildrenSmall";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import BtnVisibilityDown from "../assets/images/buttons/btnVisibilityDown.svg";
import BtnVisibilityUp from "../assets/images/buttons/btnVisibilityUp.svg";
import IconMagnifingGlass from "../assets/images/iconMagnifingGlass.svg";
import { updateTeamsArray } from "../reducers/team";

import ButtonKvNoDefault from "./subcomponents/buttons/ButtonKvNoDefault";
import ButtonKvNoDefaultTextOnly from "./subcomponents/buttons/ButtonKvNoDefaultTextOnly";
import ModalAddPlayer from "./subcomponents/modals/ModalTeamAddPlayer";
import {
	updateSelectedPlayerObject,
	updateSquadMembersArray,
} from "../reducers/team";
import ModalAdminSettingsInviteToSquad from "./subcomponents/modals/ModalAdminSettingsInviteToSquad";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function AdminSettings({ navigation }) {
	const userReducer = useSelector((state) => state.user);
	// const uploadReducer = useSelector((state) => state.upload);
	const teamReducer = useSelector((state) => state.team);
	const [showVisibilityOptions, setShowVisibilityOptions] = useState(false);
	const dispatch = useDispatch();
	const [playersArray, setPlayersArray] = useState([]);
	// const [squadMembersArray, setSquadMembersArray] = useState([]);
	const [isVisibleModalAddPlayer, setIsVisibleModalAddPlayer] = useState(false);
	const [isVisibleRemovePlayerModal, setIsVisibleRemovePlayerModal] =
		useState(false);
	const [isVisibleInviteToSquadModal, setIsVisibleInviteToSquadModal] =
		useState(false);

	// Triggers whenever the screen is focused
	useFocusEffect(
		useCallback(() => {
			fetchPlayers();
			fetchSquadMembers();
		}, [])
	);

	const isAdminOfThisTeam = userReducer.contractTeamUserArray.filter(
		(team) =>
			team.teamId ===
			teamReducer.teamsArray.filter((team) => team.selected)[0].id
	)[0]?.isAdmin;

	const topChildren = (
		<Text>
			{teamReducer.teamsArray.filter((team) => team.selected)[0].teamName}{" "}
			Settings
		</Text>
	);

	const fetchPlayers = async () => {
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/players/team/${
				teamReducer.teamsArray.find((tribe) => tribe.selected)?.id
			}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userReducer.token}`,
				},
			}
		);

		console.log("Received response:", response.status);

		let resJson = null;
		const contentType = response.headers.get("Content-Type");

		if (contentType?.includes("application/json")) {
			resJson = await response.json();
		}

		if (response.ok && resJson) {
			console.log(`response ok`);
			setPlayersArray(resJson.playersArray);
		} else {
			const errorMessage =
				resJson?.error ||
				`There was a server error (and no resJson): ${response.status}`;
			alert(errorMessage);
		}
	};

	const fetchSquadMembers = async () => {
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/contract-team-users/${
				teamReducer.teamsArray.find((tribe) => tribe.selected)?.id
			}`,
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

		if (response.ok && resJson) {
			// console.log(`response ok - squadMembersArray`);
			// console.log(resJson);
			// setSquadMembersArray(resJson.squadArray);
			dispatch(updateSquadMembersArray(resJson.squadArray));
		} else {
			const errorMessage =
				resJson?.error ||
				`There was a server error (and no resJson): ${response.status}`;
			alert(errorMessage);
		}
	};

	const updateTeamVisibility = async (visibility) => {
		// console.log(`---> update Team Visibility status: ${visibility}`);

		const bodyObj = {
			teamId: teamReducer.teamsArray.filter((team) => team.selected)[0].id,
			visibility: visibility,
		};
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/teams/update-visibility`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userReducer.token}`,
				},
				body: JSON.stringify(bodyObj),
			}
		);
		let resJson = null;
		const contentType = response.headers.get("Content-Type");
		if (contentType?.includes("application/json")) {
			resJson = await response.json();
		}

		if (response.ok && resJson) {
			const updatedTeams = teamReducer.teamsArray.map((team) =>
				team.selected ? { ...team, visibility } : team
			);
			dispatch(updateTeamsArray(updatedTeams));
		} else {
			const errorMessage =
				resJson?.error ||
				`There was a server error (and no resJson): ${response.status}`;
			alert(errorMessage);
		}
	};

	const handleSelectVisibility = (visibility) => {
		updateTeamVisibility(visibility); // Trigger your function
		setShowVisibilityOptions(false); // Close dropdown
		if (visibility === "On invitation") {
			// alert("On invitation");
			console.log("----> On invitation");
			setIsVisibleInviteToSquadModal(true);
		}
	};

	const whichModalToDisplay = () => {
		if (isVisibleModalAddPlayer) {
			return {
				modalComponent: <ModalAddPlayer addPlayerToTeam={addPlayerToTeam} />,
				useState: isVisibleModalAddPlayer,
				useStateSetter: setIsVisibleModalAddPlayer,
			};
		}

		if (isVisibleInviteToSquadModal) {
			return {
				modalComponent: (
					<ModalAdminSettingsInviteToSquad onPressYes={handleInviteToSquad} />
				),
				useState: isVisibleInviteToSquadModal,
				useStateSetter: setIsVisibleInviteToSquadModal,
			};
		}
	};

	const addPlayerToTeam = async (playerObject) => {
		const filteredPlayers = teamReducer.playersArray.filter(
			(item) => item.name !== "Add Player"
		);

		const updatedArray = [...filteredPlayers, playerObject];

		updatedArray.push({
			name: "Add Player",
			shirtNumber: 9999,
			position: "",
		});

		const bodyObj = {
			teamId: teamReducer.teamsArray.filter((team) => team.selected)[0].id,
			firstName: playerObject.firstName,
			lastName: playerObject.lastName,
			shirtNumber: playerObject.shirtNumber,
			position: playerObject.position,
			positionAbbreviation: playerObject.positionAbbreviation,
		};
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/teams/add-player`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userReducer.token}`,
				},
				body: JSON.stringify(bodyObj),
			}
		);
		let resJson = null;
		const contentType = response.headers.get("Content-Type");
		if (contentType?.includes("application/json")) {
			resJson = await response.json();
		}

		if (response.ok && resJson) {
			fetchPlayers();
		} else {
			const errorMessage =
				resJson?.error ||
				`There was a server error (and no resJson): ${response.status}`;
			alert(errorMessage);
		}

		setIsVisibleModalAddPlayer(false);
	};

	const handleRemovePlayer = async (playerObject) => {
		console.log("--- removed Player ----");
		console.log(JSON.stringify(playerObject));
		const bodyObj = {
			teamId: teamReducer.teamsArray.filter((team) => team.selected)[0].id,
			playerId: playerObject.id,
		};
		console.log("--- removed Player ----");
		console.log(JSON.stringify(bodyObj));
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/teams/player`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userReducer.token}`,
				},
				body: JSON.stringify(bodyObj),
			}
		);
		let resJson = null;
		const contentType = response.headers.get("Content-Type");
		if (contentType?.includes("application/json")) {
			resJson = await response.json();
		}

		if (response.ok && resJson) {
			Alert.alert("Player removed successfully");
			fetchPlayers();
		} else {
			const errorMessage =
				resJson?.error ||
				`There was a server error (and no resJson): ${response.status}`;
			alert(errorMessage);
		}

		setIsVisibleRemovePlayerModal(false);
	};

	const handleInviteToSquad = async (emailString) => {
		console.log("----> handleInviteToSquad");

		const bodyObj = {
			teamId: teamReducer.teamsArray.filter((team) => team.selected)[0].id,
			email: emailString,
		};
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/contract-team-users/add-squad-member`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userReducer.token}`,
				},
				body: JSON.stringify(bodyObj),
			}
		);
		let resJson = null;
		const contentType = response.headers.get("Content-Type");
		if (contentType?.includes("application/json")) {
			resJson = await response.json();
		}

		if (response.ok && resJson) {
			// fetchPlayers();
			fetchSquadMembers();

			if (response.status === 201) {
				Alert.alert("Squad member added successfully");
			} else {
				Alert.alert("Sent invitation email to non-registered user");
			}
		} else {
			const errorMessage =
				resJson?.error ||
				`There was a server error (and no resJson): ${response.status}`;
			alert(errorMessage);
		}

		setIsVisibleInviteToSquadModal(false);
	};

	const confirmDeletePlayer = (player) => {
		// keep your global selection in sync if other parts read it
		dispatch(updateSelectedPlayerObject(player));

		// Use the reducer value if present; otherwise fall back to the tapped item
		const idForMsg = teamReducer.selectedPlayerObject?.id ?? player.id;
		const firstName =
			teamReducer.selectedPlayerObject?.firstName ?? player.firstName;
		const lastName =
			teamReducer.selectedPlayerObject?.lastName ?? player.lastName;

		Alert.alert(
			"Are you sure?",
			`you want to delete ${firstName} ${lastName} (player id: ${idForMsg})?`,
			[
				{ text: "No", style: "cancel" },
				{
					text: "Yes",
					style: "destructive",
					onPress: () => handleRemovePlayer(player),
				},
			],
			{ cancelable: true }
		);
	};

	const confirmDeleteSquadMember = (contractTeamUserObject) => {
		Alert.alert(
			"Are you sure?",
			`you want to delete ${contractTeamUserObject.username} (user id: ${contractTeamUserObject.userId}) from the squad?`,
			[
				{ text: "No", style: "cancel" },
				{
					text: "Yes",
					style: "destructive",
					onPress: () => handleRemoveSquadMember(contractTeamUserObject),
				},
			],
			{ cancelable: true }
		);
	};

	const handleRemoveSquadMember = async (contractTeamUserObject) => {
		// console.log("--- removed Player ----");
		// console.log(JSON.stringify(playerObject));
		const bodyObj = {
			contractTeamUserId: contractTeamUserObject.id,
		};
		console.log("--- removed Player ----");
		console.log(JSON.stringify(bodyObj));
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/contract-team-users/`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userReducer.token}`,
				},
				body: JSON.stringify(bodyObj),
			}
		);
		let resJson = null;
		const contentType = response.headers.get("Content-Type");
		if (contentType?.includes("application/json")) {
			resJson = await response.json();
		}

		if (response.ok && resJson) {
			Alert.alert("Squad member removed successfully");
			fetchSquadMembers();
		} else {
			const errorMessage =
				resJson?.error ||
				`There was a server error (and no resJson): ${response.status}`;
			alert(errorMessage);
		}

		// setIsVisibleRemovePlayerModal(false);
	};

	return (
		<TemplateViewWithTopChildrenSmall
			navigation={navigation}
			topChildren={topChildren}
			screenName={"AdminSettings"}
			modalComponentAndSetterObject={whichModalToDisplay()}
			topHeight={"15%"}
		>
			<View style={styles.container}>
				{/* -------- 
            TOP 
            ----- */}
				<View style={styles.containerTop}>
					<View style={styles.vwContainerTopInner}>
						{/* <Text> {process.env.EXPO_PUBLIC_API_BASE_URL}</Text> */}
						<View style={styles.vwTeamName}>
							<Text style={styles.txtTeamNameTitle}>Team Name</Text>
							<Text style={styles.txtTeamNameValue}>
								{
									teamReducer.teamsArray.filter((team) => team.selected)[0]
										.teamName
								}
							</Text>
						</View>
						<View style={styles.vwTeamDescription}>
							<Text style={styles.txtTeamDescriptionTitle}>Description</Text>
							<Text style={styles.txtTeamDescriptionValue}>
								{
									teamReducer.teamsArray.filter((team) => team.selected)[0]
										.description
								}
							</Text>
						</View>
						{isAdminOfThisTeam && (
							<View style={styles.vwTeamVisibility}>
								<Text style={styles.txtTeamVisibilityTitle}>Visibility</Text>
								<View
									style={[
										styles.touchableOpacityVisibilityCapsule,
										styles.vwDropdownOptionCapsule,
									]}
									onPress={() =>
										setShowVisibilityOptions(!showVisibilityOptions)
									}
								>
									{teamReducer.teamsArray.filter((team) => team.selected)[0]
										.visibility === "On invitation" ? (
										<TouchableOpacity
											onPress={() => handleSelectVisibility("On invitation")}
										>
											<Text style={styles.txtVisibilityCapsule}>
												{
													teamReducer.teamsArray.filter(
														(team) => team.selected
													)[0].visibility
												}
											</Text>
										</TouchableOpacity>
									) : (
										<Text style={styles.txtVisibilityCapsule}>
											{
												teamReducer.teamsArray.filter(
													(team) => team.selected
												)[0].visibility
											}
										</Text>
									)}

									{showVisibilityOptions ? (
										<TouchableOpacity
											onPress={() => setShowVisibilityOptions(false)}
											style={{ padding: 5 }}
										>
											<BtnVisibilityUp />
										</TouchableOpacity>
									) : (
										<TouchableOpacity
											onPress={() => setShowVisibilityOptions(true)}
											style={{ padding: 5 }}
										>
											<BtnVisibilityDown />
										</TouchableOpacity>
									)}
								</View>
								{showVisibilityOptions && (
									<View style={styles.vwVisibilityDropdown}>
										{[
											{ type: "Public", value: "Anyone can join" },
											{
												type: "On invitation",
												value: "Only people with link can join",
											},
											{ type: "Private", value: "No one can join" },
										]
											.filter(
												(option) =>
													option.type !==
													teamReducer.teamsArray.filter(
														(team) => team.selected
													)[0].visibility
											)
											.map((option) => (
												<TouchableOpacity
													key={option.type}
													style={styles.touchableOpacityDropdownOption}
													onPress={() => {
														handleSelectVisibility(option.type);
													}}
												>
													{/* <View style={styles.vwDropdownOption}> */}
													<View style={styles.vwDropdownOptionCapsule}>
														<Text style={styles.txtDropdownOption}>
															{option.type}
														</Text>
													</View>
													<Text style={styles.txtDropdownOptionValue}>
														{option.value}
													</Text>
													{/* </View> */}
												</TouchableOpacity>
											))}
									</View>
								)}
							</View>
						)}
					</View>
				</View>
				{/* -------- 
            BOTTOM 
            ----- */}
				<View style={styles.containerBottom}>
					<View style={styles.vwPlayersGroup}>
						<View style={styles.vwTableHeading}>
							<View style={styles.vwTableHeadingLeft}>
								<Text style={{ fontWeight: "bold", fontSize: 16 }}>
									Team Roster
								</Text>
								<Text> ({playersArray.length})</Text>
							</View>
							<View style={styles.vwTableHeadingRight}>
								<ButtonKvNoDefault
									onPress={() => {
										console.log("Search");
									}}
									styleView={styles.btnSearch}
								>
									<IconMagnifingGlass />
								</ButtonKvNoDefault>
								<ButtonKvNoDefaultTextOnly
									onPress={() => {
										console.log("Add");
										setIsVisibleModalAddPlayer(true);
									}}
									styleView={styles.btnAddElement}
									styleText={styles.txtBtnAddElement}
								>
									+
								</ButtonKvNoDefaultTextOnly>
							</View>
						</View>
						<View style={styles.vwPlayersTable}>
							<FlatList
								data={playersArray}
								keyExtractor={(item, index) =>
									item.id?.toString() || index.toString()
								}
								renderItem={({ item }) => (
									<TouchableOpacity
										style={styles.vwPlayerRow}
										onPress={() => {
											// Navigate to AdminSettingsPlayerCard
											navigation.navigate("AdminSettingsPlayerCard", {
												playerObject: item,
											});
										}}
										onLongPress={() => {
											if (!isAdminOfThisTeam) {
												return;
											}
											confirmDeletePlayer(item);
											// setIsVisibleRemovePlayerModal(true);
											// dispatch(updateSelectedPlayerObject(item));
										}}
										delayLongPress={500} // optional: control long press timing
									>
										<View style={styles.vwPlayerShirtNumber}>
											<Text style={styles.txtPlayerShirtNumber}>
												{item.shirtNumber}
											</Text>
										</View>
										<View style={styles.vwPlayerName}>
											<Text style={styles.txtPlayerName}>
												{item.firstName} {item.lastName}
											</Text>
										</View>
										<View style={styles.vwPlayerPosition}>
											<Text style={styles.txtPlayerPosition}>
												{item.positionAbbreviation}
											</Text>
										</View>
									</TouchableOpacity>
								)}
							/>
						</View>
					</View>
					{isAdminOfThisTeam && (
						<View style={styles.vwSquadMembersGroup}>
							<View style={styles.vwTableHeading}>
								<View style={styles.vwTableHeadingLeft}>
									<Text style={{ fontWeight: "bold", fontSize: 16 }}>
										Squad Members
									</Text>
									<Text> ({teamReducer.squadMembersArray?.length})</Text>
								</View>
								<View style={styles.vwTableHeadingRight}>
									<ButtonKvNoDefault
										onPress={() => {
											console.log("Search");
										}}
										styleView={styles.btnSearch}
									>
										<IconMagnifingGlass />
									</ButtonKvNoDefault>
									<ButtonKvNoDefaultTextOnly
										onPress={() => {
											console.log("Add");
											isAdminOfThisTeam && setIsVisibleInviteToSquadModal(true);
										}}
										styleView={styles.btnAddElement}
										styleText={styles.txtBtnAddElement}
									>
										+
									</ButtonKvNoDefaultTextOnly>
								</View>
							</View>
							<View style={styles.vwSquadMembersTable}>
								<FlatList
									data={teamReducer.squadMembersArray}
									keyExtractor={(item, index) =>
										item.id?.toString() || index.toString()
									}
									renderItem={({ item }) => (
										<TouchableOpacity
											onPress={() => {
												// console.log("- clicked on squad member -");
												// console.log(item);
												navigation.navigate("AdminSettingsUserCard", {
													userObject: item,
												});
											}}
											onLongPress={() => {
												confirmDeleteSquadMember(item);
											}}
											delayLongPress={500} // optional: control long press timing
											style={styles.vwSquadMembersRow}
										>
											<View style={styles.vwSquadMembersUserName}>
												<Text style={styles.txtSquadMembersUserName}>
													{item?.username}
												</Text>
											</View>
											{item?.isPlayer && (
												<View style={styles.vwSquadMembersPlayer}>
													<Text style={styles.txtSquadMembersPlayer}>
														Player
													</Text>
												</View>
											)}
											{item?.isCoach && (
												<View style={styles.vwSquadMembersPlayer}>
													<Text style={styles.txtSquadMembersPlayer}>
														Coach
													</Text>
												</View>
											)}
											{item?.isAdmin && (
												<View style={styles.vwSquadMembersAdmin}>
													<Text style={styles.txtSquadMembersAdmin}>Admin</Text>
												</View>
											)}
										</TouchableOpacity>
									)}
								/>
							</View>
						</View>
					)}
				</View>
			</View>
		</TemplateViewWithTopChildrenSmall>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		// backgroundColor: "gray",
	},
	// ------------
	// Top
	// ------------
	containerTop: {
		// flex: 1,
		width: "100%",
		// borderColor: "gray",
		// borderWidth: 1,
		// borderStyle: "dashed",
	},
	vwContainerTopInner: {
		padding: 20,
		width: "100%",
	},
	vwTeamName: {
		borderBottomColor: "gray",
		borderBottomWidth: 1,
		width: "100%",
		marginBottom: 10,
	},
	txtTeamNameTitle: {
		color: "gray",
		marginBottom: 5,
	},
	txtTeamNameValue: {
		fontSize: 16,
	},
	vwTeamDescription: {
		borderBottomColor: "gray",
		borderBottomWidth: 1,
		marginBottom: 10,
	},
	txtTeamDescriptionTitle: {
		color: "gray",
		marginBottom: 5,
	},
	txtTeamDescriptionValue: {
		fontSize: 16,
	},
	vwTeamVisibility: {
		width: "50%",
		marginBottom: 10,
	},
	touchableOpacityVisibilityCapsule: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 12,
		marginTop: 5,
	},
	txtVisibilityCapsule: {
		fontSize: 14,
	},
	arrow: {
		marginLeft: 8,
	},
	vwVisibilityDropdown: {
		position: "absolute",
		top: 50, // adjust for your layout
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 8,
		width: Dimensions.get("window").width * 0.8,
		zIndex: 10,
		elevation: 5,
	},
	touchableOpacityDropdownOption: {
		padding: 5,
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
	},
	vwDropdownOptionCapsule: {
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 20,
		backgroundColor: "#f5f5f5",
		width: Dimensions.get("window").width * 0.3,
		paddingLeft: 5,
		paddingVertical: 3,
	},
	txtDropdownOption: {
		fontSize: 14,
	},
	txtDropdownOptionValue: {
		fontSize: 12,
		color: "gray",
	},
	// ------------
	// Bottom
	// ------------
	containerBottom: {
		flex: 1,
		// borderColor: "gray",
		// borderWidth: 1,
		// borderStyle: "dashed",
		paddingBottom: Dimensions.get("window").height * 0.05,
	},
	vwTableHeading: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
	},
	vwTableHeadingLeft: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 20,
	},
	vwTableHeadingRight: {
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
	},
	btnSearch: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		height: 40,
		width: 40,
		borderRadius: 20,
		backgroundColor: "#E8E8E8",
		borderColor: "#806181",
		borderWidth: 1,
		// marginVertical: 3,
	},
	btnAddElement: {
		// width: Dimensions.get("window").width * 0.2,
		// height: 50,
		justifyContent: "center",
		alignItems: "center",
		height: 40,
		width: 40,
		borderRadius: 20,
		color: "white",
		backgroundColor: "#E8E8E8",
		borderColor: "#806181",
		borderWidth: 2,
	},
	txtBtnAddElement: {
		fontSize: 24,
		color: "#806181",
		// backgroundColor: "red",
		justifyContent: "center",
		alignItems: "center",
		// height: 15,
		// margin: 0,
		// lineHeight: 1,
	},
	vwPlayersGroup: {
		width: "100%",
		// backgroundColor: "red",
		flex: 1,
	},
	vwSquadMembersGroup: {
		width: "100%",
		// backgroundColor: "blue",
		flex: 1,
		// paddingBottom: Dimensions.get("window").height * 0.1,
	},

	// ---- Player Table styles ----
	vwPlayersTable: {
		// height: 200,
		flex: 1,
		borderColor: "gray",
		borderWidth: 1,
		borderStyle: "dashed",
		borderRadius: 20,
		marginHorizontal: 5,
		padding: 5,
		// marginBottom: Dimensions.get("window").height * 0.05,
		// backgroundColor: "green",
	},
	vwPlayerRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		gap: 5,
		height: 50,
		// backgroundColor: "green",
	},
	vwPlayerShirtNumber: {
		// flex: 1,
		height: "100%",
		width: 40,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 20,
		backgroundColor: "#f5f5f5",
	},
	txtPlayerShirtNumber: {
		fontWeight: "bold",
		fontSize: 16,
	},
	vwPlayerName: {
		height: "100%",
		flex: 1,
		paddingLeft: 10,
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 20,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
	},
	txtPlayerName: {
		fontSize: 16,
	},
	vwPlayerPosition: {
		height: "100%",
		width: 40,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 20,
		backgroundColor: "#f5f5f5",
	},
	txtPlayerPosition: {
		fontSize: 14,
		color: "gray",
	},

	// ---- Squad Members Table styles ----
	vwSquadMembersTable: {
		// height: 200,
		flex: 1,
		borderColor: "gray",
		borderWidth: 1,
		borderStyle: "dashed",
		borderRadius: 20,
		marginHorizontal: 5,
		padding: 5,
		// marginBottom: Dimensions.get("window").height * 0.05,
	},
	vwSquadMembersRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		gap: 5,
		height: 50,
		// backgroundColor: "green",
	},
	vwSquadMembersUserName: {
		// flex: 1,
		height: "100%",
		// width: 40,
		flex: 1,
		justifyContent: "center",
		// alignItems: "center",
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 20,
		backgroundColor: "#f5f5f5",
		paddingLeft: 10,
	},
	txtSquadMembersUserName: {
		// fontWeight: "bold",
		fontSize: 16,
	},
	vwSquadMembersName: {
		height: "100%",
		flex: 1,
		paddingLeft: 10,
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 20,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
	},
	txtSquadMembersName: {
		fontSize: 16,
	},
	vwSquadMembersPlayer: {
		borderWidth: 1,
		borderColor: "gray",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 30,
		padding: 5,
	},
	vwSquadMembersCoach: {
		height: "100%",
		width: 40,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 20,
		// backgroundColor: "#f5f5f5",
	},
	txtSquadMembersPlayer: {
		color: "gray",
		fontSize: 16,
		fontWeight: "bold",
	},
	txtSquadMembersCoach: {
		fontSize: 14,
		color: "gray",
	},

	vwSquadMembersAdmin: {
		// height: 40,
		// width: 80,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 30,
		backgroundColor: "#806181",
		padding: 5,
	},
	txtSquadMembersAdmin: {
		fontSize: 16,
		color: "white",
		// lineHeight: 20,
		fontWeight: "bold",
	},

	// ------------
	// Modal
	// ------------

	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},

	modalContainer: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 10,
	},
});
