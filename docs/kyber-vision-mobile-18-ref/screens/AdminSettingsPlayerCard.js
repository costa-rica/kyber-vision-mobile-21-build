import * as FileSystem from "expo-file-system";
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
  ImageBackground,
} from "react-native";
// import TemplateViewWithTopChildren from "./subcomponents/TemplateViewWithTopChildren";
import TemplateViewWithTopChildrenSmall from "./subcomponents/TemplateViewWithTopChildrenSmall";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import BtnVisibilityDown from "../assets/images/buttons/btnVisibilityDown.svg";
import BtnVisibilityUp from "../assets/images/buttons/btnVisibilityUp.svg";
import IconMagnifingGlass from "../assets/images/iconMagnifingGlass.svg";
import { updateTeamsArray } from "../reducers/team";
import AdminSettingsPlayerCardWaveThing from "../assets/images/AdminSettingsPlayerCardWaveThing.svg";

import ButtonKvNoDefault from "./subcomponents/buttons/ButtonKvNoDefault";
import ButtonKvNoDefaultTextOnly from "./subcomponents/buttons/ButtonKvNoDefaultTextOnly";
import ModalAdminSettingsPlayerCardLinkUser from "./subcomponents/modals/ModalAdminSettingsPlayerCardLinkUser";
import ModalAdminSettingsDeletePlayerUserLinkYesNo from "./subcomponents/modals/ModalAdminSettingsDeletePlayerUserLinkYesNo";

export default function AdminSettingsPlayerCard({ navigation, route }) {
  const [playerObject, setPlayerObject] = useState(route.params.playerObject);
  const userReducer = useSelector((state) => state.user);
  const teamReducer = useSelector((state) => state.team);
  const [localImageUri, setLocalImageUri] = useState(null);
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
  const topChildren = (
    <Text>
      {teamReducer.teamsArray.filter((team) => team.selected)[0].teamName}{" "}
      Settings
    </Text>
  );

  const fetchPlayerProfilePicture = async () => {
    try {
      const localDir = `${FileSystem.documentDirectory}profile-pictures/`;
      await FileSystem.makeDirectoryAsync(localDir, { intermediates: true });
      const fileUri = `${localDir}${playerObject.image}`;

      const downloadResumable = await FileSystem.downloadAsync(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/players/profile-picture/${playerObject.image}`,
        fileUri,
        {
          headers: {
            Authorization: `Bearer ${userReducer.token}`,
          },
        }
      );

      if (downloadResumable.status === 200) {
        setLocalImageUri(fileUri);
      } else {
        console.log(
          "Failed to download image, status:",
          downloadResumable.status
        );
      }
    } catch (error) {
      console.log("Error downloading player profile picture:", error);
    }
  };

  useEffect(() => {
    const checkAndLoadImage = async () => {
      if (!playerObject.image) return;
      const localDir = `${FileSystem.documentDirectory}profile-pictures/`;
      const fileUri = `${localDir}${playerObject.image}`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        setLocalImageUri(fileUri);
      } else {
        await fetchPlayerProfilePicture();
      }
    };
    checkAndLoadImage();
  }, [playerObject.image]);

  // // Do we need this?
  // useEffect(() => {
  //   // console.log("&&& playerObject updated");
  // }, [playerObject]);

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

  return (
    <TemplateViewWithTopChildrenSmall
      navigation={navigation}
      topChildren={topChildren}
      screenName={"AdminSettingsPlayerCard"}
      modalComponentAndSetterObject={whichModalToDisplay()}
      topHeight={"15%"}
    >
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <View style={styles.vwPlayerNameAndShirtNumber}>
            <View style={styles.vwPlayerLeft}>
              <Text style={styles.txtShirtNumber}>
                {/* {props.lastActionPlayer.shirtNumber} */}
                {playerObject.shirtNumber}
              </Text>
            </View>
            <View style={styles.vwPlayerRight}>
              <Text style={styles.txtPlayerName}>{playerObject.firstName}</Text>
              <Text style={styles.txtPlayerName}>
                {playerObject.lastName.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.vwPlayerImage}>
            <Image
              source={localImageUri ? { uri: localImageUri } : null}
              style={styles.imgPlayer}
            />
          </View>
        </View>
        <ImageBackground
          source={require("../assets/images/AdminSettingsPlayerCardWaveThing.png")}
          style={styles.vwPlayerRolesWaveThing}
        >
          <View style={styles.vwPlayerLabel}>
            <Text style={styles.txtPlayerLabel}>Player</Text>
          </View>
          <View style={styles.vwPlayerLabel}>
            <Text style={styles.txtPlayerLabel}>{playerObject.position}</Text>
          </View>
        </ImageBackground>
        <View style={styles.containerBottom}>
          <View style={styles.vwLinkedAccount}>
            <Text style={styles.txtLabel}>Squad member account linked</Text>
            <View style={styles.vwLinkeAccountInput}>
              {playerObject.isUser ? (
                <Text style={styles.txtValue}>{playerObject.username}</Text>
              ) : (
                <Text style={styles.txtValue}> No account linked</Text>
              )}
              {isAdminOfThisTeam && !playerObject.isUser && (
                <ButtonKvNoDefault
                  onPress={() => {
                    setIsVisibleLinkUserModal(true);
                  }}
                  styleView={styles.btnSearch}
                >
                  <IconMagnifingGlass />
                </ButtonKvNoDefault>
              )}
              {isAdminOfThisTeam && playerObject.isUser && (
                <ButtonKvNoDefault
                  onPress={() => {
                    console.log("Remove link");
                    setIsVisibleDeletePlayerUserLinkModal(true);
                  }}
                  styleView={styles.btnCircleX}
                  styleText={{ fontSize: 20 }}
                >
                  <Image
                    source={require("../assets/images/btnCircleXGray.png")}
                    resizeMode="contain"
                    style={styles.imgIconForLink}
                  />
                </ButtonKvNoDefault>
              )}
            </View>
          </View>

          <View style={styles.vwShirtNumber}>
            <Text style={styles.txtShirtNumberTitle}>Shirt Number</Text>
            <Text style={styles.txtShirtNumberValue}>
              {playerObject.shirtNumber}
            </Text>
          </View>
          <View style={styles.vwShirtNumber}>
            <Text style={styles.txtShirtNumberTitle}>Post</Text>
            <Text style={styles.txtShirtNumberValue}>
              {playerObject.position}
            </Text>
          </View>
          {/* <View style={styles.vwShirtNumber}>
            <Text style={styles.txtShirtNumberTitle}>Role</Text>
          </View>
          <Text style={{ fontSize: 11 }}> {JSON.stringify(playerObject)}</Text> */}
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
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "dashed",
    zIndex: 1,
  },
  vwPlayerTop: {
    flexDirection: "row",
  },
  vwPlayerNameAndShirtNumber: {
    // borderWidth: 1,
    // borderColor: "#6E4C84",
    // borderRadius: 30,
    // backgroundColor: "blue",
    flexDirection: "row",
    gap: 10,
    padding: 5,
    width: Dimensions.get("window").width * 0.3,
    marginTop: 20,
    marginLeft: 20,
  },
  vwPlayerLeft: {
    justifyContent: "center",
    backgroundColor: "#806181",
    borderRadius: 30,
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  txtShirtNumber: {
    // fontWeight: "bold",
    color: "white",
    fontSize: 40,
    // borderRadius: 7,
    // height: 15,
    // width: 20,
    textAlign: "center",
    fontFamily: "ApfelGrotezkSuperBold",
  },
  vwPlayerRight: {
    // alignItems: "center",
    justifyContent: "center",
  },
  txtPlayerName: {
    // textAlign: "center",
    color: "#6E4C84",
    fontSize: 16,
    fontFamily: "ApfelGrotezkSemiBold",
  },
  vwPlayerImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    // backgroundColor: "green",
  },
  imgPlayer: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  vwPlayerRolesWaveThing: {
    // justifyContent: "center",
    alignItems: "flex-start",
    width: Dimensions.get("window").width,
    height: 100,
    marginTop: -50,
    padding: 10,
  },
  vwPlayerLabel: {
    // height: 40,
    // width: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#806181",
    padding: 5,
  },
  txtPlayerLabel: {
    fontSize: 20,
    color: "white",
    lineHeight: 20,
  },

  // ------------
  // Bottom
  // ------------
  containerBottom: {
    width: "100%",
    padding: 20,
    paddingRight: 60,
    gap: 20,
    // borderWidth: 1,
    // borderColor: "gray",
    // borderStyle: "dashed",
  },
  vwLinkedAccount: {
    width: "100%",
  },
  txtLabel: {
    color: "gray",
  },
  txtValue: {
    fontSize: 16,
    fontStyle: "italic",
  },
  vwLinkeAccountInput: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    gap: 30,
    // backgroundColor: "red",
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
  btnCircleX: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 40,
    borderRadius: 20,
  },

  vwShirtNumber: {
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    width: "100%",
    marginBottom: 10,
  },
  txtShirtNumberTitle: {
    color: "gray",
    marginBottom: 5,
  },
  txtShirtNumberValue: {
    fontSize: 16,
  },
});
