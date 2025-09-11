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
} from "react-native";
// import TemplateViewWithTopChildren from "./subcomponents/TemplateViewWithTopChildren";
import TemplateViewWithTopChildrenSmall from "./subcomponents/TemplateViewWithTopChildrenSmall";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { updateTeamsArray } from "../reducers/user";
// import { updateReviewReducerSelectedVideoObject } from "../reducers/review";
import {
  updateUploadReducerSelectedVideoObject,
  updateUploadReducerLoading,
  updateUploadReducerDeleteVideoObject,
} from "../reducers/upload";
import * as ImagePicker from "expo-image-picker";
import ButtonKvNoDefault from "./subcomponents/buttons/ButtonKvNoDefault";
import ButtonKvNoDefaultTextOnly from "./subcomponents/buttons/ButtonKvNoDefaultTextOnly";
import ModalUploadVideo from "./subcomponents/modals/ModalUploadVideo";
import ModalUploadVideoYesNo from "./subcomponents/modals/ModalUploadVideoYesNo";

export default function UploadVideoScreen({ navigation }) {
  const userReducer = useSelector((state) => state.user);
  const uploadReducer = useSelector((state) => state.upload);
  const teamReducer = useSelector((state) => state.team);
  const [displayTeamList, setDisplayTeamList] = useState(false);
  const dispatch = useDispatch();
  const [selectedVideosArray, setSelectedVideosArray] = useState([]);
  const [isVisibleModalUploadVideo, setIsVisibleModalUploadVideo] =
    useState(false);
  const [isVisibleModalDeleteVideo, setIsVisibleModalDeleteVideo] =
    useState(false);
  const [userVideosArray, setUserVideosArray] = useState([]);
  const [containerBottomExpanded, setContainerBottomExpanded] = useState(false);

  useEffect(() => {
    fetchUserVideosArray();
  }, []);
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

  const handleSelectVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied", "We need access to your media.");
      return;
    }
    // setIsVisibleModalLoading(true);
    dispatch(updateUploadReducerLoading(true));
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const assets = result.assets || [];
      setSelectedVideosArray((prev) => [...prev, ...assets]);
      //   console.log(result.assets);
    }
    // setIsVisibleModalLoading(false);
    dispatch(updateUploadReducerLoading(false));
  };

  const fetchUserVideosArray = async () => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/videos/user`,
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
      const tempArray = resJson.videosArray.map((item) => {
        return {
          ...item,
          selected: false,
        };
      });
      console.log(`Count of videos: ${tempArray.length}`);
      // console.log(`tempArray: ${JSON.stringify(tempArray, null, 2)}`);
      setUserVideosArray(tempArray);
    } else {
      const errorMessage =
        resJson?.error ||
        `There was a server error (and no resJson): ${response.status}`;
      alert(errorMessage);
    }
  };

  const handleSendVideo = async (video) => {
    console.log(" --- > in handleSendVideo");
    dispatch(updateUploadReducerLoading(true));
    const formData = new FormData();
    console.log(" --- [2]");
    formData.append("video", {
      uri: video.uri,
      name: video.fileName || "video.mp4",
      type: "video/mp4",
    });
    // console.log(JSON.stringify(video, null, 2));
    // formData.append("sessionId", video.session.id);
    formData.append(
      "sessionId",
      uploadReducer.uploadReducerModalUploadVideoSelectedSessionObject.id
    );
    // console.log(" --- > in handleSendVideo [3]");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000); // 120 sec timeout
    console.log("uploading ... ");
    console.log(
      "---> sessionId: ",
      uploadReducer.uploadReducerModalUploadVideoSelectedSessionObject.id
    );
    console.log(`formData: `);
    console.log(formData);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/videos/upload-youtube`,
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${userReducer.token}`,
          },
        }
      );
      clearTimeout(timeout);
      const data = await response.json();
      console.log("Upload response:", data);
      dispatch(updateUploadReducerLoading(false));
      setIsVisibleModalUploadVideo(false);
      Alert.alert("Success", "Video sent successfully!");
    } catch (error) {
      clearTimeout(timeout);
      console.error("Upload error:", error);
      dispatch(updateUploadReducerLoading(false));
      Alert.alert("Error", "Failed to send video.");
    }
  };

  const handleDeleteVideo = async () => {
    console.log("---- > handleDeleteVideo");
    const fetchUrl = `${process.env.EXPO_PUBLIC_API_BASE_URL}/videos/${uploadReducer.uploadReducerDeleteVideoObject.id}`;
    console.log("fetchUrl: ", fetchUrl);
    console.log("userReducer.token: ", userReducer.token);
    const response = await fetch(fetchUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userReducer.token}`, // Add token to Authorization header
      },
      // body: JSON.stringify({ videoId: videoObj.id }),
    });
    if (response.status == 200) {
      fetchUserVideosArray();
      const resJson = await response.json();
      window.alert(resJson.message);
      setIsVisibleModalDeleteVideo(false);
    } else {
      window.alert(`There was a server error: ${response.status}`);
    }
  };

  const whichModalToDisplay = () => {
    if (isVisibleModalUploadVideo) {
      return {
        modalComponent: <ModalUploadVideo handleSendVideo={handleSendVideo} />,
        useState: isVisibleModalUploadVideo,
        useStateSetter: setIsVisibleModalUploadVideo,
      };
    }

    if (isVisibleModalDeleteVideo) {
      return {
        modalComponent: (
          <ModalUploadVideoYesNo onPressYes={handleDeleteVideo} />
        ),
        useState: isVisibleModalDeleteVideo,
        useStateSetter: setIsVisibleModalDeleteVideo,
      };
    }
  };

  return (
    <TemplateViewWithTopChildrenSmall
      navigation={navigation}
      topChildren={topChildren}
      screenName={"UploadVideoScreen"}
      // isVisibleModal={isVisibleModalUploadVideo}
      // setDisplayModal={setIsVisibleModalUploadVideo}
      // modalComponent={<ModalUploadVideo />}
      // modalComponent={whichModalToDisplay()}
      modalComponentAndSetterObject={whichModalToDisplay()}
      topHeight={"20%"}
      // isVisibleModalLoading={isVisibleModalLoading}
    >
      <View style={styles.container}>
        {/* -------- 
        
        TOP 
        
        ----- */}

        <View style={styles.containerTop}>
          <ButtonKvNoDefaultTextOnly
            onPress={() => {
              console.log("Upload Video");
              handleSelectVideo();
            }}
            styleView={styles.btnSelectVideo}
            styleText={styles.txtSelectVideo}
          >
            Add new files from the Gallery
          </ButtonKvNoDefaultTextOnly>

          <View style={styles.vwVideoHeader}>
            <Text style={styles.txtVideoItemFilename}>Filename</Text>
            {/* <Text>Filename</Text> */}
            <Text style={styles.txtVideoItemShort}>Dur. (s)</Text>
            <Text style={styles.txtVideoItemShort}>Size (MB)</Text>
            <Text style={styles.txtVideoItemDimensions}>Dimensions</Text>
          </View>
          <View style={styles.underline} />
          <FlatList
            data={selectedVideosArray}
            keyExtractor={(item) => item.uri}
            renderItem={({ item }) => (
              <ButtonKvNoDefault
                onPress={() => {
                  console.log("Select Video");
                  dispatch(updateUploadReducerSelectedVideoObject(item));
                  setIsVisibleModalUploadVideo(true);
                }}
                styleView={styles.btnVideoItem}
                styleText={styles.txtVideoItem}
              >
                {/* <View style={styles.vwVideoItem}> */}
                <Text style={styles.txtVideoItemFilename}>{item.fileName}</Text>
                <Text style={styles.txtVideoItemShort}>
                  {(item.duration / 1000).toFixed(0)}
                </Text>
                <Text style={styles.txtVideoItemShort}>
                  {(item.fileSize / 1000000)
                    .toFixed(0)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
                <Text style={styles.txtVideoItemDimensions}>
                  {item.height} x {item.width}
                </Text>
                {/* </View> */}
              </ButtonKvNoDefault>
            )}
          />
        </View>

        {/* ------------ 
        
        BOTTOM 
        
        ------------ */}

        <View
          style={[
            styles.containerBottom,
            containerBottomExpanded && styles.containerBottomExpanded,
          ]}
        >
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={() => setContainerBottomExpanded(!containerBottomExpanded)}
          >
            <Text> Videos Uploaded </Text>

            <View style={styles.vwVideoHeaderBottom}>
              <Text style={styles.txtVideoItemFilename}>Filename</Text>
              <Text style={styles.txtVideoItemShort}>Date</Text>
              {/* <Text style={styles.txtVideoItemShort}>Size (MB)</Text>
            <Text style={styles.txtVideoItemDimensions}>Dimensions</Text> */}
              <Text
                style={[styles.txtVideoItemShort, { textAlign: "right" }]}
              ></Text>
            </View>

            <View style={styles.underline} />
          </TouchableOpacity>

          <View style={styles.vwUserVideoList}>
            <FlatList
              data={userVideosArray}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.vwUserVideoItem}>
                  <Text style={styles.txtVideoItemFilename}>
                    {item.filename}
                  </Text>
                  <Text>
                    {new Date(item.session.sessionDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                      }
                    )}{" "}
                    {new Date(item.session.sessionDate).toLocaleTimeString(
                      "en-GB",
                      {
                        hour: "2-digit",
                      }
                    )}
                    h
                  </Text>

                  <ButtonKvNoDefault
                    onPress={() => {
                      console.log("Delete video", item.id);

                      dispatch(updateUploadReducerDeleteVideoObject(item));
                      setIsVisibleModalDeleteVideo(true);
                    }}
                    styleView={styles.btnDeleteVideo}
                    styleText={styles.txtDeleteVideo}
                  >
                    <Text style={styles.txtDeleteVideo}>X</Text>
                  </ButtonKvNoDefault>
                </View>
              )}
            />
          </View>
        </View>
      </View>
    </TemplateViewWithTopChildrenSmall>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDFD",
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
  // ------------
  // TOP
  // ------------
  containerTop: {
    flex: 1,
    // height: "40%",
    width: Dimensions.get("window").width,
    alignItems: "center",
    paddingVertical: 10,
    // justifyContent: "center",
    // borderWidth: 2, // Adjust thickness as needed
    // borderColor: "gray", // Change color as desired
    // borderStyle: "solid",
    // borderRadius: 10,
    // margin: 3,
  },
  vwVideoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginTop: 10,
    width: Dimensions.get("window").width * 0.9,
  },
  underline: {
    height: 1,
    backgroundColor: "#ccc",
    width: Dimensions.get("window").width * 0.9,
    alignSelf: "center",
    marginBottom: 5,
  },
  txtVideoItemFilename: {
    width: Dimensions.get("window").width * 0.3,
    color: "black",
    // fontWeight: "bold",
    fontSize: 11,
  },

  txtVideoItemShort: {
    width: Dimensions.get("window").width * 0.1,
    color: "black",
    // fontWeight: "bold",
    fontSize: 11,
  },
  txtVideoItemDimensions: {
    width: Dimensions.get("window").width * 0.2,
    color: "black",
    // fontWeight: "bold",
    fontSize: 11,
  },
  btnVideoItem: {
    backgroundColor: "#E8E8E8",
    // display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    marginVertical: 5,
    width: Dimensions.get("window").width * 0.9,
    borderRadius: 10,
    borderColor: "#806181",
    borderWidth: 1,
  },
  vwVideoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
    marginVertical: 5,
    width: Dimensions.get("window").width * 0.9,
    borderRadius: 10,
    borderColor: "#806181",
    borderWidth: 1,
  },

  // ------------
  // BOTTOM
  // ------------
  containerBottom: {
    height: "10%",
    alignItems: "center",
    backgroundColor: "#FDFDFD", // ensure it's not transparent
    shadowColor: "#000", // for iOS
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // for Android
    borderTopLeftRadius: 20, // optional: rounded corners
    borderTopRightRadius: 20, // optional
    paddingTop: 10, // space from top shadow
    // borderWidth: 2, // Adjust thickness as needed
    // borderColor: "gray", // Change color as desired
    // borderStyle: "dashed",
  },
  containerBottomExpanded: {
    height: "60%",
  },

  vwVideoHeaderBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginTop: 10,
    width: Dimensions.get("window").width * 0.9,
    // backgroundColor: "green",
  },

  vwUserVideoList: {
    flex: 1,
    width: Dimensions.get("window").width,
    alignItems: "center",
    paddingVertical: 10,
  },
  btnSelectVideo: {
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "#806181",
    fontSize: 24,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
  },
  txtSelectVideo: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  vwUserVideoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
    marginVertical: 5,
    width: Dimensions.get("window").width * 0.9,
    borderRadius: 10,
    borderColor: "#806181",
    borderWidth: 1,
  },

  btnDeleteVideo: {
    width: 30,
    height: 30,
    // backgroundColor: "#FF5C5C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },

  txtDeleteVideo: {
    color: "gray",
    fontWeight: "bold",
    fontSize: 16,
  },

  // ------------
  // Modal
  // ------------

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  modalContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
