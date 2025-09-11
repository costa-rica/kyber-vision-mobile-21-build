import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import TemplateViewWithTopChildrenSmall from "./subcomponents/TemplateViewWithTopChildrenSmall";
import ScriptingLivePortrait from "./subcomponents/ScriptingLivePortrait";
import { useSelector } from "react-redux";
import Tribe from "../assets/images/navigationAndSmall/Tribe.svg";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import ButtonKvStd from "./subcomponents/buttons/ButtonKvStd";
import ButtonKvNoDefaultTextOnly from "./subcomponents/buttons/ButtonKvNoDefaultTextOnly";
import WarningTriangle from "../assets/images/navigationAndSmall/warningTriangle.svg";
import {
  setScriptingForPlayerObject,
  updatePlayersArray,
  createPlayerArrayPositionProperties,
} from "../reducers/script";

export default function ScriptingLiveSelectPlayers({ navigation }) {
  const userReducer = useSelector((state) => state.user);
  const scriptReducer = useSelector((state) => state.script);
  const teamReducer = useSelector((state) => state.team);
  const dispatch = useDispatch();
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
      const tempArray = resJson.playersArray.map((item) => {
        return {
          ...item,
          selected: false,
        };
      });
      // console.log(tempArray);
      dispatch(updatePlayersArray(tempArray));
      dispatch(createPlayerArrayPositionProperties());
    } else {
      const errorMessage =
        resJson?.error ||
        `There was a server error (and no resJson): ${response.status}`;
      alert(errorMessage);
    }
  };
  const fetchPlayersOffline = () => {
    console.log("Fetched players offline");
    const scriptReducerOffline = require("../offlineData/scriptReducer.json");
    dispatch(updatePlayersArray(scriptReducerOffline.playersArray));
    dispatch(createPlayerArrayPositionProperties());
  };
  useEffect(() => {
    if (userReducer.token === "offline") {
      fetchPlayersOffline();
    } else {
      fetchPlayers();
    }
  }, []);

  const playerTableButton = ({ player }) => {
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
        onPress={() => {
          // console.log(player);
          handleSelectPlayer();
        }}
        key={player.id}
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

  return (
    <TemplateViewWithTopChildrenSmall
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
                renderItem={({ item }) => playerTableButton({ player: item })}
                keyExtractor={(item) => item.id}
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
              onPress={() => {
                if (
                  scriptReducer.playersArray.filter((player) => player.selected)
                    .length > 0
                ) {
                  navigation.navigate("ScriptingLive");
                } else {
                  setDisplayWarning(true);
                }
              }}
              // style={styles.btnTribe}
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
    </TemplateViewWithTopChildrenSmall>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 10,
  },

  // ----- TOP Childeren -----
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

  // ----- TOP -----
  containerTop: {
    flex: 1,
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "dashed",
    width: Dimensions.get("window").width * 0.9,
    // margin: 10,
  },

  vwPlayersTableHeading: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    gap: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
    // height: "100",
    // flex: 1,
  },
  vwTribeCrop: {
    height: 45,
  },
  vwPlayersTable: {
    flex: 1,
  },
  // ------------
  // ScrollView
  // ------------
  scrollViewPlayersTable: {
    // height: 100,
    flex: 1,
  },
  vwPlayerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
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
    alignItems: "center",
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
    // borderRadius: 30,
  },
  btnPlayerRight: {
    alignItems: "center",
    justifyContent: "center",
    // gap: 10,
  },

  txtPlayerName: {
    textAlign: "center",
    color: "#6E4C84",
    fontSize: 22,
  },
  // ------------
  // Bottom
  // ------------
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
    // width: "90%",
    alignItems: "center",
    paddingTop: 30,
  },
  // btnTribe: {
  //   width: Dimensions.get("window").width * 0.6,
  //   height: 50,
  //   justifyContent: "center",
  //   fontSize: 24,
  //   color: "#AB8EAB",
  //   backgroundColor: "#C0A9C0",
  //   // borderColor
  // },

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
