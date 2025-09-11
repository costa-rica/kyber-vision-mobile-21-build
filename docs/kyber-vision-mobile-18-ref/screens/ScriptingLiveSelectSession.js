import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import TemplateViewWithTopChildrenSmall from "./subcomponents/TemplateViewWithTopChildrenSmall";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import ButtonKvStd from "./subcomponents/buttons/ButtonKvStd";
import {
  setScriptingForPlayerObject,
  updatePlayersArray,
  updateSessionsArray,
} from "../reducers/script";
import ModalCreateSession from "./subcomponents/modals/ModalCreateSession";

function formatSessionDateToLocal(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthShort = date.toLocaleString("default", { month: "short" });
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day} ${monthShort} ${hours}h${minutes}`;
}

export default function ScriptingLiveSelectSession({ navigation }) {
  const userReducer = useSelector((state) => state.user);
  const scriptReducer = useSelector((state) => state.script);
  const teamReducer = useSelector((state) => state.team);
  const dispatch = useDispatch();
  // const [displayWarning, setDisplayWarning] = useState(false);
  const [isVisibleModalCreateSession, setIsVisibleModalCreateSession] =
    useState(false);
  // const [sessionsArray, setSessionsArray] = useState([]);
  // const [teamLeaguesArray, setTeamLeaguesArray] = useState([]);

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
    // console.log("fetchSessionsArray ---");

    const response = await fetch(
      // `${process.env.EXPO_PUBLIC_API_BASE_URL}/sessions/${teamId}`,
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/sessions/${
        teamReducer.teamsArray.filter((team) => team.selected)[0].id
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userReducer.token}`,
        },
        // body: JSON.stringify(bodyObj),
      }
    );

    // console.log("Received response:", response.status);

    let resJson = null;
    const contentType = response.headers.get("Content-Type");

    if (contentType?.includes("application/json")) {
      resJson = await response.json();
    }
    // console.log("--- here are the sessions ---");
    // console.log(resJson);
    let tempArray = [];
    resJson.sessionsArray.map((session) => {
      tempArray.push({
        ...session,
        selected: false,
      });
    });
    dispatch(updateSessionsArray(tempArray));
  };

  // const fetchTeamLeaguesArray = async () => {
  //   console.log(" -- fetchTeamLeaguesArray ---");

  //   const response = await fetch(
  //     `${process.env.EXPO_PUBLIC_API_BASE_URL}/leagues/team/${
  //       teamReducer.teamsArray.filter((team) => team.selected)[0].id
  //     }`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${userReducer.token}`,
  //       },
  //     }
  //   );

  //   console.log("Received response:", response.status);

  //   let resJson = null;
  //   const contentType = response.headers.get("Content-Type");

  //   if (contentType?.includes("application/json")) {
  //     resJson = await response.json();
  //   }
  //   // console.log("--- here are the leagues ---");
  //   // console.log(resJson);
  //   let tempArray = [];
  //   resJson.teamLeaguesArray.forEach((league) => {
  //     tempArray.push({
  //       ...league,
  //       selected: false,
  //     });
  //   });
  //   setTeamLeaguesArray(tempArray);
  // };

  const handleSelectSession = (session) => {
    // dispatch(setScriptingForPlayerObject({ sessionId }));
    // navigation.navigate("ScriptingLive");
    // console.log(" --- handleSelectSession ---");
    // console.log(session);
    let tempArray = scriptReducer.sessionsArray.map((item) => {
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
    // dispatch(setScriptingForPlayerObject(session));
  };

  return (
    <TemplateViewWithTopChildrenSmall
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
                      {/* {item.sessionDateString} */}
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
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={styles.containerBottom}>
          <View style={styles.vwButtons}>
            <ButtonKvStd
              style={{ width: "100%", backgroundColor: "#A3A3A3" }}
              onPress={() => {
                console.log("New Live Session");
                // fetchTeamLeaguesArray();
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
              // teamLeaguesArray={teamLeaguesArray}
              // setTeamLeaguesArray={setTeamLeaguesArray}
              navigation={navigation}
            />
          </View>
        </Modal>
      )}
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

  // ----- container -----

  vwSessionItem: {
    marginBottom: 10,
  },
  btnSelectSession: {
    width: "100%",
    height: 40,
    borderRadius: 5,
    flexDirection: "row",
    // justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#806181",
  },
  vwSessionItemDate: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "#806181",
    // borderWidth: 1,
  },
  txtSessionItemDate: {
    fontSize: 16,
    // fontWeight: "bold",
  },

  vwSessionItemName: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // or 'flex-start' if you want left-align
    // borderColor: "#806181",
    // borderWidth: 1,
    flexShrink: 1, // allow it to shrink and wrap
  },

  txtSessionItemName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "black",
    flexWrap: "wrap",
    width: "100%", // ensure wrapping happens within column width
    textAlign: "center", // or 'left'
  },
  vwSessionItemCity: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "#806181",
    // borderWidth: 1,
  },
  txtSessionItemCity: {
    fontSize: 12,
    // fontWeight: "bold",
    color: "gray",
  },

  // ------------
  // Bottom
  // ------------
  containerBottom: {
    height: "15%",
    width: Dimensions.get("window").width * 0.9,
  },

  vwButtons: {
    width: "100%",
    gap: 10,
    marginBottom: 10,
  },

  // ------------
  // Modal
  // ------------

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
