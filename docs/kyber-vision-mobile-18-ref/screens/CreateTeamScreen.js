import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import TemplateViewWithTopChildrenSmall from "./subcomponents/TemplateViewWithTopChildrenSmall";
import ButtonKvStd from "./subcomponents/buttons/ButtonKvStd";
import ButtonKvNoDefaultTextOnly from "./subcomponents/buttons/ButtonKvNoDefaultTextOnly";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ModalAddPlayer from "./subcomponents/modals/ModalTeamAddPlayer";
import ModalTeamYesNo from "./subcomponents/modals/ModalTeamYesNo";
import { useDispatch } from "react-redux";
import {
  updatePlayersArray,
  updateSelectedPlayerObject,
  updateTeamDetails,
  clearTeamReducer,
  updateTeamsArray,
} from "../reducers/team";

export default function CreateTeamScreen({ navigation }) {
  const userReducer = useSelector((state) => state.user);
  const teamReducer = useSelector((state) => state.team);
  const dispatch = useDispatch();
  // const [playersArray, setPlayersArray] = useState([]);
  // const [teamInputs, setTeamInputs] = useState({
  //   teamName: "",
  //   teamDescription: "",
  //   teamImage: null,
  // });
  const [isVisibleModalAddPlayer, setIsVisibleModalAddPlayer] = useState(false);
  const [isVisibleRemovePlayerModal, setIsVisibleRemovePlayerModal] =
    useState(false);

  const topChildren = (
    <View style={styles.vwTopChildren}>
      <Text style={styles.txtTopChildren}> Create a Team</Text>
    </View>
  );

  const teamTablePlayerRow = ({ item }) => {
    if (item.name === "Add Player") {
      return (
        <View style={styles.vwPlayerRowAddPlayerButton}>
          <ButtonKvNoDefaultTextOnly
            onPress={() => setIsVisibleModalAddPlayer(true)}
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

  const addPlayerToTeam = (playerObject) => {
    const filteredPlayers = teamReducer.playersArray.filter(
      (item) => item.name !== "Add Player"
    );

    const updatedArray = [...filteredPlayers, playerObject];

    updatedArray.push({
      name: "Add Player",
      shirtNumber: 9999,
      position: "",
    });

    dispatch(updatePlayersArray(updatedArray));
    setIsVisibleModalAddPlayer(false);
  };

  const handleCreateTeam = async () => {
    console.log("handleCreateTeam");
    const playersArrayMinusAddPlayer = teamReducer.playersArray.filter(
      (item) => item.name !== "Add Player"
    );

    if (playersArrayMinusAddPlayer.length === 0) {
      alert("Please add at least one player to the team.");
      return;
    }
    if (teamReducer.teamDetails?.teamName === "") {
      alert("Please enter a team name.");
      return;
    }
    const bodyObj = {
      teamName: teamReducer.teamDetails?.teamName,
      description: teamReducer.teamDetails?.teamDescription,
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
        item.shirtNumber !== teamReducer.selectedPlayerObject.shirtNumber
      );
      return item.shirtNumber !== teamReducer.selectedPlayerObject.shirtNumber;
    });
    // console.log("filteredPlayers", filteredPlayers);
    dispatch(updatePlayersArray(filteredPlayers));
    setIsVisibleRemovePlayerModal(false);
  };

  const whichModalToDisplay = () => {
    if (isVisibleModalAddPlayer) {
      return {
        modalComponent: <ModalAddPlayer addPlayerToTeam={addPlayerToTeam} />,
        useState: isVisibleModalAddPlayer,
        useStateSetter: setIsVisibleModalAddPlayer,
      };
    }

    if (isVisibleRemovePlayerModal) {
      return {
        modalComponent: <ModalTeamYesNo onPressYes={handleRemovePlayer} />,
        useState: isVisibleRemovePlayerModal,
        useStateSetter: setIsVisibleRemovePlayerModal,
      };
    }
  };

  return (
    <TemplateViewWithTopChildrenSmall
      navigation={navigation}
      topChildren={topChildren}
      onBackPress={() => dispatch(clearTeamReducer())}
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
                  value={teamReducer.teamDetails?.teamName}
                  onChangeText={(text) =>
                    // setTeamInputs({ ...teamInputs, teamName: text })
                    dispatch(
                      updateTeamDetails({
                        ...teamReducer.teamDetails,
                        teamName: text,
                      })
                    )
                  }
                  style={
                    teamReducer.teamDetails?.teamName !== ""
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
                  value={teamReducer.teamDetails?.teamDescription}
                  onChangeText={(text) =>
                    // setTeamInputs({ ...teamInputs, teamDescription: text })
                    dispatch(
                      updateTeamDetails({
                        ...teamReducer.teamDetails,
                        teamDescription: text,
                      })
                    )
                  }
                  // style={styles.txtInput}
                  style={
                    teamReducer.teamDetails?.teamDescription !== ""
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
                data={teamReducer.playersArray}
                renderItem={teamTablePlayerRow}
                keyExtractor={(item) => item.shirtNumber}
                style={styles.flatListTeamNames}
              />
            ) : (
              <Text>No players found</Text>
            )}

            {teamReducer.playersArray.length === 0 && (
              <View style={styles.vwNewPlayerWhenNoPlayers}>
                <ButtonKvNoDefaultTextOnly
                  onPress={() => setIsVisibleModalAddPlayer(true)}
                  styleView={styles.btnAddPlayer}
                  styleText={styles.btnAddPlayerText}
                >
                  +
                </ButtonKvNoDefaultTextOnly>
              </View>
            )}
          </View>

          {/* <View style={styles.vwInputGroup}> */}
          <ButtonKvStd
            onPress={() => {
              console.log("Create Team");
              handleCreateTeam();
            }}
            style={styles.btnTribe}
          >
            Create Team
          </ButtonKvStd>
          {/* </View> */}
        </View>
      </View>
    </TemplateViewWithTopChildrenSmall>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDFD",
    width: "100%",
  },

  // ------------
  // Top Children
  // ------------
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
  // Container Top
  // ------------
  containerTop: {
    // flex: 1,
    backgroundColor: "#FDFDFD",
    width: "100%",
  },
  vwInputs: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  vwInputGroup: {
    width: "90%",
    alignItems: "flex-start",
    marginTop: 10,
  },
  vwInputGroupLabelMultipleFonts: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  txtInputGroupLabelRequired: {
    color: "red",
  },
  vwInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 30,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },

  txtPlaceholder: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    color: "gray",
    fontStyle: "italic",
  },
  txtInputRegular: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    color: "black",
    fontStyle: "normal",
  },

  txtInputGroupLabel: {
    fontSize: 14,
    color: "#5B5B5B",
    paddingLeft: 15,
  },
  vwIconButton: {
    padding: 5,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
  },

  // ------------
  // Container Bottom
  // ------------
  containerBottom: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "dashed",
  },

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
  },
  btnAddPlayer: {
    // padding: 10,
    height: 40,
    width: 40,
    borderRadius: 20,
    // backgroundColor: "#C0A9C0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "gray",
  },
  btnAddPlayerText: {
    color: "gray",
    fontSize: 30,
  },
  vwNewPlayerWhenNoPlayers: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  vwPlayerRowAddPlayerButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    // backgroundColor: "#C0A9C0",
  },
  vwPlayerRow: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
    // backgroundColor: "#C0A9C0",
    flexDirection: "row",
    gap: 5,
  },
  vwPlayerRowCircle: {
    borderWidth: 1,
    borderColor: "gray",
    borderStyle: "solid",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  vwPlayerRowLeft: {
    width: "13%",
  },
  vwPlayerRowMiddle: {
    width: "70%",
    alignItems: "flex-start",
    paddingLeft: 15,
  },
  vwPlayerRowRight: {
    width: "13%",
  },
});
