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

export default function ModalUploadVideoYesNo({ onPressYes }) {
  const uploadReducer = useSelector((state) => state.upload);
  return (
    <View style={styles.modalContent}>
      <Text style={styles.txtModalTitle}>
        Are you sure you want to delete this video?
      </Text>
      <View style={styles.vwVideoDetails}>
        <Text>
          filename: {uploadReducer.uploadReducerDeleteVideoObject.filename}
        </Text>
        <Text>video ID: {uploadReducer.uploadReducerDeleteVideoObject.id}</Text>
        <Text>
          session date:{" "}
          {new Date(
            uploadReducer.uploadReducerDeleteVideoObject.session.sessionDate
          ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          })}{" "}
          {new Date(
            uploadReducer.uploadReducerDeleteVideoObject.session.sessionDate
          ).toLocaleTimeString("en-GB", {
            hour: "2-digit",
          })}
          h
        </Text>
        <Text>
          Session ID: {uploadReducer.uploadReducerDeleteVideoObject.session.id}
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
