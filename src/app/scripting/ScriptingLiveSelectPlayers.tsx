import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	FlatList,
	TouchableOpacity,
	Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import ScreenFrameWithTopChildrenSmall from "../../components/screen-frames/ScreenFrameWithTopChildrenSmall";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../types/store";
import ButtonKvNoDefaultTextOnly from "../../components/buttons/ButtonKvNoDefaultTextOnly";
import WarningTriangle from "../../assets/images/scripting/warningTriangle.svg";
import Tribe from "../../assets/images/welcome/Tribe.svg";
import {
	setScriptingForPlayerObject,
	updatePlayersArray,
	createPlayerArrayPositionProperties,
} from "../../reducers/script";
import { reducerSetUserSwipePadWheel } from "../../reducers/user";
import { scriptReducerOffline } from "../../data/scriptReducerOffline";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../types/navigation";

type ScriptingLiveSelectPlayersScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"ScriptingLiveSelectPlayers"
>;

interface PlayerTableButtonProps {
	player: {
		id: number;
		firstName: string;
		lastName: string;
		shirtNumber: number;
		positionArea?: number | null;
		selected?: boolean;
	};
}

export default function ScriptingLiveSelectPlayers({
	navigation,
}: ScriptingLiveSelectPlayersScreenProps) {
	const userReducer = useSelector((state: RootState) => state.user);
	const scriptReducer = useSelector((state: RootState) => state.script);
	const teamReducer = useSelector((state: RootState) => state.team);
	const dispatch = useDispatch<AppDispatch>();
	const [displayWarning, setDisplayWarning] = useState(false);

	const topChildren = (
		<View style={styles.vwTopChildren}>
			<Text style={styles.txtTopChildren}>Scripting Live Select Players</Text>
			<Text style={styles.txtSelectedTribeName}>
				{teamReducer.teamsArray.find((tribe) => tribe.selected)?.teamName}
			</Text>
		</View>
	);

	const fetchPlayers = async () => {
		const selectedTeam = teamReducer.teamsArray.find((tribe) => tribe.selected);

		if (!selectedTeam) {
			Alert.alert("Error", "No team selected");
			return;
		}

		try {
			const response = await fetch(
				`${process.env.EXPO_PUBLIC_API_BASE_URL}/players/team/${selectedTeam.id}`,
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

			if (response.ok && resJson?.playersArray) {
				console.log("Response OK");
				const tempArray = resJson.playersArray.map((item: any) => ({
					...item,
					selected: false,
				}));
				dispatch(updatePlayersArray(tempArray));
				dispatch(createPlayerArrayPositionProperties());
			} else {
				const errorMessage =
					resJson?.error || `There was a server error: ${response.status}`;
				Alert.alert("Error", errorMessage);
			}
		} catch (error) {
			console.error("Fetch players error:", error);
			Alert.alert("Error", "Failed to fetch players");
		}
	};

	const fetchPlayersOffline = () => {
		console.log("Fetched players offline");
		dispatch(updatePlayersArray(scriptReducerOffline.playersArray));
		dispatch(createPlayerArrayPositionProperties());
	};

	useEffect(() => {
		if (userReducer.token === "offline") {
			fetchPlayersOffline();
		} else {
			fetchPlayers();
		}
		dispatch(
			reducerSetUserSwipePadWheel({
				circleRadiusOuter: 60,
				circleRadiusMiddle: 40,
				circleRadiusInner: 20,
			})
		);
	}, []);

	const PlayerTableButton: React.FC<PlayerTableButtonProps> = ({ player }) => {
		const handleSelectPlayer = () => {
			const tempArray = scriptReducer.playersArray.map((item) => {
				if (item.id === player.id) {
					setDisplayWarning(false);
					return {
						...item,
						selected: !item.selected,
					};
				}
				return { ...item, selected: false };
			});
			dispatch(updatePlayersArray(tempArray));
			dispatch(setScriptingForPlayerObject(player));
		};

		return (
			<TouchableOpacity
				onPress={handleSelectPlayer}
				style={[styles.btnPlayer, player.selected && styles.btnPlayerSelected]}
			>
				<View style={styles.btnPlayerLeft}>
					<Text style={styles.txtShirtNumber}>{player.shirtNumber}</Text>
				</View>
				<View style={styles.btnPlayerRight}>
					<Text style={styles.txtPlayerName}>{player.firstName}</Text>
					<Text style={styles.txtPlayerName}>{player.lastName}</Text>
				</View>
			</TouchableOpacity>
		);
	};

	const handleSelectPlayerPress = () => {
		const selectedPlayers = scriptReducer.playersArray.filter(
			(player) => player.selected
		);

		if (selectedPlayers.length > 0) {
			// // TODO: Navigate to ScriptingLive when implemented
			// Alert.alert(
			// 	"Coming Soon",
			// 	"ScriptingLive screen will be implemented next"
			// );
			navigation.navigate("ScriptingLive");
		} else {
			setDisplayWarning(true);
		}
	};

	return (
		<ScreenFrameWithTopChildrenSmall
			navigation={navigation}
			topChildren={topChildren}
			sizeOfLogo={0}
		>
			<View style={styles.container}>
				<View style={styles.containerTop}>
					<View style={styles.vwPlayersTableHeading}>
						<View style={styles.vwTribeCrop}>
							<Tribe width={50} height={60} />
						</View>
						<Text>Players</Text>
					</View>
					<View style={styles.vwPlayersTable}>
						{scriptReducer.playersArray?.length > 0 ? (
							<FlatList
								data={scriptReducer.playersArray}
								renderItem={({ item }) => <PlayerTableButton player={item} />}
								keyExtractor={(item) => item.id.toString()}
							/>
						) : (
							<Text>No players found</Text>
						)}
					</View>
				</View>
				<View style={styles.containerBottom}>
					<View style={styles.vwSelectPlayerWarningSuper}>
						{displayWarning && (
							<View style={styles.vwSelectPlayerWarning}>
								<WarningTriangle />
								<Text style={{ color: "#E36C6C" }}>
									Warning: Please select a player
								</Text>
							</View>
						)}
					</View>
					<View style={styles.vwInputGroup}>
						<ButtonKvNoDefaultTextOnly
							active={
								scriptReducer.playersArray.filter((player) => player.selected)
									.length > 0
							}
							onPress={handleSelectPlayerPress}
							styleView={styles.btnSelectPlayer}
							styleText={
								scriptReducer.playersArray.filter((player) => player.selected)
									.length > 0
									? styles.btnSelectPlayerText
									: styles.btnSelectPlayerTextInactive
							}
						>
							Select Player
						</ButtonKvNoDefaultTextOnly>
					</View>
				</View>
			</View>
		</ScreenFrameWithTopChildrenSmall>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		gap: 10,
		paddingVertical: 10,
	},
	vwTopChildren: {
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
	},
	txtTopChildren: {
		color: "white",
		fontSize: 20,
		borderBottomWidth: 1,
		borderColor: "white",
	},
	txtSelectedTribeName: {
		color: "white",
		fontSize: 20,
		fontWeight: "bold",
	},
	containerTop: {
		flex: 1,
		width: Dimensions.get("window").width * 0.9,
	},
	vwPlayersTableHeading: {
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "flex-start",
		gap: 10,
		borderBottomWidth: 1,
		borderColor: "gray",
	},
	vwTribeCrop: {
		height: 45,
	},
	vwPlayersTable: {
		flex: 1,
	},
	btnPlayer: {
		flex: 1,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#6E4C84",
		borderRadius: 30,
		backgroundColor: "white",
		marginVertical: 5,
		flexDirection: "row",
		gap: 10,
		padding: 3,
	},
	btnPlayerSelected: {
		backgroundColor: "gray",
	},
	btnPlayerLeft: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#806181",
		borderRadius: 30,
		padding: 5,
	},
	txtShirtNumber: {
		fontWeight: "bold",
		color: "white",
		fontSize: 36,
		padding: 10,
	},
	btnPlayerRight: {
		alignItems: "center",
		justifyContent: "center",
	},
	txtPlayerName: {
		textAlign: "center",
		color: "#6E4C84",
		fontSize: 22,
	},
	containerBottom: {
		height: "15%",
		width: Dimensions.get("window").width * 0.9,
	},
	vwSelectPlayerWarningSuper: {
		flex: 1,
		alignItems: "center",
	},
	vwSelectPlayerWarning: {
		flexDirection: "row",
		alignItems: "center",
	},
	vwInputGroup: {
		alignItems: "center",
		paddingTop: 30,
	},
	btnSelectPlayer: {
		width: Dimensions.get("window").width * 0.6,
		height: 50,
		justifyContent: "center",
		fontSize: 24,
		color: "white",
		backgroundColor: "#C0A9C0",
		borderRadius: 35,
		alignItems: "center",
	},
	btnSelectPlayerText: {
		color: "white",
		fontSize: 24,
	},
	btnSelectPlayerTextInactive: {
		color: "#AB8EAB",
		fontSize: 24,
	},
});
