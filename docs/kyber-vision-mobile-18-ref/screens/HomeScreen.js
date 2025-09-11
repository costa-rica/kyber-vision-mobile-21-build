import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import TemplateViewWithTopChildren from "./subcomponents/TemplateViewWithTopChildren";
import ButtonKvStd from "./subcomponents/buttons/ButtonKvStd";
import ButtonKvNoDefaultTextOnly from "./subcomponents/buttons/ButtonKvNoDefaultTextOnly";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateTeamsArray } from "../reducers/team";
import { updateSessionsArray } from "../reducers/script";
import { logoutUser } from "../reducers/user";

export default function HomeScreen({ navigation }) {
  const userReducer = useSelector((state) => state.user);
  const teamReducer = useSelector((state) => state.team);
  const [displayTeamList, setDisplayTeamList] = useState(false);
  const dispatch = useDispatch();
  const [isVisibleModalSelectSession, setIsVisibleModalSelectSession] =
    useState(false);
  const [sessionsArray, setSessionsArray] = useState([]);

  const handleTribeSelect = (selectedId) => {
    const updatedArray = teamReducer.teamsArray.map((team) => ({
      ...team,
      selected: team.id === selectedId,
    }));
    dispatch(updateTeamsArray(updatedArray));
    setDisplayTeamList(false);
  };

  const topChildren = (
    <View style={styles.vwTopChildren}>
      <View style={styles.vwCapsuleSuper}>
        <View
          style={displayTeamList ? styles.vwCapsuleExpanded : styles.vwCapsule}
        >
          <View style={[styles.vwLeftCapsule]}>
            {displayTeamList ? (
              // <View style={styles.vwDropdownList}>
              <View>
                {teamReducer.teamsArray.map((tribe) => (
                  <TouchableOpacity
                    key={tribe.id}
                    onPress={() => handleTribeSelect(tribe.id)}
                    style={[styles.vwTeamRow]}
                  >
                    <Text
                      style={[
                        styles.txtDropdownTopChildTeamName,
                        tribe.selected && { fontWeight: "bold" },
                      ]}
                    >
                      {tribe.teamName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.txtTopChildSelectedTribeName}>
                {teamReducer.teamsArray.find((tribe) => tribe.selected)
                  ?.teamName || "No tribe selected"}
              </Text>
            )}
          </View>
          <View style={styles.vwRightCapsule}>
            <TouchableOpacity
              onPress={() => setDisplayTeamList(!displayTeamList)}
              style={styles.btnSelectTribe}
            >
              <Image
                source={
                  displayTeamList
                    ? require("../assets/images/navigationAndSmall/btnBackArrow.png")
                    : require("../assets/images/navigationAndSmall/btnDownArrow.png")
                }
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    // console.log("-- In HomeScreen useEffect --");
    fetchSessionsArray();
    // console.log("------ teamReducer.teamsArray in useEffect -----");
    // console.log(JSON.stringify(teamReducer.teamsArray));
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

  const createAdminButtonText = () => {
    // console.log(
    //   "--- what is going on with teamReducer.teamsArray in createAdminButtonText ---"
    // );
    // console.log(JSON.stringify(teamReducer.teamsArray));
    // console.log("--------");
    // console.log("--------");
    // console.log(
    //   "--- what is going on with teamReducer.teamsArray.filtered() ???? ---"
    // );
    // console.log(
    //   JSON.stringify(teamReducer.teamsArray.filter((team) => team.selected))
    // );
    // const teamId = teamReducer.teamsArray.filter((team) => team.selected)[0]
    //   ?.id;
    const teamName = teamReducer.teamsArray.filter((team) => team.selected)[0]
      ?.teamName;
    const userTeamIsAdmin = false;
    // const userTeamIsAdmin =
    //   userReducer.contractTeamUserArray.filter((team) => team.id === teamId)[0]
    //     ?.isAdmin || false;
    const adminButtonText = userTeamIsAdmin
      ? `Administrate ${teamName}`
      : `${teamName} Settings`;
    return adminButtonText;
  };

  return (
    <TemplateViewWithTopChildren
      navigation={navigation}
      topChildren={topChildren}
      screenName={"HomeScreen"}
    >
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <View style={styles.vwInputGroup}>
            <ButtonKvStd
              onPress={() => navigation.navigate("ScriptingLiveSelectSession")}
              style={styles.btnHomeNavigation}
            >
              Scripting
            </ButtonKvStd>
            <ButtonKvStd
              onPress={() => navigation.navigate("ReviewSelectionScreen")}
              style={styles.btnHomeNavigation}
            >
              Review
            </ButtonKvStd>
            <ButtonKvNoDefaultTextOnly
              onPress={() => navigation.navigate("UploadVideoScreen")}
              styleView={styles.btnHomeNavigationUploadVideo}
              styleText={styles.txtHomeNavigationUploadVideo}
            >
              Upload Video
            </ButtonKvNoDefaultTextOnly>
            <ButtonKvNoDefaultTextOnly
              onPress={() => navigation.navigate("ScriptingSyncVideoSelection")}
              styleView={styles.btnHomeNavigationUploadVideo}
              styleText={styles.txtHomeNavigationUploadVideo}
            >
              Sync Video
            </ButtonKvNoDefaultTextOnly>
            <ButtonKvNoDefaultTextOnly
              onPress={() => navigation.navigate("AdminSettings")}
              styleView={styles.btnHomeNavigationUploadVideo}
              styleText={styles.txtHomeNavigationUploadVideo}
            >
              {createAdminButtonText()}
            </ButtonKvNoDefaultTextOnly>
          </View>
        </View>
        <View style={styles.containerBottom}>
          <ButtonKvStd
            onPress={() => {
              dispatch(logoutUser());
              navigation.navigate("SplashScreen");
            }}
            style={styles.btnHomeNavigation}
          >
            Logout
          </ButtonKvStd>
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
  // ----- TOP Childeren -----
  vwTopChildren: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  txtTopChildSelectedTribeName: {
    color: "white",
    fontSize: 20,
  },
  vwCapsuleSuper: {
    position: "relative",
    width: Dimensions.get("window").width * 0.8,
    height: 50,
  },
  vwCapsule: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "white",
    backgroundColor: "#806181",
    borderRadius: 10,
    padding: 5,
  },
  vwCapsuleExpanded: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#806181",
    borderRadius: 10,
    padding: 5,
    width: Dimensions.get("window").width * 0.8,
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
  vwLeftCapsule: {
    width: "80%",
  },
  vwLeftCapsuleExpanded: {
    width: Dimensions.get("window").width * 0.8,
    height: "100%",
    position: "absolute",
    top: 0,
    zIndex: 1,
    backgroundColor: "#C0A9C0",
  },
  txtDropdownTopChildTeamName: {
    color: "white",
    fontSize: 20,
  },
  vwDropdownList: {
    padding: 5,
    width: "100%",
    height: "100%",
  },
  vwRightCapsule: {
    height: "100%",
  },

  // ----- TOP -----
  containerTop: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "dashed",
  },

  // ----- Bottom -----
  containerBottom: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "dashed",
  },
  vwInputGroup: {
    width: "90%",
    alignItems: "center",
    paddingTop: 30,
    gap: 10,
  },
  btnHomeNavigation: {
    width: Dimensions.get("window").width * 0.6,
    height: 50,
    justifyContent: "center",
    fontSize: 24,
    color: "white",
    backgroundColor: "#806181",
  },

  btnHomeNavigationUploadVideo: {
    width: Dimensions.get("window").width * 0.6,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24,
    color: "white",
    backgroundColor: "#E8E8E8",
    borderRadius: 35,
    borderColor: "#806181",
    borderWidth: 2,
  },
  txtHomeNavigationUploadVideo: {
    fontSize: 24,
    color: "#806181",
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

  // vwTeamRow: {
  //   padding: 5,
  //   marginVertical: 5,
  //   backgroundColor: "#F0F0F0",
  //   borderRadius: 2.5,
  //   width: "100%",
  //   textAlign: "center",
  //   // height: 50,
  // },

  // ------------
  // Bottom
  // ------------

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
