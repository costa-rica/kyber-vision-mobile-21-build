import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import {
  filterReviewReducerActionsArrayOnPlayer,
  toggleReviewReducerActionIsFavorite,
  filterReviewReducerActionsArrayOnIsFavorite,
  filterReviewReducerActionsArrayShowAll,
  // pressedActionInReviewReducerActionArray,
} from "../../reducers/review";
import SwitchKvWhite from "./buttons/SwitchKvWhite";
import Timeline from "./Timeline";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ButtonKvImage from "./buttons/ButtonKvImage";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import YoutubePlayer from "react-native-youtube-iframe";

export default function ReviewVideoLandscape(props) {
  const reviewReducer = useSelector((state) => state.review);
  const dispatch = useDispatch();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [topAndRightIsVisible, setTopAndRightIsVisible] = useState(false);
  const vwVideo = {
    flex: 1,
    backgroundColor: "white",
    height: Dimensions.get("window").height,
    width: "100%",
  };
  const [isFavoritesOnly, setIsFavoritesOnly] = useState(
    reviewReducer.isFavoriteToggle
  );
  const [videoWidth, setVideoWidth] = useState(Dimensions.get("window").width);
  const [videoHeight, setVideoHeight] = useState(
    Dimensions.get("window").height
  );

  const flatListRef = useRef(null); // 🔹 Store FlatList ref
  // 🔹 Function to manually scroll to the currently playing action
  const forceScrollFlatlistToAction = () => {
    const currentPlayingIndex =
      reviewReducer.reviewReducerActionsArray.findIndex(
        (action) => action.isPlaying
      );

    if (flatListRef.current && currentPlayingIndex !== -1) {
      flatListRef.current.scrollToIndex({
        index: currentPlayingIndex,
        animated: true,
        viewPosition: 0.5, // Center the action in view
      });
    }
  };
  useEffect(() => {
    setIsFavoritesOnly(reviewReducer.isFavoriteToggle);
  }, [reviewReducer.isFavoriteToggle]);

  // 🔹 Function to render each action in the FlatList
  const renderActionItem = ({ item }) => {
    if (!item.isDisplayed) return null;
    if (!item.isPlaying) {
      return (
        <TouchableOpacity
          style={styles.touchOpAction}
          onPress={() =>
            // props.setCurrentTimeManager(item.timestamp - 0.75, item)
            props.handleSelectedAction(item)
          }
        >
          {item.isFavorite && (
            <Image
              source={require("../../assets/images/reviewVideoFavoriteStarYellowInterior.png")}
              resizeMode="contain"
              style={styles.imgIsFavorite}
            />
          )}
          <Text style={styles.txtAction}>
            {item.reviewVideoActionsArrayIndex}{" "}
          </Text>
          {/* <Text style={{ fontSize: 10, color: "white" }}>{item.playerId}</Text> */}
        </TouchableOpacity>
      );
    }
    return (
      <View>
        <TouchableOpacity
          style={styles.touchOpBtnFavorite}
          onPress={() =>
            dispatch(toggleReviewReducerActionIsFavorite(item.actionsDbTableId))
          }
        >
          <Image
            source={require("../../assets/images/btnReviewVideoFavoriteStar.png")}
            resizeMode="contain"
            style={styles.imgBtnFavorite}
          />
        </TouchableOpacity>
        <TouchableOpacity
          // style={styles.touchOpActionPlaying}
          style={[styles.touchOpAction, styles.touchOpActionPlaying]}
          onPress={() =>
            // props.setCurrentTimeManager(item.timestamp - 0.75, item)
            props.handleSelectedAction(item)
          }
        >
          {item.isFavorite && (
            <Image
              source={require("../../assets/images/reviewVideoFavoriteStarYellowInterior.png")}
              resizeMode="contain"
              style={styles.imgIsFavorite}
            />
          )}
          <Text style={[styles.txtAction]}>
            {item.reviewVideoActionsArrayIndex}{" "}
          </Text>
          {/* <Text style={{ fontSize: 10, color: "white" }}>{item.playerId}</Text> */}
        </TouchableOpacity>
      </View>
    );
  };

  // ---- Dynamic Styles ---
  useEffect(() => {
    const handleDimensionChange = ({ window }) => {
      setVideoWidth(window.width);
      setVideoHeight(window.height);
    };

    const subscription = Dimensions.addEventListener(
      "change",
      handleDimensionChange
    );

    return () => {
      subscription.remove();
    };
  }, []);
  // const videoHeight = Dimensions.get("window").height;
  // const videoWidth = Dimensions.get("window").width;
  const stylesVideoWrapper = {
    // position: "relative",
    width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
    height: videoHeight,
  };
  const stylesContainerBottom = {
    position: "absolute",
    bottom: 15,
    width: Dimensions.get("window").width,
    zIndex: 1,
    flexDirection: "row",
    gap: 5,
    height: 90,
  };
  const stylesVwContainerBottomLeft = {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
    width: Dimensions.get("window").width * 0.12,
    // backgroundColor: "green",
  };
  const stylesVwActionsFlatListSuper = {
    width: Dimensions.get("window").width * 0.7,
  };
  const stylesVwActionsFlatList = {
    flexDirection: "row",
    // gap: 5,
    paddingTop: 35,
    paddingBottom: 10,
    paddingLeft: 10,
    flexGrow: 1,
  };
  const stylesTouchOpSetTopAndRightIsVisible = {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
    // width: 30,
    // height: 30,
    // backgroundColor: "white",
  };

  return (
    <View style={styles.container}>
      <View style={{ position: "absolute", top: 15, left: 15, zIndex: 1 }}>
        <TouchableOpacity
          // style={styles.touchOpCircle}
          onPress={() => {
            props.handleBackPress();
          }}
        >
          <Image
            //style={{ width: 24, height: 24 }} // Adjust based on expected size
            source={require("../../assets/images/navigationAndSmall/btnBackArrowWhite.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {!topAndRightIsVisible && (
        <TouchableOpacity
          onPress={() => setTopAndRightIsVisible(true)}
          style={stylesTouchOpSetTopAndRightIsVisible}
        >
          <Image
            source={require("../../assets/images/btnReviewVideoSideTab.png")}
            resizeMode="contain"
            style={{}}
          />
        </TouchableOpacity>
      )}
      {topAndRightIsVisible && (
        <View style={styles.containerTopRight}>
          <View style={styles.vwPlayersSelectedGroupAndFavoritesSuper}>
            <TouchableOpacity
              onPress={() => setTopAndRightIsVisible(false)}
              style={styles.containerTopRightSideTabClose}
            >
              <Image
                source={require("../../assets/images/btnReviewVideoSideTabClose.png")}
                resizeMode="contain"
                style={{}}
              />
            </TouchableOpacity>
            {/* <View style={styles.vwPlayersSelectedGroupSuper}> */}
            <View style={styles.vwPlayersSelectedGroupAndFavorites}>
              <View style={styles.vwPlayersSelectedGroup}>
                <Text style={styles.txtPlayersTitle}>Players</Text>
                <View style={styles.vwPlayersSelectedAndDropDown}>
                  <View style={styles.vwPlayersSelected}>
                    {reviewReducer.reviewReducerListOfPlayerDbObjects.map(
                      (playerDbObject) => {
                        if (playerDbObject.isDisplayed) {
                          return (
                            <TouchableOpacity
                              key={playerDbObject.id}
                              onPress={() =>
                                props.filterActions("player", playerDbObject)
                              }
                              style={styles.touchOpSelectPlayer}
                            >
                              <Text style={styles.txtPlayer}>
                                {playerDbObject.firstName.substring(0, 3)}
                              </Text>
                              <Image
                                source={require("../../assets/images/whiteX.png")}
                                resizeMode="contain"
                                style={{
                                  width: 15,
                                  height: 15,
                                  paddingLeft: 5,
                                }}
                              />
                              {/* <Text style={styles.txtPlayerX}> x</Text> */}
                            </TouchableOpacity>
                          );
                        }
                      }
                    )}
                  </View>
                  <View style={styles.vwPlayersDropDownArrow}>
                    <TouchableOpacity
                      onPress={() => setDropdownVisible(!isDropdownVisible)}
                    >
                      <Image
                        source={require("../../assets/images/buttons/btnReviewVideoPlayersDownArrow.png")}
                        resizeMode="contain"
                        style={{
                          transform: [
                            { rotate: isDropdownVisible ? "90deg" : "0deg" },
                          ],
                          width: 20,
                          height: 20,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.vwFavoritesSwitchAndTitle}>
                <Text style={styles.txtFavoritesTitle}>Favorites Only</Text>
                <View style={styles.vwFavoritesSwitch}>
                  <SwitchKvWhite
                    state={isFavoritesOnly}
                    onPressCustom={() => {
                      dispatch(filterReviewReducerActionsArrayOnIsFavorite());
                      forceScrollFlatlistToAction(); // 👈 Only triggers when the button is pressed
                    }}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* <View style={styles.containerMiddleRight}> */}
          <View style={styles.vwShare}>
            <TouchableOpacity
              onPress={() => {
                console.log("pressed middle right");
                props.handlePressRequestMontageVideo();
              }}
              style={styles.touchOpMiddleRight}
            >
              <Image
                source={require("../../assets/images/buttons/btnShareDiagram.png")}
                resizeMode="contain"
                style={{ width: 30, height: 30 }}
              />
              <Text style={styles.txtMiddleRight}>
                Share or export{" "}
                {
                  reviewReducer.reviewReducerActionsArray.filter(
                    (action) => action.isDisplayed
                  ).length
                }{" "}
                actions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* <View style={styles.videoWrapper}> */}
      <View style={stylesVideoWrapper}>
        <YoutubePlayer
          ref={props.playerRef}
          height={videoHeight}
          width={videoWidth}
          play={props.playing}
          videoId={reviewReducer.reviewReducerVideoObject.youTubeVideoId}
          onChangeState={props.handleStateChange}
          webViewProps={{
            allowsInlineMediaPlayback: true,
          }}
          initialPlayerParams={{
            controls: 0,
            modestbranding: true,
            rel: 0,
            showinfo: false,
          }}
        />
        <View style={styles.coverView} />
      </View>
      <View style={stylesContainerBottom}>
        <View style={stylesVwContainerBottomLeft}>
          <ButtonKvImage
            onPress={() => {
              // console.log("rotate screen to landscape");
              // correctOrientationFromStart();
              //   props.player.playing ? props.player.pause() : props.player.play();
              //   props.playing ? props.player.pause() : props.player.play();
              props.togglePlaying();
            }}
            style={{ padding: 0 }}
          >
            <View style={styles.vwBtnPausePlay}>
              <Image
                source={
                  props.playing
                    ? require("../../assets/images/buttons/btnPause.png")
                    : require("../../assets/images/buttons/btnPlay.png")
                }
                alt="logo"
                resizeMode="contain"
                style={{ width: 20, height: 20 }}
              />
            </View>
          </ButtonKvImage>

          <ButtonKvImage
            onPress={() => {
              dispatch(filterReviewReducerActionsArrayShowAll());
            }}
            style={styles.vwBtnShowAll}
          >
            {/* <View style={styles.vwBtnShowAll}> */}
            <Text style={styles.txtShowAll}>tout lire</Text>
            {/* </View> */}
          </ButtonKvImage>
        </View>
        {/* 🔹 FlatList for Actions */}
        <View style={stylesVwActionsFlatListSuper}>
          <FlatList
            ref={flatListRef} // Attach ref
            data={reviewReducer.reviewReducerActionsArray}
            renderItem={renderActionItem}
            keyExtractor={(item) =>
              // item.reviewVideoActionsArrayIndex.toString()
              item.reviewVideoActionsArrayIndex
            }
            horizontal={true}
            contentContainerStyle={stylesVwActionsFlatList}
            extraData={reviewReducer.reviewReducerActionsArray} // Ensures re-render
            getItemLayout={(data, index) => ({
              length: 50, // Approximate item width
              offset: 50 * index, // Offset for accurate scrolling
              index,
            })}
            showsHorizontalScrollIndicator={false} // Optional: hide scrollbar
          />
        </View>
      </View>
      {/* Timeline */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: Dimensions.get("window").width,
          height: 15,
          //   backgroundColor: "red",
          // justifyContent: "center",
          zIndex: 2,
        }}
      >
        <GestureHandlerRootView style={styles.gestureViewTimeline}>
          <Timeline
            // videoProgress={props.progress}
            // setCurrentTimeManager={props.setCurrentTimeManager}
            currentTime={props.currentTime}
            duration={props.duration}
            playerRef={props.playerRef}
            onSeek={props.onSeek}
          />
        </GestureHandlerRootView>
      </View>
      {isDropdownVisible && (
        <View style={styles.vwPlayersOptions}>
          {reviewReducer.reviewReducerListOfPlayerDbObjects.map(
            (playerDbObject) => {
              if (!playerDbObject.isDisplayed) {
                return (
                  <TouchableOpacity
                    key={playerDbObject.id}
                    onPress={() => {
                      dispatch(
                        filterReviewReducerActionsArrayOnPlayer(playerDbObject)
                      );
                      forceScrollFlatlistToAction(); // 👈 Only triggers when the button is pressed
                    }}
                    style={styles.touchOpSelectPlayer}
                  >
                    <Text>{playerDbObject.firstName.substring(0, 3)}</Text>
                  </TouchableOpacity>
                );
              }
            }
          )}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "purple",
  },

  containerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    // width: 400,
    // height: 50,
    zIndex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottomLeftRadius: 12, // Round bottom-left corner
    // backgroundColor: "rgba(74,74,74,.74)",
    flexDirection: "row",
    // gap: 10,
    padding: 3,
  },
  containerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    // width: 400,
    // height: 50,
    zIndex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  vwPlayersSelectedGroupAndFavoritesSuper: {
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottomLeftRadius: 12, // Round bottom-left corner
    // backgroundColor: "rgba(74,74,74,.74)",
    flexDirection: "row",
    // gap: 10,
    // padding: 3,
  },
  containerTopRightSideTabClose: {
    // position: "absolute",
    // top: 0,
    // left: -,
  },
  vwFavoritesSwitch: {
    height: 50,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  txtFavoritesTitle: {
    color: "white",
    fontWeight: "bold",
  },
  vwPlayersSelectedGroupAndFavorites: {
    // justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    // padding: 3,
    backgroundColor: "rgba(74,74,74,.74)",
    borderBottomLeftRadius: 10,
  },
  vwPlayersSelectedGroup: {
    // justifyContent: "center",
    // flexDirection: "row",
    alignItems: "center",
    padding: 3,
  },
  txtPlayersTitle: {
    color: "white",
    fontWeight: "bold",
  },
  vwPlayersSelectedAndDropDown: {
    backgroundColor: "rgba(209,207,201,1)",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    padding: 3,
    borderRadius: 5,
    height: 50,
  },
  vwPlayersSelected: {
    flexDirection: "row",
    gap: 5,
  },
  imgWhiteX: {
    width: 12,
    height: 12,
  },
  // -- hidden --
  vwPlayersOptions: {
    position: "absolute",
    top: 80,
    right: 120,
    backgroundColor: "rgba(74,74,74,.74)",
    zIndex: 1,
    borderRadius: 12,
    flexDirection: "row",
    gap: 5,
    padding: 5,
  },
  touchOpSelectPlayer: {
    // backgroundColor: "white",
    backgroundColor: "rgba(110,110,110,1)",
    padding: 5,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  txtPlayer: {
    color: "white",
    // fontWeight: "bold",
    fontFamily: "ApfelGrotezk",
  },
  // txtPlayerX: {
  //   color: "white",
  //   // fontWeight: "bold",
  //   fontSize: 20,
  //   fontFamily: "ApfelGrotezkBold",
  //   backgroundColor: "purple",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   alignSelf: "center",
  //   textAlign: "center",
  // },

  // --- middle right: share ---
  // containerMiddleRight: {
  vwShare: {
    // position: "absolute",
    // top: 80,
    // right: 0,
    width: 70,
    backgroundColor: "rgba(74,74,74,.74)",
    zIndex: 1,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    flexDirection: "row",
    gap: 5,
    padding: 5,
    // alignItems: "center",
    justifyContent: "center",
  },
  touchOpMiddleRight: {
    // backgroundColor: "rgba(110,110,110,1)",
    padding: 2,
    borderRadius: 5,
    // flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
  },
  txtMiddleRight: {
    color: "white",
    // fontWeight: "bold",
    fontFamily: "ApfelGrotezk",
    fontSize: 12,
    textAlign: "center",
  },

  // --------  YOUTUBE VIDEO WRAPPER --------
  //   videoWrapper: {
  //     position: "relative",
  //     width: "100%",
  //     height: 220,
  //   },
  coverView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    opacity: 0.7,
    // zIndex: 1,
  },
  // ------ END YOUTUBE VIDEO WRAPPER ------

  // -- BOTTOM ---
  vwBtnPausePlay: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 35,
    // width: 50,
    height: 40,
    paddingLeft: 20,
    paddingBottom: 20,
  },
  vwBtnShowAll: {
    padding: 0,
    paddingBottom: 20,
  },
  txtShowAll: {
    color: "white",
    fontFamily: "ApfelGrotezk",
    fontSize: 15,
    // textAlign: "center",
  },
  txtAction: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "ApfelGrotezkBold",
    fontSize: 20,
    // textAlign: "center",
  },
  touchOpAction: {
    borderRadius: 5,
    backgroundColor: "rgba(110,110,110,.7)",
    justifyContent: "center",
    alignItems: "center",
    width: 45,
    height: 45,
    marginLeft: 5,
  },
  touchOpActionPlaying: {
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 12,
  },
  imgIsFavorite: {
    position: "absolute",
    top: -15,
    // left: 15,
    width: 20,
    height: 20,
    zIndex: 20,
  },
  touchOpBtnFavorite: {
    position: "absolute",
    top: -35,
    left: 10,
    // width: 20,
    // height: 20,
    // justifyContent: "center",
    // alignItems: "center",
  },
  // imgBtnFavorite: {
  //   paddingLeft: 15,
  //   backgroundColor: "green",
  // },
  // --- Timeline ---
  gestureViewTimeline: {
    alignItems: "center",
    height: 30,
    // width: 100,
    // backgroundColor: "red",
    zIndex: 2,
  },
});
