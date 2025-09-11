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
import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { updateUploadReducerModalUploadVideoSelectedSessionObject } from "../../../reducers/upload";

export default function ModalUploadVideo({ handleSendVideo }) {
  const userReducer = useSelector((state) => state.user);
  const reviewReducer = useSelector((state) => state.review);
  const scriptReducer = useSelector((state) => state.script);
  const uploadReducer = useSelector((state) => state.upload);
  const [selectedSession, setSelectedSession] = useState(null);
  const dispatch = useDispatch();

  // const handleSendVideo = async (video) => {
  //   dispatch(updateUploadReducerLoading(true));
  //   const formData = new FormData();
  //   formData.append("video", {
  //     uri: video.uri,
  //     name: video.fileName || "video.mp4",
  //     type: "video/mp4",
  //   });
  //   formData.append("sessionId", selectedSession.id);

  //   const controller = new AbortController();
  //   const timeout = setTimeout(() => controller.abort(), 120000); // 120 sec timeout
  //   console.log("uploading ... ");
  //   console.log("sessionId: ", selectedSession.id);
  //   console.log(`formData: `);
  //   console.log(formData);

  //   try {
  //     const response = await fetch(
  //       `${process.env.EXPO_PUBLIC_API_BASE_URL}/videos/upload-youtube`,
  //       {
  //         method: "POST",
  //         body: formData,
  //         signal: controller.signal,
  //         headers: {
  //           Authorization: `Bearer ${userReducer.token}`,
  //         },
  //       }
  //     );
  //     clearTimeout(timeout);
  //     const data = await response.json();
  //     console.log("Upload response:", data);
  //     dispatch(updateUploadReducerLoading(false));
  //     Alert.alert("Success", "Video sent successfully!");
  //   } catch (error) {
  //     clearTimeout(timeout);
  //     console.error("Upload error:", error);
  //     dispatch(updateUploadReducerLoading(false));
  //     Alert.alert("Error", "Failed to send video.");
  //   }
  // };

  return (
    <View style={styles.modalContent}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Link video to session
      </Text>
      <View style={styles.vwSelectionDetails}>
        <View style={{ flexDirection: "row" }}>
          <Text>Uploading:</Text>
          <Text
            style={{ backgroundColor: "#E8E8E8", borderRadius: 5, padding: 2 }}
          >
            {uploadReducer.uploadReducerSelectedVideoObject?.fileName}
          </Text>
        </View>
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <Text>To session ID:</Text>
          <Text
            style={{ backgroundColor: "#E8E8E8", borderRadius: 5, padding: 2 }}
          >
            {
              uploadReducer.uploadReducerModalUploadVideoSelectedSessionObject
                ?.id
            }
          </Text>
        </View>
      </View>
      <View style={styles.vwVideoHeader}>
        <Text style={styles.txtVideoItemDate}>Date</Text>
        <Text style={styles.txtVideoItemCity}>City</Text>
        <Text style={styles.txtVideoItemSessionId}>Session ID</Text>
      </View>
      <View style={styles.underline} />
      <FlatList
        data={scriptReducer.sessionsArray}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ButtonKvNoDefault
            // onPress={() => setSelectedSession(item)}
            onPress={() =>
              dispatch(
                updateUploadReducerModalUploadVideoSelectedSessionObject(item)
              )
            }
            styleView={styles.btnVideoItem}
          >
            <Text style={styles.txtVideoItemDate}>
              {item.sessionDateString}
            </Text>
            <Text style={styles.txtVideoItemCity}>{item.city}</Text>
            <Text style={styles.txtVideoItemSessionId}>{item.id}</Text>
          </ButtonKvNoDefault>
        )}
      />

      <View style={styles.vwButtons}>
        <ButtonKvStd
          onPress={() => {
            console.log("uploading [ModalUploadVideo] ....");
            // handleSendVideo(reviewReducer.selectedVideoObject);
            handleSendVideo(uploadReducer.uploadReducerSelectedVideoObject);
            // handleUploadVideoTest();
          }}
        >
          Upload
        </ButtonKvStd>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  //   modalWrapper: {
  //     flex: 1,
  //     justifyContent: "center",
  //     alignItems: "center",
  //     // width: Dimensions.get("window").width * 0.95,
  //     height: Dimensions.get("window").height * 0.9,
  //   },
  modalContent: {
    // width: "80%",
    width: Dimensions.get("window").width * 0.95,
    height: Dimensions.get("window").height * 0.5,
    padding: 2,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  vwSelectionDetails: {
    // flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginTop: 10,
    // width: Dimensions.get("window").width * 0.8,
  },
  vwVideoHeader: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    paddingHorizontal: 5,
    marginTop: 10,
    width: Dimensions.get("window").width * 0.8,
  },
  underline: {
    height: 1,
    backgroundColor: "#ccc",
    width: Dimensions.get("window").width * 0.9,
    alignSelf: "center",
    marginBottom: 5,
  },
  txtVideoItemDate: {
    width: Dimensions.get("window").width * 0.3,
    color: "black",
    fontSize: 11,
    // backgroundColor: "red",
  },
  txtVideoItemCity: {
    width: Dimensions.get("window").width * 0.3,
    color: "black",
    fontSize: 11,
    // textAlign: "center",
  },
  txtVideoItemSessionId: {
    width: Dimensions.get("window").width * 0.2,
    color: "black",
    fontSize: 11,
    textAlign: "center",
    // backgroundColor: "red",
  },
  btnVideoItem: {
    backgroundColor: "#E8E8E8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    marginVertical: 5,
    // width: Dimensions.get("window").width * 0.95,
    width: "100%",
    borderColor: "#806181",
    borderWidth: 1,
  },
});
