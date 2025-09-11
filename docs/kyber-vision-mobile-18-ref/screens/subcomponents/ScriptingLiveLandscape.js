import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  GestureHandlerRootView,
  GestureDetector,
} from "react-native-gesture-handler";
import TemplateViewWithTopChildrenSmallLandscape from "./TemplateViewWithTopChildrenSmallLandscape";
import * as ScreenOrientation from "expo-screen-orientation";
import Lightning from "../../assets/images/lightning.svg";
import Volleyball from "../../assets/images/volleyball.svg";
import { useSelector } from "react-redux";
import ButtonKvImage from "./buttons/ButtonKvImage";
import BtnService from "../../assets/images/buttons/btnService.svg";
import BtnReception from "../../assets/images/buttons/btnReception.svg";
import SvgVolleyballCourt from "../../assets/images/volleyballCourt.svg";
import ButtonKvStd from "./buttons/ButtonKvStd";
import BtnWin from "../../assets/images/buttons/btnWin.svg";
import BtnLose from "../../assets/images/buttons/btnLose.svg";
import { useDispatch } from "react-redux";
import {
  updateCoordsScriptLiveLandscapeContainerLeft,
  updateCoordsScriptLiveLandscapeContainerMiddleTop,
  updateCoordsScriptLiveLandscapeContainerMiddleBottom,
  updateCoordsScriptLiveLandscapeVwPlayerSuper,
  updateCoordsScriptLiveLandscapeVwBelowSvgVolleyballCourt,
  updatePlayersArray,
  setScriptingForPlayerObject,
} from "../../reducers/script";
import BtnFavorite from "../../assets/images/buttons/btnFavorite.svg";
import ButtonKvNoDefault from "./buttons/ButtonKvNoDefault";

export default function ScriptingLiveLandscape(props) {
  const teamReducer = useSelector((state) => state.team);
  const scriptReducer = useSelector((state) => state.script);
  const dispatch = useDispatch();

  const topChildren = (
    <View style={styles.vwTopChildren}>
      <View style={styles.vwTopChildrenLeft}>
        <Volleyball />
        <Text style={styles.txtTopChildren}>
          {teamReducer.teamsArray.find((tribe) => tribe.selected)?.teamName}
        </Text>
      </View>
      <Lightning />
      <Text style={styles.txtTopChildren}>Opponent</Text>
    </View>
  );

  // const handleBackPress = async () => {

  //   handleExitScriptingLive

  //   console.log("---> [ScriptingLiveLandscape] in handleBackPress");
  //   await ScreenOrientation.lockAsync(
  //     ScreenOrientation.OrientationLock.PORTRAIT_UP
  //   ); // Force back to portrait
  //   props.setOrientation("portrait");
  //   // props.navigation.goBack();
  //   console.log("<--- [ScriptingLiveLandscape] in handleBackPress");
  // };

  // -----------------
  //  Styles
  // -----------------
  /// -- Style params for Button Groups
  // const CIRCLE_SIZE = 100;
  const CIRCLE_SIZE = Dimensions.get("window").width * 0.1;
  const DIAGONAL_LEN = Math.ceil(CIRCLE_SIZE * Math.SQRT2); // ~141
  const LINE_THICKNESS = 8;

  const stylesBtnTop = {
    width: Dimensions.get("window").width * 0.1,
    height: Dimensions.get("window").width * 0.1,
  };

  const stylesBtnBottom = {
    width: Dimensions.get("window").width * 0.1,
    height: Dimensions.get("window").width * 0.1,
  };

  // -------- Styles RIGHT --------
  const stylesVwGroupButtons = {
    // position: "relative",
    // flexDirection: "row",
    // width: Dimensions.get("window").width * 0.4,
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "gray",
    // borderWidth: 5,
    // borderStyle: "dashed",
  };

  const stylesVwGroupButtonsCircle = {
    borderRadius: (Dimensions.get("window").width * 0.1) / 2,
    backgroundColor: "gray",
    width: Dimensions.get("window").width * 0.1,
    height: Dimensions.get("window").width * 0.1,
    // top: Dimensions.get("window").width * 0.05,
    // left:
    //   (Dimensions.get("window").width * 0.4) / 2 -
    //   (Dimensions.get("window").width * 0.2) / 2,
    // position: "absolute",
    backgroundColor: "#806181",
    opacity: 0.25,
  };

  const stylesVwGroupButtonsDiagonalLine = {
    width: DIAGONAL_LEN, // long enough to cross the circle’s corners
    height: LINE_THICKNESS, // line thickness
    borderRadius: LINE_THICKNESS / 2, // rounded ends (optional)
    backgroundColor: "#806181",
    opacity: 0.8,
    transform: [{ rotate: "-45deg" }], // top-right → bottom-left
    // zIndex: 1,
  };
  const stylesBtnKvImageTopRight = {
    marginTop: -CIRCLE_SIZE / 2,
    marginLeft: CIRCLE_SIZE / 2,
  };
  const stylesBtnKvImageBottomLeft = {
    marginBottom: -CIRCLE_SIZE / 2,
    marginRight: CIRCLE_SIZE / 2,
  };

  // -------- Styles MIDDLE --------
  const stylesVwRowButtonsAdjustScore = {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // gap: "10%",
    gap: CIRCLE_SIZE / 2.5,
  };
  const stylesVwRowScore = {
    backgroundColor: "#806181",
    // backgroundColor: "green",
    borderRadius: 20,
    flexDirection: "row",
    width: CIRCLE_SIZE * 1.5,
    justifyContent: "center",
    alignItems: "center",
    gap: CIRCLE_SIZE / 4,
  };

  const stylesVwPlayer = {
    borderWidth: 1,
    borderColor: "#6E4C84",
    borderRadius: 30,
    backgroundColor: "white",
    flexDirection: "row",
    gap: 10,
    padding: 5,
    // width: Dimensions.get("window").width * 0.3,
    width: CIRCLE_SIZE * 2,
  };

  const stylesVwButtonFavorite = {
    // position: "absolute",
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "white",
    marginTop:
      -35 -
      scriptReducer.coordsScriptLiveLandscapeVwBelowSvgVolleyballCourt.height,
    // paddingTop: 5,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    // alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  };
  const stylesBtnFavorite = {
    width: CIRCLE_SIZE * 0.75,
    height: CIRCLE_SIZE * 0.75,
  };

  // -------- Styles Player ----
  // Note: NoHeight contains the vwPlayer
  const stylesVwPlayerSuperNoHeight = {
    width: "100%",
    alignItems: "center",
  };
  // Note: Spacer contains nothing
  const stylesVwPlayerSuperSpacer = {
    // borderWidth: 1,
    // borderColor: "#6E4C84",
    // borderStyle: "dashed",
    width: "100%",
    height: CIRCLE_SIZE / 2,
    backgroundColor: "#F0EAF9",
    // alignItems: "center",
    // paddingVertical: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  };
  const stylesVwPlayerSuperSpacerFavorited = {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#806181",
  };
  const stylesVwPlayerAbsolutePosition = {
    position: "absolute",
    top: CIRCLE_SIZE / 10,
    zIndex: 1,
  };

  const stylesDropDownScriptingPlayer = {
    // backgroundColor: "red",
    position: "absolute",
    top:
      scriptReducer.coordsScriptLiveLandscapeContainerMiddleTop.height +
      scriptReducer.coordsScriptLiveLandscapeVwPlayerSuper.height,
    left:
      scriptReducer.coordsScriptLiveLandscapeContainerMiddleTop.width / 2 -
      CIRCLE_SIZE,
    // width: 100,
    zIndex: 1,
    // height: 100,
  };

  const stylesDropDownScriptingPlayerScrollView = {
    height: CIRCLE_SIZE * 1.2,
    // width: 200,
  };

  // const handleContainerLeftLayout = (event) => {
  const handleOnLayoutContainerLeftLayout = (event) => {
    const { width, height, x, y } = event.nativeEvent.layout;
    // console.log("---> [ScriptingLiveLandscape] in handleContainerLeftLayout");
    // console.log("event.nativeEvent.layout", event.nativeEvent.layout);

    dispatch(
      updateCoordsScriptLiveLandscapeContainerLeft({ x, y, width, height })
    );
  };
  const handleOnLayoutContainerMiddleTopLayout = (event) => {
    const { width, height, x, y } = event.nativeEvent.layout;
    // console.log(
    //   "---> [ScriptingLiveLandscape] in handleOnLayoutContainerMiddleTopLayout"
    // );
    // console.log("event.nativeEvent.layout", event.nativeEvent.layout);

    dispatch(
      updateCoordsScriptLiveLandscapeContainerMiddleTop({ x, y, width, height })
    );
  };

  const handleOnLayoutContainerMiddleBottomLayout = (event) => {
    const { width, height, x, y } = event.nativeEvent.layout;
    console.log(
      "---> [ScriptingLiveLandscape] in handleOnLayoutContainerMiddleBottomLayout"
    );
    console.log("event.nativeEvent.layout", event.nativeEvent.layout);

    dispatch(
      updateCoordsScriptLiveLandscapeContainerMiddleBottom({
        x,
        y,
        width,
        height,
      })
    );
  };
  const handleOnLayoutVwPlayerSuper = (event) => {
    const { width, height, x, y } = event.nativeEvent.layout;
    // console.log(
    //   "---> [ScriptingLiveLandscape] in handleOnLayoutVwPlayerSuper"
    // );
    // console.log("event.nativeEvent.layout", event.nativeEvent.layout);

    dispatch(
      updateCoordsScriptLiveLandscapeVwPlayerSuper({ x, y, width, height })
    );
  };

  const handleOnLayoutVwBelowSvgVolleyballCourt = (event) => {
    const { width, height, x, y } = event.nativeEvent.layout;
    // console.log(
    //   "---> [ScriptingLiveLandscape] in handleOnLayoutVwBelowSvgVolleyballCourt"
    // );
    // console.log("event.nativeEvent.layout", event.nativeEvent.layout);

    dispatch(
      updateCoordsScriptLiveLandscapeVwBelowSvgVolleyballCourt({
        x,
        y,
        width,
        height,
      })
    );
  };

  // const stylesGesterPositionTopLeft = {
  //   position: "absolute",
  //   top: scriptReducer.coordsScriptLiveLandscapeContainerMiddleTop.height,
  //   left: scriptReducer.coordsScriptLiveLandscapeContainerLeft.width,
  //   width: 2,
  //   height: scriptReducer.coordsScriptLiveLandscapeContainerMiddleBottom.height,
  //   // backgroundColor: "gray",
  //   borderWidth: 4,
  //   borderColor: "gray",
  //   borderStyle: "dashed",
  //   zIndex: 1,
  // };
  // const stylesGesterPositionHalfCourtFrontBack = {
  //   position: "absolute",
  //   top:
  //     scriptReducer.coordsScriptLiveLandscapeContainerMiddleTop.height +
  //     scriptReducer.coordsScriptLiveLandscapeContainerMiddleBottom.height / 2,
  //   left: scriptReducer.coordsScriptLiveLandscapeContainerLeft.width,
  //   width: scriptReducer.coordsScriptLiveLandscapeContainerMiddleBottom.width,
  //   height: 0,
  //   borderWidth: 2,
  //   borderColor: "gray",
  //   borderStyle: "dashed",
  //   zIndex: 1,
  // };
  // const stylesGesterPositionTopMiddle = {
  //   position: "absolute",
  //   top: scriptReducer.coordsScriptLiveLandscapeContainerMiddleTop.height,
  //   left:
  //     scriptReducer.coordsScriptLiveLandscapeContainerLeft.width +
  //     scriptReducer.coordsScriptLiveLandscapeContainerMiddleBottom.width / 3 -
  //     1,
  //   width: 0,
  //   height: scriptReducer.coordsScriptLiveLandscapeContainerMiddleBottom.height,
  //   borderWidth: 2,
  //   borderColor: "gray",
  //   borderStyle: "dashed",
  //   zIndex: 1,
  // };

  return (
    <TemplateViewWithTopChildrenSmallLandscape
      navigation={props.navigation}
      topChildren={topChildren}
      topHeight={50}
      // onBackPress={handleBackPress}
      onBackPress={props.handleExitScriptingLive}
    >
      {props.renderSwipePad()}
      <View style={styles.container}>
        {/* <View style={stylesGesterPositionTopLeft} />
        <View style={stylesGesterPositionTopMiddle} />
        <View style={stylesGesterPositionHalfCourtFrontBack} /> */}
        {/* 

      LEFT 

      */}
        <View
          style={styles.containerLeft}
          onLayout={(event) => handleOnLayoutContainerLeftLayout(event)}
        >
          {/* <View style={styles.vwContainerLeftTop}> */}
          <View style={styles.vwContainerOfButtons}>
            {/* <View style={styles.vwGroupButtons}> */}
            <View style={stylesVwGroupButtons}>
              <View style={stylesVwGroupButtonsCircle} />
              <View style={styles.vwLayerAndCentered}>
                <View style={stylesVwGroupButtonsDiagonalLine} />
              </View>
              <View
                style={[styles.vwLayerAndCentered, { flexDirection: "row" }]}
              >
                <View style={styles.vwButtonKvImageBottomAndLeft}>
                  <ButtonKvImage
                    onPress={() => {
                      console.log("pressed service");
                    }}
                    style={stylesBtnKvImageBottomLeft}
                  >
                    <BtnService style={stylesBtnBottom} />
                  </ButtonKvImage>
                </View>
                <View style={styles.vwButtonKvImageTopAndRight}>
                  <ButtonKvImage
                    onPress={() => {
                      console.log("pressed reception");
                    }}
                    style={stylesBtnKvImageTopRight}
                  >
                    <BtnReception style={stylesBtnTop} />
                  </ButtonKvImage>
                </View>
              </View>
            </View>
          </View>
          {/* </View> */}
          <View style={styles.vwContainerLeftBottom}>
            {/* <View style={styles.vwScriptDetails}> */}
            <Text style={{ color: "#806181" }}>
              {" "}
              {scriptReducer.sessionActionsArray.length} actions recorded
            </Text>
            <Text style={{ fontStyle: "italic", color: "#806181" }}>
              {" "}
              {
                scriptReducer.sessionActionsArray.filter(
                  (action) => action.favorite
                ).length
              }{" "}
              favorites
            </Text>
            {/* </View> */}
            {/* {scriptReducer.sessionActionsArray.length > 0 && (
              <Text style={{ color: "#806181" }}>
                Position:{" "}
                {
                  scriptReducer.sessionActionsArray[
                    scriptReducer.sessionActionsArray.length - 1
                  ].zone
                }
              </Text>
            )} */}
          </View>
        </View>

        {/* <GestureHandlerRootView style={[styles.column]}> */}
        <View style={[styles.column]}>
          <View style={styles.containerMiddle}>
            <View
              style={styles.containerMiddleTop}
              onLayout={(event) =>
                handleOnLayoutContainerMiddleTopLayout(event)
              }
            >
              <View style={styles.vwGroupScoreAndSets}>
                <View style={styles.vwGroupSetSuper}>
                  <View
                    style={[
                      styles.vwGroupSet,
                      { flexDirection: "row-reverse" },
                    ]}
                  >
                    {Array.from({ length: 3 }).map((_, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          props.handleSetCirclePress("analyzed", index + 1)
                        }
                        style={[
                          styles.touchOpSetsCircle,
                          props.matchSetsWon.teamAnalyzed > index &&
                            styles.touchOpSetsCircleFilled,
                        ]}
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.vwGroupScore}>
                  {/* <View style={styles.vwRowButtonsAdjustScore}> */}
                  <View style={stylesVwRowButtonsAdjustScore}>
                    <ButtonKvStd
                      onPress={() => {
                        props.handleSetScorePress("analyzed", 1);
                      }}
                      style={styles.btnPlus}
                    >
                      +
                    </ButtonKvStd>
                    <ButtonKvStd
                      onPress={() => {
                        props.handleSetScorePress("opponent", 1);
                      }}
                      style={styles.btnPlus}
                    >
                      +
                    </ButtonKvStd>
                  </View>
                  {/* <View style={styles.vwRowScore}> */}
                  <View style={stylesVwRowScore}>
                    <Text style={styles.txtRowScore}>
                      {props.setScores.teamAnalyzed}
                    </Text>
                    <Text style={styles.txtRowScore}>-</Text>
                    <Text style={styles.txtRowScore}>
                      {props.setScores.teamOpponent}
                    </Text>
                  </View>
                  {/* <View style={styles.vwRowButtonsAdjustScore}> */}
                  <View style={stylesVwRowButtonsAdjustScore}>
                    <ButtonKvStd
                      onPress={() => {
                        props.handleSetScorePress("analyzed", -1);
                      }}
                      style={styles.btnPlus}
                    >
                      -
                    </ButtonKvStd>
                    <ButtonKvStd
                      onPress={() => {
                        props.handleSetScorePress("opponent", -1);
                      }}
                      style={styles.btnPlus}
                    >
                      -
                    </ButtonKvStd>
                  </View>
                </View>
                <View style={styles.vwGroupSetSuper}>
                  <View style={styles.vwGroupSet}>
                    {/* <Text>vwGroupSet</Text> */}
                    {/* <View style={styles.vwSetCircles}> */}
                    {Array.from({ length: 3 }).map((_, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          props.handleSetCirclePress("opponent", index + 1)
                        }
                        style={[
                          styles.touchOpSetsCircle,
                          props.matchSetsWon.teamOpponent > index &&
                            styles.touchOpSetsCircleFilled,
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <View style={stylesVwPlayerSuperNoHeight}>
              <View style={stylesVwPlayerAbsolutePosition}>
                <ButtonKvNoDefault
                  onPress={() => {
                    console.log("pressed");
                    props.setDropdownVisibility("scriptingPlayer");
                  }}
                  styleView={stylesVwPlayer}
                >
                  <View style={styles.vwPlayerLeft}>
                    <Text style={styles.txtShirtNumber}>
                      {scriptReducer.scriptingForPlayerObject?.shirtNumber}
                    </Text>
                  </View>
                  <View style={styles.vwPlayerRight}>
                    <Text style={styles.txtPlayerName}>
                      {scriptReducer.scriptingForPlayerObject?.firstName}
                    </Text>
                    <Text style={styles.txtPlayerName}>
                      {scriptReducer.scriptingForPlayerObject?.lastName}
                    </Text>
                  </View>
                </ButtonKvNoDefault>
              </View>
            </View>
            {props.scriptingPlayerDropdownIsVisible && (
              <View style={stylesDropDownScriptingPlayer}>
                <ScrollView style={stylesDropDownScriptingPlayerScrollView}>
                  {scriptReducer.playersArray.map(
                    (player, index) =>
                      // add logic to remove selected player
                      !player.selected && (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            const tempArray = scriptReducer.playersArray.map(
                              (item) => {
                                if (item.id === player.id) {
                                  // setDisplayWarning(false);
                                  return {
                                    ...item,
                                    selected: !item.selected,
                                  };
                                }
                                return { ...item, selected: false };
                              }
                            );
                            dispatch(updatePlayersArray(tempArray));
                            dispatch(setScriptingForPlayerObject(player));
                            props.setDropdownVisibility("scriptingPlayer");
                          }}
                          // style={styles.btnDropDown}
                          style={stylesVwPlayer}
                        >
                          <View style={styles.vwPlayerLeft}>
                            <Text style={styles.txtShirtNumber}>
                              {player.shirtNumber}
                            </Text>
                          </View>
                          <View style={styles.vwPlayerRight}>
                            <Text style={styles.txtPlayerName}>
                              {player.firstName}
                            </Text>
                            <Text style={styles.txtPlayerName}>
                              {player.lastName}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )
                  )}
                </ScrollView>
              </View>
            )}
            <GestureHandlerRootView>
              <GestureDetector gesture={props.combinedGestures}>
                <View
                  style={styles.containerMiddleBottom}
                  onLayout={(event) =>
                    handleOnLayoutContainerMiddleBottomLayout(event)
                  }
                >
                  {/* <View style={styles.vwPlayer}> */}
                  <View
                    // style={styles.vwPlayerSuper}
                    style={[
                      stylesVwPlayerSuperSpacer,
                      props.lastActionIsFavorite
                        ? stylesVwPlayerSuperSpacerFavorited
                        : null,
                    ]}
                    onLayout={(event) => handleOnLayoutVwPlayerSuper(event)}
                  />

                  <View
                    style={[
                      styles.vwSvgVolleyballCourt,
                      props.lastActionIsFavorite
                        ? styles.vwSvgVolleyballCourtFavorited
                        : null,
                    ]}
                  >
                    <SvgVolleyballCourt />
                  </View>
                  <View
                    style={styles.vwBelowSvgVolleyballCourt}
                    onLayout={(event) =>
                      handleOnLayoutVwBelowSvgVolleyballCourt(event)
                    }
                  >
                    {/* <View style={stylesVwButtonFavorite}>

                    </View> */}
                  </View>
                </View>
              </GestureDetector>
            </GestureHandlerRootView>
          </View>
          <View style={styles.vwFavoriteParent}>
            <View style={stylesVwButtonFavorite}>
              <ButtonKvImage
                onPress={() => {
                  console.log("pressed favorite");
                  props.handleModifyFavorite();
                }}
                style={{
                  margin: 0,
                  padding: 0,
                  // backgroundColor: "green",
                }}
              >
                <BtnFavorite style={stylesBtnFavorite} />
              </ButtonKvImage>
            </View>
          </View>
        </View>
        {/* 
        
        RIGHT COLUMN: W / L buttons
        
        */}
        {/* <View style={[styles.column]}> */}
        <View style={styles.containerRight}>
          {/* <View style={styles.vwGroupButtons}> */}
          <View style={styles.vwContainerOfButtons}>
            <View style={stylesVwGroupButtons}>
              <View style={stylesVwGroupButtonsCircle} />
              <View style={styles.vwLayerAndCentered}>
                <View style={stylesVwGroupButtonsDiagonalLine} />
              </View>
              <View
                style={[styles.vwLayerAndCentered, { flexDirection: "row" }]}
              >
                <View style={styles.vwButtonKvImageBottomAndLeft}>
                  <ButtonKvImage
                    onPress={() => {
                      console.log("pressed lose");
                      props.handleSetScorePress("opponent", 1);
                    }}
                    // style={styles.btnRallyGroupTop}
                    style={stylesBtnKvImageBottomLeft}
                  >
                    <BtnLose style={stylesBtnTop} />
                  </ButtonKvImage>
                </View>
                <View style={styles.vwButtonKvImageTopAndRight}>
                  <ButtonKvImage
                    onPress={() => {
                      console.log("pressed win");
                      props.handleSetScorePress("analyzed", 1);
                    }}
                    // style={styles.btnRallyGroupBottom}
                    // style={styles.btnKvImageTopRight}
                    style={stylesBtnKvImageTopRight}
                  >
                    <BtnWin style={stylesBtnBottom} />
                  </ButtonKvImage>
                </View>
              </View>
            </View>
          </View>
          {/* <View style={styles.vwContainerLeftBottom}> */}
          <View style={styles.vwContainerRightBottom}>
            {/* <Text style={{ color: "#806181" }}> Button here</Text> */}
            <View style={styles.vwSendScriptButton}>
              <ButtonKvStd
                onPress={() => {
                  console.log("pressed send script");
                  // console.log(scriptReducer.sessionActionsArray);
                  props.sendScriptReducerSessionActionsArrayToServer();
                }}
                style={{
                  backgroundColor: "#806181",
                  width: "100%",
                  // padding: 15,
                }}
              >
                Send script to{" "}
                {
                  teamReducer.teamsArray.filter((tribe) => tribe.selected)[0]
                    .teamName
                }
              </ButtonKvStd>
            </View>
          </View>
        </View>
      </View>
    </TemplateViewWithTopChildrenSmallLandscape>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "white",
  },
  column: {
    flex: 1,
    // height: 100,
  },
  vwContainerOfButtons: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  vwLayerAndCentered: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  vwButtonKvImageTopAndRight: {
    width: "50%",
  },
  vwButtonKvImageBottomAndLeft: {
    width: "50%",
  },
  // btnKvImageTopRight: {},
  // -----
  // Top Children
  // -----
  vwTopChildren: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: 10,
  },
  vwTopChildrenLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  txtTopChildren: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  // -----
  // LEFT
  // -----
  containerLeft: {
    width: "30%",
  },
  vwContainerLeftTop: {
    flex: 1,
  },

  // LAYER
  vwContainerLeftTopLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0, // fills parent
    alignItems: "center", // center the text horizontally
    justifyContent: "center", // center the text vertically
  },

  vwContainerLeftBottom: {
    // height: 100,
    // backgroundColor: "purple",
    paddingBottom: 20,
    paddingLeft: 40,
  },
  // -----
  // MIDDLE
  // -----
  containerMiddle: {
    // backgroundColor: "yellow",
    flex: 1,
    zIndex: 0,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "red",
  },

  containerMiddleTop: {
    // flex: 1,
    // backgroundColor: "#F0EAF9",
    // alignItems: "center",
    // padding: 15,
    // gap: 20,
    // borderWidth: 1,
    // borderColor: "gray",
    // borderStyle: "dashed",
  },

  vwGroupScoreAndSets: {
    flexDirection: "row",
    // width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "dashed",
    paddingVertical: 10,
  },
  vwGroupSet: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#806181",
    padding: 5,
    borderRadius: 15,
    gap: 5,
  },
  touchOpSetsCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    marginHorizontal: 1,
    // backgroundColor: "white",
    backgroundColor: "#806181",
  },
  touchOpSetsCircleFilled: {
    // backgroundColor: "#806181",
    backgroundColor: "white",
  },
  vwGroupScore: {
    // width: Dimensions.get("window").width * 0.4,
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "dashed",
  },
  // vwRowButtonsAdjustScore: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   gap: "10%",
  // },
  btnPlus: {
    padding: 0,
    margin: 0,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#806181",
    color: "white",
    width: 35,
    borderRadius: 10,
    height: null,
    fontSize: null,
    opacity: 0.5,
  },
  // vwRowScore: {
  //   backgroundColor: "#806181",
  //   // backgroundColor: "green",
  //   borderRadius: 20,
  //   flexDirection: "row",
  //   width: "100%",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   gap: "5%",
  // },
  txtRowScore: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  // -----
  // MIDDLE BOTTOM
  // -----
  containerMiddleBottom: {
    flex: 1,
    // backgroundColor: "#F0EAF9",
    alignItems: "center",
    // padding: 15,
    // gap: 20,
    // borderWidth: 1,
    // borderColor: "gray",
    // borderStyle: "dashed",
    // width: "100%",
  },
  // vwPlayerSuper: {
  //   backgroundColor: "#F0EAF9",
  //   width: "100%",
  //   alignItems: "center",
  //   // paddingVertical: 20,
  //   borderTopLeftRadius: 20,
  //   borderTopRightRadius: 20,
  // },
  vwSvgVolleyballCourt: {
    backgroundColor: "#F0EAF9",
    width: "100%",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  vwSvgVolleyballCourtFavorited: {
    borderBottomWidth: 2,
    // borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#806181",
  },
  // vwPlayer: {
  //   borderWidth: 1,
  //   borderColor: "#6E4C84",
  //   borderRadius: 30,
  //   backgroundColor: "white",
  //   flexDirection: "row",
  //   gap: 10,
  //   padding: 5,
  //   width: Dimensions.get("window").width * 0.3,
  // },
  vwPlayerLeft: {
    justifyContent: "center",
    backgroundColor: "#806181",
    borderRadius: 30,
  },
  txtShirtNumber: {
    fontWeight: "bold",
    color: "white",
    fontSize: 15,
    borderRadius: 7,
    height: 15,
    width: 20,
    textAlign: "center",
  },
  vwPlayerRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  txtPlayerName: {
    textAlign: "center",
    color: "#6E4C84",
    fontSize: 11,
  },

  vwBelowSvgVolleyballCourt: {
    // backgroundColor: "green",
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
  vwFavoriteParent: {
    // backgroundColor: "red",
    height: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  // -----
  // RIGHT
  // -----
  containerRight: {
    // flex: 1,
    width: "25%",
  },

  vwContainerRightBottom: {
    // backgroundColor: "red",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
});
