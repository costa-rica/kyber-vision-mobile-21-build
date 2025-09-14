import {
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	TouchableOpacity,
	Alert,
	ImageBackground,
} from "react-native";
import TemplateViewWithTopChildrenSmall from "./subcomponents/TemplateViewWithTopChildrenSmall";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import BtnVisibilityDown from "../assets/images/buttons/btnVisibilityDown.svg";
import BtnVisibilityUp from "../assets/images/buttons/btnVisibilityUp.svg";
import BtnUserCardRemoveUser from "../assets/images/adminSettings/btnUserCardRemoveUser.svg";
import { updateSquadMembersArray } from "../reducers/team";
import ModalAdminSettingsPlayerCardLinkUser from "./subcomponents/modals/ModalAdminSettingsPlayerCardLinkUser";
import ModalAdminSettingsDeletePlayerUserLinkYesNo from "./subcomponents/modals/ModalAdminSettingsDeletePlayerUserLinkYesNo";

export default function AdminSettingsUserCard({ navigation, route }) {
	const [userObject, setUserObject] = useState(route.params.userObject);
	const userReducer = useSelector((state) => state.user);
	const teamReducer = useSelector((state) => state.team);
	// const [localImageUri, setLocalImageUri] = useState(null);
	const [isVisibleLinkUserModal, setIsVisibleLinkUserModal] = useState(false);
	const [
		isVisibleDeletePlayerUserLinkModal,
		setIsVisibleDeletePlayerUserLinkModal,
	] = useState(false);
	const isAdminOfThisTeam = userReducer.contractTeamUserArray.filter(
		(team) =>
			team.teamId ===
			teamReducer.teamsArray.filter((team) => team.selected)[0].id
	)[0].isAdmin;
	const [showRolesOptions, setShowRolesOptions] = useState(false);
	const [rolesArray, setRolesArray] = useState([]);
	const dispatch = useDispatch();
	const topChildren = (
		<Text>
			{teamReducer.teamsArray.filter((team) => team.selected)[0].teamName}{" "}
			Settings
		</Text>
	);

	const whichModalToDisplay = () => {
		if (isVisibleLinkUserModal) {
			return {
				modalComponent: (
					<ModalAdminSettingsPlayerCardLinkUser
						// onPressYes={handleLinkUser}
						playerObject={playerObject}
						setIsVisibleLinkUserModal={setIsVisibleLinkUserModal}
						setPlayerObject={setPlayerObject}
					/>
				),
				useState: isVisibleLinkUserModal,
				useStateSetter: setIsVisibleLinkUserModal,
			};
		}
		if (isVisibleDeletePlayerUserLinkModal) {
			return {
				modalComponent: (
					<ModalAdminSettingsDeletePlayerUserLinkYesNo
						// onPressYes={handleLinkUser}
						playerObject={playerObject}
						setIsVisibleDeletePlayerUserLinkModal={
							setIsVisibleDeletePlayerUserLinkModal
						}
						setPlayerObject={setPlayerObject}
					/>
				),
				useState: isVisibleDeletePlayerUserLinkModal,
				useStateSetter: setIsVisibleDeletePlayerUserLinkModal,
			};
		}
	};

	useEffect(() => {
		const tempRoles = [];
		if (userObject.isAdmin) tempRoles.push("Admin");
		if (userObject.isCoach) tempRoles.push("Coach");
		if (userObject.isPlayer) tempRoles.push("Player");
		tempRoles.push("Member");
		setRolesArray(tempRoles);
	}, [userObject]);

	const handleSelectRole = async (role) => {
		if (role === "Admin" && userObject.email === userReducer.user.email) {
			alert(
				"You cannot modify your own admin status. Another admin must do this."
			);
			return;
		}
		const bodyObj = {
			teamId: teamReducer.teamsArray.filter((team) => team.selected)[0].id,
			role: role,
			userId: userObject.userId,
		};
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/contract-team-users/toggle-role`,
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
			// const updatedTeams = teamReducer.teamsArray.map((team) =>
			//   team.selected ? { ...team, visibility } : team
			// );
			// dispatch(updateTeamsArray(updatedTeams));
			const updatedUserObject = {
				...userObject,
				isAdmin: resJson.contractTeamUser.isAdmin,
				isCoach: resJson.contractTeamUser.isCoach,
				// isPlayer: resJson.contractTeamUser.isPlayer,
			};

			const updatedSquadMembersArray = teamReducer.squadMembersArray.map(
				(user) => (user.userId === userObject.userId ? updatedUserObject : user)
			);
			dispatch(updateSquadMembersArray(updatedSquadMembersArray));

			// alert("Role updated successfully")
			setUserObject(updatedUserObject);
			setShowRolesOptions(false);
		} else {
			const errorMessage =
				resJson?.error ||
				`There was a server error (and no resJson): ${response.status}`;
			alert(errorMessage);
		}

		// alert(role);
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
					onPress: () => {
						handleRemoveSquadMember(contractTeamUserObject);
						navigation.goBack();
					},
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
			// fetchSquadMembers();
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
			screenName={"AdminSettingsUserCard"}
			modalComponentAndSetterObject={whichModalToDisplay()}
			topHeight={"15%"}
		>
			<View style={styles.container}>
				<View style={styles.containerTop}>
					<View style={styles.vwUserNameAndShirtNumber}>
						<View style={styles.vwUserRight}>
							<Text style={styles.txtUserName}>{userObject.username}</Text>
						</View>
					</View>
					<View style={styles.vwUserImage}>
						<Image
							source={require("../assets/images/iconMissingProfilePicture.png")}
							style={styles.imgUser}
						/>
					</View>
				</View>
				<ImageBackground
					source={require("../assets/images/AdminSettingsPlayerCardWaveThing.png")}
					style={styles.vwUserRolesWaveThing}
				>
					<View style={styles.vwUserLabels}>
						{rolesArray.map((role) => (
							<View key={role} style={styles.vwUserLabel}>
								<Text style={styles.txtUserLabel}>{role}</Text>
							</View>
						))}
					</View>
				</ImageBackground>
				<View style={styles.containerMiddle}>
					{isAdminOfThisTeam && (
						<View style={styles.vwTeamRole}>
							{/* <Text style={styles.txtTeamRoleTitle}>Role</Text> */}
							<TouchableOpacity
								style={[
									styles.touchableOpacityRoleCapsule,
									styles.vwDropdownOptionCapsule,
								]}
								onPress={() => setShowRolesOptions(!showRolesOptions)}
							>
								<View>
									<Text style={styles.txtRoleCapsule}>Select role ...</Text>
								</View>
								<View style={{ padding: 5 }}>
									{showRolesOptions ? (
										<BtnVisibilityUp />
									) : (
										<BtnVisibilityDown />
									)}
								</View>
							</TouchableOpacity>
							{/* </View> */}
							{showRolesOptions && (
								<View style={styles.vwRoleDropdown}>
									{[
										{ type: "Admin", value: "Full rights over team" },
										// {
										//   type: "Member",
										//   value: "",
										// },
										{ type: "Coach", value: "" },
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
													handleSelectRole(option.type);
												}}
											>
												<View
													style={[
														styles.vwDropdownOptionCapsule,
														rolesArray.includes(option.type)
															? styles.vwDropdownOptionCapsuleSelected
															: null,
													]}
												>
													<Text style={styles.txtDropdownOption}>
														{option.type}
													</Text>
												</View>
												<Text style={styles.txtDropdownOptionValue}>
													{option.value}
												</Text>
											</TouchableOpacity>
										))}
								</View>
							)}
						</View>
					)}

					{/* <Text style={{ fontSize: 11 }}> {JSON.stringify(userObject)}</Text>
          <ScrollView>
          <Text>
          {" "}
          {JSON.stringify(teamReducer.squadMembersArray, null, 2)}
          </Text>
          </ScrollView> */}
				</View>
				<View style={styles.containerBottom}>
					<View style={styles.vwRemoveUserButtonContainer}>
						{/* <Text style={styles.txtRemoveUser}>Remove User</Text> */}
						<TouchableOpacity
							style={styles.btnRemoveUser}
							onPress={() => {
								// alert("Remove user");
								confirmDeleteSquadMember(userObject);
							}}
						>
							<BtnUserCardRemoveUser />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</TemplateViewWithTopChildrenSmall>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
	},
	// ------------
	// Top
	// ------------
	containerTop: {
		// flex: 1,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		zIndex: 1,
		paddingTop: 10,
		// paddingRight: 5,
		// borderColor: "gray",
		// borderWidth: 1,
		// borderStyle: "dashed",
	},
	vwUserTop: {
		flexDirection: "row",
	},
	vwUserNameAndShirtNumber: {
		flexDirection: "row",
		flex: 1,
		gap: 10,
		padding: 5,
		marginTop: 20,
		marginLeft: 30,
	},
	vwUserLeft: {
		justifyContent: "center",
		backgroundColor: "#806181",
		borderRadius: 30,
		height: 60,
		width: 60,
		alignItems: "center",
		justifyContent: "center",
	},

	vwUserRight: {
		// alignItems: "center",
		justifyContent: "center",
	},
	txtUserName: {
		// textAlign: "center",
		color: "#6E4C84",
		fontSize: 24,
		fontFamily: "ApfelGrotezkSemiBold",
	},
	vwUserImage: {
		width: 120,
		height: 120,
		borderRadius: 60,
		overflow: "hidden",
		// backgroundColor: "green",
	},
	imgUser: {
		width: "90%",
		height: "90%",
		resizeMode: "cover",
	},
	vwUserRolesWaveThing: {
		// flexDirection: "row",
		// flexWrap: "wrap",
		// alignItems: "flex-start",
		width: Dimensions.get("window").width,
		height: 100,
		marginTop: -50,
		padding: 10,
	},
	vwUserLabels: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "flex-start",
		width: Dimensions.get("window").width * 0.5,
		height: 100,
		gap: 5,
		// marginTop: -50,
		// padding: 10,
	},
	vwUserLabel: {
		// height: 40,
		// width: 80,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 30,
		backgroundColor: "#806181",
		padding: 5,
	},
	txtUserLabel: {
		fontSize: 20,
		color: "white",
		lineHeight: 20,
	},

	// ------------
	// Middle
	// ------------
	containerMiddle: {
		width: "100%",
		padding: 20,
		flex: 1,
		// borderWidth: 1,
		// borderColor: "gray",
		// borderStyle: "dashed",
	},

	// vwTeamRole: {
	//   width: "50%",
	//   marginBottom: 10,
	// },
	touchableOpacityRoleCapsule: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 12,
		marginTop: 5,
	},
	txtRoleCapsule: {
		fontSize: 14,
	},
	arrow: {
		marginLeft: 8,
	},
	vwRoleDropdown: {
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
		width: Dimensions.get("window").width * 0.4,
		paddingLeft: 5,
		paddingVertical: 3,
	},
	vwDropdownOptionCapsuleSelected: {
		backgroundColor: "#806181",
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
		width: "100%",
		padding: 20,
		paddingBottom: 50,
		// borderWidth: 1,
		// borderColor: "gray",
		// borderStyle: "dashed",
	},
	vwRemoveUserButtonContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		gap: 10,
	},
});
