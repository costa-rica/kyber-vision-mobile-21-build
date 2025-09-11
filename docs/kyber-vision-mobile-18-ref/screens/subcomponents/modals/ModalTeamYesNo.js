import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import ButtonKvStd from "../buttons/ButtonKvStd";
import ButtonKvNoDefault from "../buttons/ButtonKvNoDefault";
import { useSelector } from "react-redux";

export default function ModalTeamYesNo({ onPressYes }) {
  const teamReducer = useSelector((state) => state.team);
  return (
    <View style={styles.modalContent}>
      <Text style={styles.txtModalTitle}>
        Are you sure you want to delete this player ?
      </Text>
      <View style={styles.vwVideoDetails}>
        <Text>
          Remove: {teamReducer.selectedPlayerObject?.firstName}{" "}
          {teamReducer.selectedPlayerObject?.lastName}
        </Text>
      </View>

      <View style={styles.vwButtons}>
        <ButtonKvStd
          onPress={() => {
            console.log("Yes ....");
            onPressYes();
          }}
        >
          Yes
        </ButtonKvStd>
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
  txtModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  vwVideoDetails: {
    width: "100%",
    // alignItems: "center",
    marginBottom: 20,
  },
});
