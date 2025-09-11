import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
} from "react-native";
import ButtonKvStd from "../buttons/ButtonKvStd";
import ButtonKvNoDefaultTextOnly from "../buttons/ButtonKvNoDefaultTextOnly";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function ModalAdminSettingsDeletePlayerUserLinkYesNo({
  // onPressYes,
  playerObject,
  setIsVisibleDeletePlayerUserLinkModal,
  setPlayerObject,
}) {
  // const teamReducer = useSelector((state) => state.team);
  const userReducer = useSelector((state) => state.user);

  const handleDeletePlayerUserLink = async () => {
    // const bodyObj = {
    //   teamId: teamReducer.teamsArray.filter((team) => team.selected)[0].id,
    //   playerId: playerObject.id,
    // };
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/contract-player-user/${playerObject.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userReducer.token}`,
        },
        // body: JSON.stringify(bodyObj),
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
      const tempObject = {
        ...playerObject,
        username: null,
        userId: null,
        isUser: false,
        email: null,
        // isUser: userObject.isUser,
        // role: userObject.role,
      };
      setPlayerObject(tempObject);
      setIsVisibleDeletePlayerUserLinkModal(false);
    } else {
      const errorMessage =
        resJson?.error || `There was a server error: ${response.status}`;
      alert(errorMessage);
    }
  };

  return (
    <View style={styles.modalContent}>
      <View style={styles.vwModalTitle}>
        <Text style={styles.txtModalTitle}>
          Are you sure you want to remove{" "}
          <Text style={styles.txtModalTitlePlayerName}>
            {playerObject.username}
          </Text>{" "}
          from {playerObject.firstName} {playerObject.lastName} ?
        </Text>
      </View>
      {/* <View style={styles.vwVideoDetails}></View> */}

      <View style={styles.vwInputAndButton}>
        <ButtonKvNoDefaultTextOnly
          onPress={() => {
            console.log("Yes .... Delete ContractPlayerUser for this player");
            handleDeletePlayerUserLink();
            // if (playerName === teamReducer.selectedPlayerObject?.firstName) {
            //   onPressYes(teamReducer.selectedPlayerObject);
            // } else {
            //   Alert.alert("Confirm delete", "Player name does not match");
            // }
          }}
          // styleView={[
          //   styles.btnYes,
          //   playerName === teamReducer.selectedPlayerObject?.firstName &&
          //     styles.btnYesSelected,
          // ]}
          styleView={styles.btnYes}
          styleText={styles.txtBtnYes}
        >
          Yes
        </ButtonKvNoDefaultTextOnly>
        {/* <Text>{JSON.stringify(playerObject, null, 2)}</Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    // width: "80%",
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.2,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    gap: 20,
  },
  // Make the title inline
  vwModalTitle: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    alignItems: "center",
    flexShrink: 1,
    // marginBottom: 20,
  },
  txtModalTitle: {
    fontSize: 18,
    // fontWeight: "bold",
    // marginBottom: 20,
    textAlign: "center",
  },
  txtModalTitlePlayerName: {
    textDecorationLine: "underline",
    textDecorationColor: "black", // optional, defaults to text color
  },
  vwVideoDetails: {
    width: "100%",
    // alignItems: "center",
    marginBottom: 20,
  },
  vwInputAndButton: {
    width: "100%",
    alignItems: "center",
    // marginBottom: 20,
    gap: 10,
  },
  txtInputPlayerName: {
    width: "100%",
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#806181",
    padding: 5,
  },
  btnYes: {
    justifyContent: "center",
    alignItems: "center",
    // height: 40,
    width: 100,
    borderRadius: 20,
    color: "white",
    backgroundColor: "#E8E8E8",
    borderColor: "#806181",
    borderWidth: 2,
    padding: 5,
  },
  btnYesSelected: {
    borderColor: "#FF6666",
    borderWidth: 4,
  },
  txtBtnYes: {
    fontSize: 24,
    color: "#806181",
    justifyContent: "center",
    alignItems: "center",
  },
});
