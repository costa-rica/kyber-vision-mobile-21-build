import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	FlatList,
	TouchableOpacity,
	Modal,
	Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import ScreenFrameWithTopChildrenSmall from "../../components/screen-frames/ScreenFrameWithTopChildrenSmall";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../types/store";
import ButtonKvStd from "../../components/buttons/ButtonKvStd";
import { updateSessionsArray } from "../../reducers/script";
import ModalCreateSession from "../../components/modals/ModalCreateSession";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../types/navigation";

type ScriptingLiveSelectSessionScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"ScriptingLiveSelectSession"
>;

function formatSessionDateToLocal(dateString: string): string {
	const date = new Date(dateString);
	const day = date.getDate();
	const monthShort = date.toLocaleString("default", { month: "short" });
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${day} ${monthShort} ${hours}h${minutes}`;
}

export default function ScriptingLiveSelectSession({
	navigation,
}: ScriptingLiveSelectSessionScreenProps) {
	const userReducer = useSelector((state: RootState) => state.user);
	const scriptReducer = useSelector((state: RootState) => state.script);
	const teamReducer = useSelector((state: RootState) => state.team);
	const dispatch = useDispatch<AppDispatch>();

	const [isVisibleModalCreateSession, setIsVisibleModalCreateSession] =
		useState(false);

	const topChildren = (
		<View style={styles.vwTopChildren}>
			<Text style={styles.txtTopChildren}>Scripting Live Select Session</Text>
			<Text style={styles.txtSelectedTribeName}>
				{teamReducer.teamsArray.find((tribe) => tribe.selected)?.teamName}
			</Text>
		</View>
	);

	useEffect(() => {
		fetchSessionsArray();
	}, []);

	const fetchSessionsArray = async () => {
		const selectedTeam = teamReducer.teamsArray.filter(
			(team) => team.selected
		)[0];

		if (!selectedTeam) {
			Alert.alert("Error", "No team selected");
			return;
		}

		try {
			const response = await fetch(
				`${process.env.EXPO_PUBLIC_API_BASE_URL}/sessions/${selectedTeam.id}`,
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

			if (resJson?.sessionsArray) {
				const tempArray = resJson.sessionsArray.map((session: any) => ({
					...session,
					selected: false,
				}));
				dispatch(updateSessionsArray(tempArray));
			}
		} catch (error) {
			console.error("Failed to fetch sessions:", error);
			Alert.alert("Error", "Failed to fetch sessions");
		}
	};

	const handleSelectSession = (session: any) => {
		const tempArray = scriptReducer.sessionsArray.map((item) => {
			if (item.id === session.id) {
				return {
					...item,
					selected: true,
				};
			}
			return { ...item, selected: false };
		});
		dispatch(updateSessionsArray(tempArray));
		navigation.navigate("ScriptingLiveSelectPlayers");
	};

	return (
		<ScreenFrameWithTopChildrenSmall
			navigation={navigation}
			topChildren={topChildren}
			sizeOfLogo={0}
		>
			<View style={styles.container}>
				<View style={styles.containerTop}>
					<Text style={{ fontSize: 18, marginBottom: 20 }}>
						Which session do you want to script for?
					</Text>
					<FlatList
						data={scriptReducer.sessionsArray}
						renderItem={({ item }) => (
							<View style={styles.vwSessionItem}>
								<TouchableOpacity
									style={styles.btnSelectSession}
									onPress={() => handleSelectSession(item)}
								>
									<View style={styles.vwSessionItemDate}>
										<Text style={styles.txtSessionItemDate}>
											{formatSessionDateToLocal(item.sessionDate)}
										</Text>
									</View>
									<View style={styles.vwSessionItemName}>
										<Text style={styles.txtSessionItemName}>
											{item.sessionName}
										</Text>
									</View>
									<View style={styles.vwSessionItemCity}>
										<Text style={styles.txtSessionItemCity}>{item.city}</Text>
									</View>
								</TouchableOpacity>
							</View>
						)}
						keyExtractor={(item) => item.id.toString()}
					/>
				</View>

				<View style={styles.containerBottom}>
					<View style={styles.vwButtons}>
						<ButtonKvStd
							style={{ width: "100%", backgroundColor: "#A3A3A3" }}
							onPress={() => {
								console.log("New Live Session");
								setIsVisibleModalCreateSession(true);
							}}
						>
							New Live Session
						</ButtonKvStd>
					</View>
				</View>
			</View>
			{isVisibleModalCreateSession && (
				<Modal
					visible={isVisibleModalCreateSession}
					transparent={true}
					animationType="fade"
					onRequestClose={() => setIsVisibleModalCreateSession(false)}
				>
					<View style={styles.modalOverlay}>
						<ModalCreateSession
							isVisibleModalCreateSession={isVisibleModalCreateSession}
							setIsVisibleModalCreateSession={setIsVisibleModalCreateSession}
						/>
					</View>
				</Modal>
			)}
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
	vwSessionItem: {
		marginBottom: 10,
	},
	btnSelectSession: {
		width: "100%",
		height: 40,
		borderRadius: 5,
		flexDirection: "row",
		borderWidth: 1,
		borderColor: "#806181",
	},
	vwSessionItemDate: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	txtSessionItemDate: {
		fontSize: 16,
	},
	vwSessionItemName: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		flexShrink: 1,
	},
	txtSessionItemName: {
		fontSize: 13,
		fontWeight: "bold",
		color: "black",
		flexWrap: "wrap",
		width: "100%",
		textAlign: "center",
	},
	vwSessionItemCity: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	txtSessionItemCity: {
		fontSize: 12,
		color: "gray",
	},
	containerBottom: {
		height: "15%",
		width: Dimensions.get("window").width * 0.9,
	},
	vwButtons: {
		width: "100%",
		gap: 10,
		marginBottom: 10,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
});
