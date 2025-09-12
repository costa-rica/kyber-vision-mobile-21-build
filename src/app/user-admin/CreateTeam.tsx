import {
	StyleSheet,
	Text,
	View,
	FlatList,
	TouchableOpacity,
	TextInput,
	Alert,
	ViewStyle,
	TextStyle,
	ListRenderItem,
} from "react-native";
import ScreenFrameWithTopChildrenSmall from "../../components/screen-frames/ScreenFrameWithTopChildrenSmall";
import ButtonKvStd from "../../components/buttons/ButtonKvStd";
import ButtonKvNoDefaultTextOnly from "../../components/buttons/ButtonKvNoDefaultTextOnly";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ModalTeamAddPlayer from "../../components/modals/ModalTeamAddPlayer";
import ModalTeamYesNo from "../../components/modals/ModalTeamYesNo";
import {
	updatePlayersArray,
	updateSelectedPlayerObject,
	updateTeamDetails,
	clearTeamReducer,
	updateTeamsArray,
	Player,
	TeamDetails,
} from "../../reducers/team";
import { RootState } from "../../types/store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

type CreateTeamProps = NativeStackScreenProps<RootStackParamList, "CreateTeam">;

interface PlayerWithAddOption extends Player {
	name?: string;
	positionAbbreviation?: string;
}

interface PlayerObject {
	firstName: string;
	lastName: string;
	shirtNumber: string | null;
	position: string;
	positionAbbreviation: string;
	name?: string;
}

export default function CreateTeam({ navigation }: CreateTeamProps) {
	const userReducer = useSelector((state: RootState) => state.user);
	const teamReducer = useSelector((state: RootState) => state.team);
	const dispatch = useDispatch();

	const [isVisibleModalTeamAddPlayer, setIsVisibleModalTeamAddPlayer] =
		useState(false);
	const [isVisibleRemovePlayerModal, setIsVisibleRemovePlayerModal] =
		useState(false);

	const topChildren = (
		<View style={styles.vwTopChildren}>
			<Text style={styles.txtTopChildren}> Create a Team</Text>
		</View>
	);

	const teamTablePlayerRow: ListRenderItem<PlayerWithAddOption> = ({
		item,
	}) => {
		if (item.firstName === "Add Player" && item.id === 9999) {
			return (
				<View style={styles.vwPlayerRowAddPlayerButton}>
					<ButtonKvNoDefaultTextOnly
						onPress={() => setIsVisibleModalTeamAddPlayer(true)}
						styleView={styles.btnAddPlayer}
						styleText={styles.btnAddPlayerText}
					>
						+
					</ButtonKvNoDefaultTextOnly>
				</View>
			);
		}
		return (
			<TouchableOpacity
				style={styles.vwPlayerRow}
				onPress={() => {
					dispatch(updateSelectedPlayerObject(item));
					setIsVisibleRemovePlayerModal(true);
				}}
			>
				<View style={[styles.vwPlayerRowCircle, styles.vwPlayerRowLeft]}>
					<Text style={styles.txtPlayerName}>{item.shirtNumber}</Text>
				</View>
				<View style={[styles.vwPlayerRowCircle, styles.vwPlayerRowMiddle]}>
					<Text style={styles.txtPlayerName}>
						{item.firstName} {item.lastName}
					</Text>
				</View>
				<View style={[styles.vwPlayerRowCircle, styles.vwPlayerRowRight]}>
					<Text style={styles.txtPlayerName}>{item.positionAbbreviation}</Text>
				</View>
			</TouchableOpacity>
		);
	};

	const addPlayerToTeam = (playerObject: PlayerObject) => {
		const filteredPlayers = teamReducer.playersArray.filter(
			(item) =>
				(item as PlayerWithAddOption).firstName !== "Add Player" &&
				(item as PlayerWithAddOption).id !== 9999
		);

		const newPlayer: PlayerWithAddOption = {
			id: Date.now(),
			firstName: playerObject.firstName,
			lastName: playerObject.lastName,
			shirtNumber: parseInt(playerObject.shirtNumber || "0"),
			birthDate: "",
			selected: false,
			positionAbbreviation: playerObject.positionAbbreviation,
		};

		const updatedArray = [...filteredPlayers, newPlayer];

		updatedArray.push({
			id: 9999,
			firstName: "Add Player",
			lastName: "",
			shirtNumber: 9999,
			birthDate: "",
			selected: false,
			// name: "Add Player",
		});

		dispatch(updatePlayersArray(updatedArray));
		setIsVisibleModalTeamAddPlayer(false);
	};

	const handleCreateTeam = async () => {
		console.log("handleCreateTeam");
		const playersArrayMinusAddPlayer = teamReducer.playersArray.filter(
			(item) =>
				(item as PlayerWithAddOption).firstName !== "Add Player" &&
				(item as PlayerWithAddOption).id !== 9999
		);

		if (playersArrayMinusAddPlayer.length === 0) {
			alert("Please add at least one player to the team.");
			return;
		}
		if (
			teamReducer.teamDetails?.teamName === "" ||
			!teamReducer.teamDetails?.teamName
		) {
			alert("Please enter a team name.");
			return;
		}

		const bodyObj = {
			teamName: teamReducer.teamDetails?.teamName,
			description: (teamReducer.teamDetails as any)?.teamDescription || "",
			playersArray: playersArrayMinusAddPlayer,
		};

		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/teams/create`,
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
			let tempArray = [...teamReducer.teamsArray];
			tempArray.push(resJson.teamNew);
			dispatch(updateTeamsArray(tempArray));
			Alert.alert("Team created successfully", "", [
				{
					text: "OK",
					onPress: () => navigation.goBack(),
				},
			]);
		} else {
			const errorMessage =
				resJson?.error ||
				`There was a server error (and no resJson): ${response.status}`;
			alert(errorMessage);
		}
	};

	const handleRemovePlayer = () => {
		const filteredPlayers = teamReducer.playersArray.filter((item) => {
			console.log(
				"item.shirtNumber !== playerObject.shirtNumber",
				item.shirtNumber !== teamReducer.selectedPlayerObject?.shirtNumber
			);
			return item.shirtNumber !== teamReducer.selectedPlayerObject?.shirtNumber;
		});
		dispatch(updatePlayersArray(filteredPlayers));
		setIsVisibleRemovePlayerModal(false);
	};

	const whichModalToDisplay = () => {
		if (isVisibleModalTeamAddPlayer) {
			return {
				modalComponent: (
					<ModalTeamAddPlayer addPlayerToTeam={addPlayerToTeam} />
				),
				useState: isVisibleModalTeamAddPlayer,
				useStateSetter: () => setIsVisibleModalTeamAddPlayer(false),
			};
		}

		if (isVisibleRemovePlayerModal) {
			return {
				modalComponent: <ModalTeamYesNo onPressYes={handleRemovePlayer} />,
				useState: isVisibleRemovePlayerModal,
				useStateSetter: () => setIsVisibleRemovePlayerModal(false),
			};
		}

		return undefined;
	};

	return (
		<ScreenFrameWithTopChildrenSmall
			navigation={navigation}
			topChildren={topChildren}
			onBackPress={() => {
				dispatch(clearTeamReducer());
				return true;
			}}
			modalComponentAndSetterObject={whichModalToDisplay()}
		>
			<View style={styles.container}>
				<View style={styles.containerTop}>
					<View style={styles.vwInputs}>
						<View style={styles.vwInputGroup}>
							<View style={styles.vwInputGroupLabelMultipleFonts}>
								<Text style={styles.txtInputGroupLabel}>Team name</Text>
								<Text style={styles.txtInputGroupLabelRequired}>*</Text>
							</View>
							<View style={styles.vwInputWrapper}>
								<TextInput
									placeholder="Région M Aix-en-Provence"
									placeholderTextColor="gray"
									value={teamReducer.teamDetails?.teamName || ""}
									onChangeText={(text) => {
										const updatedDetails: TeamDetails = {
											...teamReducer.teamDetails,
											id: teamReducer.teamDetails?.id || 0,
											teamName: text,
										};
										dispatch(updateTeamDetails(updatedDetails));
									}}
									style={
										teamReducer.teamDetails?.teamName !== "" &&
										teamReducer.teamDetails?.teamName
											? styles.txtInputRegular
											: styles.txtPlaceholder
									}
								/>
							</View>
						</View>
						<View style={styles.vwInputGroup}>
							<View style={styles.vwInputGroupLabelMultipleFonts}>
								<Text style={styles.txtInputGroupLabel}>Team description</Text>
							</View>
							<View style={styles.vwInputWrapper}>
								<TextInput
									placeholder="A team under the sun"
									placeholderTextColor="gray"
									value={
										(teamReducer.teamDetails as any)?.teamDescription || ""
									}
									onChangeText={(text) => {
										const updatedDetails = {
											...teamReducer.teamDetails,
											id: teamReducer.teamDetails?.id || 0,
											teamName: teamReducer.teamDetails?.teamName || "",
											teamDescription: text,
										};
										dispatch(updateTeamDetails(updatedDetails));
									}}
									style={
										(teamReducer.teamDetails as any)?.teamDescription !== "" &&
										(teamReducer.teamDetails as any)?.teamDescription
											? styles.txtInputRegular
											: styles.txtPlaceholder
									}
								/>
							</View>
						</View>
					</View>
				</View>

				<View style={styles.containerBottom}>
					<Text style={styles.txtInputGroupLabel}>Team roster</Text>

					<View style={styles.vwRosterTable}>
						{teamReducer.playersArray.length > 0 ? (
							<FlatList
								data={teamReducer.playersArray as PlayerWithAddOption[]}
								renderItem={teamTablePlayerRow}
								keyExtractor={(item) => item.shirtNumber.toString()}
								style={styles.flatListTeamNames}
							/>
						) : (
							<Text>No players found</Text>
						)}

						{teamReducer.playersArray.length === 0 && (
							<View style={styles.vwNewPlayerWhenNoPlayers}>
								<ButtonKvNoDefaultTextOnly
									onPress={() => setIsVisibleModalTeamAddPlayer(true)}
									styleView={styles.btnAddPlayer}
									styleText={styles.btnAddPlayerText}
								>
									+
								</ButtonKvNoDefaultTextOnly>
							</View>
						)}
					</View>

					<ButtonKvStd
						onPress={() => {
							console.log("Create Team");
							handleCreateTeam();
						}}
						style={styles.btnTribe}
					>
						Create Team
					</ButtonKvStd>
				</View>
			</View>
		</ScreenFrameWithTopChildrenSmall>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDFDFD",
		width: "100%",
	} as ViewStyle,

	// ------------
	// Top Children
	// ------------
	vwTopChildren: {
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	} as ViewStyle,
	txtTopChildren: {
		color: "white",
		fontSize: 20,
		fontWeight: "bold",
	} as TextStyle,

	// ------------
	// Container Top
	// ------------
	containerTop: {
		backgroundColor: "#FDFDFD",
		width: "100%",
	} as ViewStyle,
	vwInputs: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	} as ViewStyle,
	vwInputGroup: {
		width: "90%",
		alignItems: "flex-start",
		marginTop: 10,
	} as ViewStyle,
	vwInputGroupLabelMultipleFonts: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	} as ViewStyle,
	txtInputGroupLabelRequired: {
		color: "red",
	} as TextStyle,
	vwInputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 30,
		paddingHorizontal: 10,
		backgroundColor: "#fff",
	} as ViewStyle,

	txtPlaceholder: {
		flex: 1,
		paddingVertical: 15,
		paddingHorizontal: 10,
		color: "gray",
		fontStyle: "italic",
	} as TextStyle,
	txtInputRegular: {
		flex: 1,
		paddingVertical: 15,
		paddingHorizontal: 10,
		color: "black",
		fontStyle: "normal",
	} as TextStyle,

	txtInputGroupLabel: {
		fontSize: 14,
		color: "#5B5B5B",
		paddingLeft: 15,
	} as TextStyle,
	vwIconButton: {
		padding: 5,
		marginRight: 8,
		borderRadius: 20,
		backgroundColor: "transparent",
	} as ViewStyle,

	// ------------
	// Container Bottom
	// ------------
	containerBottom: {
		flex: 1,
		alignItems: "center",
	} as ViewStyle,

	// ------------
	// Roster Table
	// ------------
	vwRosterTable: {
		width: "90%",
		height: "75%",
		alignItems: "center",
		justifyContent: "center",
		borderColor: "gray",
		borderWidth: 1,
		borderStyle: "dashed",
		borderRadius: 20,
		marginBottom: 20,
	} as ViewStyle,
	btnAddPlayer: {
		height: 40,
		width: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "gray",
	} as ViewStyle,
	btnAddPlayerText: {
		color: "gray",
		fontSize: 30,
	} as TextStyle,
	vwNewPlayerWhenNoPlayers: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	} as ViewStyle,
	vwPlayerRowAddPlayerButton: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	} as ViewStyle,
	vwPlayerRow: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 10,
		paddingVertical: 2,
		flexDirection: "row",
		gap: 5,
	} as ViewStyle,
	vwPlayerRowCircle: {
		borderWidth: 1,
		borderColor: "gray",
		borderStyle: "solid",
		borderRadius: 25,
		alignItems: "center",
		justifyContent: "center",
		height: 40,
	} as ViewStyle,
	vwPlayerRowLeft: {
		width: "13%",
	} as ViewStyle,
	vwPlayerRowMiddle: {
		width: "70%",
		alignItems: "flex-start",
		paddingLeft: 15,
	} as ViewStyle,
	vwPlayerRowRight: {
		width: "13%",
	} as ViewStyle,
	txtPlayerName: {
		color: "black",
	} as TextStyle,
	flatListTeamNames: {} as ViewStyle,
	btnTribe: {} as ViewStyle & TextStyle,
});
