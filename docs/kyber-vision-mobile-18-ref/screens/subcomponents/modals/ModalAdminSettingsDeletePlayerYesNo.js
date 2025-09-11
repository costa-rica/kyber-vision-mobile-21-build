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

export default function ModalAdminSettingsDeletePlayerYesNo({ onPressYes }) {
  const teamReducer = useSelector((state) => state.team);
  const [playerName, setPlayerName] = useState("");
  return (
    <View style={styles.modalContent}>
      <View style={styles.vwModalTitle}>
        <Text style={styles.txtModalTitle}>
          Are you sure you want to remove{" "}
          <Text style={styles.txtModalTitlePlayerName}>
            {teamReducer.selectedPlayerObject?.firstName}{" "}
            {teamReducer.selectedPlayerObject?.lastName} (player id:{" "}
            {teamReducer.selectedPlayerObject?.id})
          </Text>{" "}
          from the team ?
        </Text>
      </View>
      <View style={styles.vwVideoDetails}></View>

      <View style={styles.vwInputAndButton}>
        {/* <Text>Enter player first name:</Text>
        <TextInput
          // placeholder="Enter player first name"
          style={styles.txtInputPlayerName}
          value={playerName}
          onChangeText={setPlayerName}
        /> */}
        <ButtonKvNoDefaultTextOnly
          onPress={() => {
            console.log("Yes .... deleting player");
            // if (playerName === teamReducer.selectedPlayerObject?.firstName) {
            onPressYes(teamReducer.selectedPlayerObject);
            // } else {
            //   Alert.alert("Confirm delete", "Player name does not match");
            // }
          }}
          styleView={[
            styles.btnYes,
            playerName === teamReducer.selectedPlayerObject?.firstName &&
              styles.btnYesSelected,
          ]}
          styleText={styles.txtBtnYes}
        >
          Yes
        </ButtonKvNoDefaultTextOnly>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    // width: "80%",
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.3,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
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
