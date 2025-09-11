import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import TemplateView from "./TemplateView";
import { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons"; // near top of file
import ButtonKvImage from "./buttons/ButtonKvImage";
import ButtonKvStd from "./buttons/ButtonKvStd";
import ButtonKvNoDefaultTextOnly from "./buttons/ButtonKvNoDefaultTextOnly";
import ButtonKvNoDefault from "./buttons/ButtonKvNoDefault";
import { loginUser } from "../../reducers/user";
import {
  GestureHandlerRootView,
  GestureDetector,
  // Gesture,
} from "react-native-gesture-handler";
import SvbVolleyballCourt from "../../assets/images/volleyballCourt.svg";
import BtnReception from "../../assets/images/buttons/btnReception.svg";
import BtnService from "../../assets/images/buttons/btnService.svg";
import BtnFavorite from "../../assets/images/buttons/btnFavorite.svg";
import BtnWin from "../../assets/images/buttons/btnWin.svg";
import BtnLose from "../../assets/images/buttons/btnLose.svg";
import Lightning from "../../assets/images/lightning.svg";
import { useSelector, useDispatch } from "react-redux";
import {
  // updateScriptLivePortraitVwVolleyballCourtCoords,
  updateCoordsScriptLivePortraitContainerMiddle,
  updateScriptSessionActionsArray,
  updateCoordsScriptLivePortraitVwPlayerSuperSpacer,
  setScriptingForPlayerObject,
  updatePlayersArray,
} from "../../reducers/script";

export default function ScriptingLivePortrait(props) {
  const scriptReducer = useSelector((state) => state.script);
  // const userReducer = useSelector((state) => state.user);
  const teamReducer = useSelector((state) => state.team);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   // dispatch(createPlayerArrayPositionProperties());
  //   console.log(JSON.stringify(scriptReducer.playersArray, null, 2));
  // }, []);
  // const handleVwVolleyballCourtAndGestSuperLayout = (event) => {
  const handleOnLayoutContainerMiddle = (event) => {
    console.log("-- handleOnLayoutContainerMiddle --");
    console.log(event.nativeEvent.layout);
    const { width, height, x, y } = event.nativeEvent.layout;

    dispatch(
      updateCoordsScriptLivePortraitContainerMiddle({ x, y, width, height })
    );
  };

  const handleOnLayoutPlayerSuperSpacer = (event) => {
    console.log("--- handleOnLayoutPlayerSuperSpacer ---");
    console.log(event.nativeEvent.layout);
    const { width, height, x, y } = event.nativeEvent.layout;
    dispatch(
      updateCoordsScriptLivePortraitVwPlayerSuperSpacer({ x, y, width, height })
    );
  };

  const handleLastActionPlayerName = () => {
    const lastActionPlayerId =
      scriptReducer.sessionActionsArray[
        scriptReducer.sessionActionsArray.length - 1
      ]?.playerId;
    // console.log(lastActionPlayerId);
    if (!lastActionPlayerId) return null;
    // console.log(
    //   scriptReducer.playersArray.filter(
    //     (player) => player.id === lastActionPlayerId
    //   )[0]
    // );
    const lastActionPlayerName = scriptReducer.playersArray.filter(
      (player) => player.id === lastActionPlayerId
    )[0].firstName;
    // console.log(lastActionPlayerName);

    return lastActionPlayerName;
  };

  // -----------------
  //  Styles
  // -----------------

  const btnDiameter = Dimensions.get("window").width * 0.15;
  const stylesBtnTop = {
    width: btnDiameter,
    height: btnDiameter,
    zIndex: 2,
  };
  const stylesBtnBottom = {
    width: btnDiameter,
    height: btnDiameter,
    zIndex: 2,
    // backgroundColor: "white",
  };
  const stylesBtnFavorite = {
    width: btnDiameter,
    height: btnDiameter,
  };
  const stylesVwGroupButtonsDiagonalLine = {
    position: "absolute",
    width: btnDiameter * Math.sqrt(2), // roughly 0.15 * √2 for diagonal spacing
    height: 8,
    backgroundColor: "#806181",
    top: "50%",
    left: "50%",
    transform: [
      { translateX: -0.5 * Dimensions.get("window").width * 0.21 },
      { translateY: -5 },
      { rotate: "-45deg" },
    ],
    zIndex: 0,
  };
  const stylesVwGroupButtonsCircle = {
    borderRadius: (Dimensions.get("window").width * 0.2) / 2,
    backgroundColor: "gray",
    width: Dimensions.get("window").width * 0.2,
    height: Dimensions.get("window").width * 0.2,
    top: Dimensions.get("window").width * 0.05,
    left:
      (Dimensions.get("window").width * 0.4) / 2 -
      (Dimensions.get("window").width * 0.2) / 2,
    position: "absolute",
    backgroundColor: "#806181",
    opacity: 0.5,
  };

  const stylesDropDownPositionQuality = {
    left: 5,
    width: Dimensions.get("window").width * 0.1 - 5,
  };
  const stylesDropDownPositionPosition = {
    left: Dimensions.get("window").width * 0.1 + 5,
    width: Dimensions.get("window").width * 0.1 - 5,
  };
  const stylesDropDownPositionPlayer = {
    left: Dimensions.get("window").width * 0.2 + 5,
    width: Dimensions.get("window").width * 0.2 - 5,
  };
  const stylesDropDownPositionType = {
    left: Dimensions.get("window").width * 0.4 + 5,
    width: Dimensions.get("window").width * 0.2 - 5,
  };
  const stylesDropDownPositionSubtype = {
    left: Dimensions.get("window").width * 0.6 + 5,
    width: Dimensions.get("window").width * 0.2 - 5,
  };

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
    height: btnDiameter,
    // alignItems: "center",
    // paddingVertical: 0,
  };
  const stylesVwPlayerAbsolutePosition = {
    position: "absolute",
    top: btnDiameter / 4,
    zIndex: 1,
  };
  const stylesVwPlayer = {
    // position: "absolute",
    // top: btnDiameter / 4,
    borderWidth: 1,
    borderColor: "#6E4C84",
    borderRadius: 30,
    backgroundColor: "white",
    flexDirection: "row",
    gap: 10,
    padding: 5,
    width: Dimensions.get("window").width * 0.3,
    zIndex: 1,
  };

  const stylesDropDownScriptingPlayer = {
    // backgroundColor: "red",
    position: "absolute",
    // width: "100%",
    top: btnDiameter * 0.85,
    // left: Dimensions.get("window").width * 0.5,
    zIndex: 1,
    // top: btnDiameter / 4,
    // zIndex: 1,
  };

  const stylesDropDownScriptingPlayerScrollView = {
    height: btnDiameter * 1.2,
    // width: 200,
  };

  const stylesVwPlayerPositionArea1 = {
    position: "absolute",
    top: scriptReducer.coordsScriptLivePortraitContainerMiddle.height - 100,
    right: 100,
    zIndex: 1,
    // left: 0,
    // width: Dimensions.get("window").width,
    // backgroundColor: "red",
  };
  const stylesVwPlayerPositionArea5 = {
    position: "absolute",
    top: scriptReducer.coordsScriptLivePortraitVwPlayerSuperSpacer.height + 20,
    left: 120,
    zIndex: 1,
    // left: 0,
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerTop}>
        <View style={styles.vwTeamNames}>
          <View style={styles.vwTeamNameSub}>
            <Text style={styles.txtTeamName}>
              {
                teamReducer.teamsArray.filter((tribe) => tribe.selected)[0]
                  .teamName
              }
            </Text>
          </View>
          <Lightning />
          <View style={styles.vwTeamNameSub}>
            <Text style={styles.txtTeamName}>Team 2</Text>
          </View>
        </View>

        <View style={styles.vwGroupScoreAndSets}>
          <View style={styles.vwGroupSetSuper}>
            <View style={[styles.vwGroupSet, { flexDirection: "row-reverse" }]}>
              {Array.from({ length: 3 }).map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    props.handleSetCirclePress("analyzed", index + 1)
                  }
                  style={[
                    styles.touchOpSetsCircle,
                    props.matchSetsWon.teamAnalyzed > index &&
                      // styles.touchOpSetsCircleFilled,
                      styles.touchOpSetsCircleFilled,
                  ]}
                />
              ))}
            </View>
          </View>
          <View style={styles.vwGroupScore}>
            <View style={styles.vwRowButtonsAdjustScore}>
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
            <View style={styles.vwRowScore}>
              <Text style={styles.txtRowScore}>
                {props.setScores.teamAnalyzed}
              </Text>
              <Text style={styles.txtRowScore}>-</Text>
              <Text style={styles.txtRowScore}>
                {props.setScores.teamOpponent}
              </Text>
            </View>
            <View style={styles.vwRowButtonsAdjustScore}>
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
        <View style={styles.vwGroupLastActionButtonsInstructionsAndLabels}>
          <View style={styles.vwGroupInstructionsAndLabels}>
            <Text style={styles.txtInstructions}>Last scripted point</Text>
            <View style={styles.vwGroupLabels}>
              <Text
                style={[stylesDropDownPositionQuality, styles.txtGroupLabel]}
              >
                Quality
              </Text>
              <Text
                style={[stylesDropDownPositionPosition, styles.txtGroupLabel]}
              >
                Pos.
              </Text>
              <Text
                style={[stylesDropDownPositionPlayer, styles.txtGroupLabel]}
              >
                Player
              </Text>
              <Text style={[stylesDropDownPositionType, styles.txtGroupLabel]}>
                Type
              </Text>
              <Text
                style={[stylesDropDownPositionSubtype, styles.txtGroupLabel]}
              >
                Subtype
              </Text>
            </View>
          </View>

          {/* --------- Last Action Buttons --------- */}
          <View style={styles.vwGroupLastActionButtonsSuper}>
            <View style={styles.vwGroupLastActionButtons}>
              <ButtonKvNoDefaultTextOnly
                onPress={() => {
                  if (scriptReducer.sessionActionsArray.length > 0) {
                    // props.setLastActionDropDownIsVisibleQuality(
                    //   (prev) => !prev
                    // );
                    props.setDropdownVisibility("quality");
                  }
                }}
                styleView={[styles.btnLastAction, styles.btnLastActionSmall]}
                styleText={styles.txtLastAction}
              >
                {/* {props.lastActionQuality} */}
                {scriptReducer.sessionActionsArray[
                  scriptReducer.sessionActionsArray.length - 1
                ]?.quality || "?"}
              </ButtonKvNoDefaultTextOnly>
              <ButtonKvNoDefaultTextOnly
                onPress={() => {
                  if (scriptReducer.sessionActionsArray.length > 0) {
                    // props.setLastActionDropDownIsVisiblePosition(
                    //   (prev) => !prev
                    // );
                    props.setDropdownVisibility("position");
                  }
                }}
                styleView={[styles.btnLastAction, styles.btnLastActionSmall]}
                styleText={styles.txtLastAction}
              >
                {/* {props.lastActionPosition} */}
                {scriptReducer.sessionActionsArray[
                  scriptReducer.sessionActionsArray.length - 1
                ]?.zone || "?"}
              </ButtonKvNoDefaultTextOnly>
              <ButtonKvNoDefaultTextOnly
                onPress={() => {
                  console.log("pressed Player");
                  if (scriptReducer.sessionActionsArray.length > 0) {
                    // props.setLastActionDropDownIsVisiblePlayer((prev) => !prev);
                    props.setDropdownVisibility("player");
                  }
                }}
                styleView={[styles.btnLastAction, styles.btnLastActionBig]}
                styleText={styles.txtLastAction}
              >
                {/* {handleLastActionPlayerName() || "?"} */}
                {handleLastActionPlayerName() !== null
                  ? handleLastActionPlayerName().slice(0, 4)
                  : "?"}
              </ButtonKvNoDefaultTextOnly>
              <ButtonKvNoDefaultTextOnly
                onPress={() => {
                  console.log("pressed Type");
                  if (scriptReducer.sessionActionsArray.length > 0) {
                    // props.setLastActionDropDownIsVisibleType((prev) => !prev);
                    props.setDropdownVisibility("type");
                  }
                }}
                styleView={[styles.btnLastAction, styles.btnLastActionBig]}
                styleText={styles.txtLastAction}
              >
                {scriptReducer.sessionActionsArray[
                  scriptReducer.sessionActionsArray.length - 1
                ]?.type || "?"}
              </ButtonKvNoDefaultTextOnly>
              <ButtonKvNoDefaultTextOnly
                onPress={() => {
                  console.log("pressed Subtype");
                  if (scriptReducer.sessionActionsArray.length > 0) {
                    // props.setLastActionDropDownIsVisibleSubtype(
                    //   (prev) => !prev
                    // );
                    props.setDropdownVisibility("subtype");
                  }
                }}
                styleView={[styles.btnLastAction, styles.btnLastActionBig]}
                styleText={styles.txtLastAction}
              >
                {props.getSubtypeForLastAction()}
              </ButtonKvNoDefaultTextOnly>
              {/* ---- Dropdowns ---- */}
              {props.lastActionDropDownIsVisibleQuality && (
                <View
                  style={[
                    stylesDropDownPositionQuality,
                    styles.vwDropDownContainer,
                  ]}
                >
                  {scriptReducer.qualityArray.map((quality, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        // props.setLastActionQuality(quality);
                        props.handleModifyQuality(quality);
                        props.setLastActionDropDownIsVisibleQuality(false);
                      }}
                      style={styles.btnDropDown}
                    >
                      <Text style={styles.txtDropDownBtn}>{quality}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {props.lastActionDropDownIsVisiblePosition && (
                <View
                  style={[
                    stylesDropDownPositionPosition,
                    styles.vwDropDownContainer,
                  ]}
                >
                  {scriptReducer.positionalAreasArray.map(
                    (positionalArea, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          // props.setLastActionPosition(positionalArea);
                          props.handleModifyPosition(positionalArea);
                          props.setLastActionDropDownIsVisiblePosition(false);
                        }}
                        style={styles.btnDropDown}
                      >
                        <Text style={styles.txtDropDownBtn}>
                          {positionalArea}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              )}
              {props.lastActionDropDownIsVisiblePlayer && (
                <View
                  style={[
                    stylesDropDownPositionPlayer,
                    styles.vwDropDownContainer,
                  ]}
                >
                  {scriptReducer.playersArray.map((player, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        // console.log(`player pressed: ${player.firstName}`);
                        // props.handleLastActionPlayerPress(player);
                        props.handleModifyLastActionPlayer(player);
                        props.setLastActionDropDownIsVisiblePlayer(false);
                      }}
                      style={styles.btnDropDown}
                    >
                      <Text style={styles.txtDropDownBtn}>
                        {player.firstName.slice(0, 4)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {props.lastActionDropDownIsVisibleType && (
                <View
                  style={[
                    stylesDropDownPositionType,
                    styles.vwDropDownContainer,
                  ]}
                >
                  {scriptReducer.typesArray.map((type, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        // props.setLastActionType(type);
                        props.handleModifyType(type);
                        props.setLastActionDropDownIsVisibleType(false);
                      }}
                      style={styles.btnDropDown}
                    >
                      <Text style={styles.txtDropDownBtn}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {props.lastActionDropDownIsVisibleSubtype && (
                <View
                  style={[
                    stylesDropDownPositionSubtype,
                    styles.vwDropDownContainer,
                  ]}
                >
                  {/* {(props.subtypesForLastAction || []).map((subtype, index) => ( */}
                  {(props.subtypesArrayForLastAction || []).map(
                    (subtype, index) => (
                      <TouchableOpacity
                        key={`${subtype}-${index}`}
                        onPress={() => {
                          props.setLastActionDropDownIsVisibleSubtype(false);
                          props.handleModifySubtype(subtype);
                        }}
                        style={styles.btnDropDown}
                      >
                        <Text style={styles.txtDropDownBtn}>
                          {subtype !== null ? subtype.slice(0, 4) : ""}
                          {/* {truncate4(subtype)} */}
                          {/* {subtype?.slice(0, 4)} */}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                  {/* {scriptReducer.subtypesArray.map((subtype, index) => ( 
                 
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        // props.setLastActionSubtype(subtype);
                        props.setLastActionDropDownIsVisibleSubtype(false);
                        props.handleModifySubtype(subtype);
                      }}
                      style={styles.btnDropDown}
                    >
                      <Text style={styles.txtDropDownBtn}>{subtype}</Text>
                    </TouchableOpacity>
                  ))}*/}
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* ------------ MIDDLE Container ------------ */}
      <View
        style={styles.containerMiddle}
        // onLayout={(event) => handleVwVolleyballCourtAndGestSuperLayout(event)}
        onLayout={(event) => handleOnLayoutContainerMiddle(event)}
      >
        <View style={stylesVwPlayerSuperNoHeight}>
          {/* <View style={styles.vwPlayer}> */}
          <View style={stylesVwPlayerAbsolutePosition}>
            <ButtonKvNoDefault
              onPress={() => {
                console.log("pressed");
                props.setDropdownVisibility("scriptingPlayer");
              }}
              styleView={stylesVwPlayer}
              // styleView={styles.vwPlayer}
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
                  // <Text key={index}>{player.firstName}</Text>
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
        <GestureHandlerRootView
          style={{}} //This is key to make sure the flex properties will trickle down to <Image>
        >
          <GestureDetector gesture={props.combinedGestures}>
            <View
              style={[
                styles.containerMiddleSub,
                props.lastActionIsFavorite
                  ? styles.containerMiddleSubFavorited
                  : null,
              ]}
            >
              <View
                // style={styles.vwPlayerSuperSpacer}
                style={stylesVwPlayerSuperSpacer}
                onLayout={handleOnLayoutPlayerSuperSpacer}
              ></View>
              <View style={stylesVwPlayerPositionArea1}>
                <Text>Area 1</Text>
                <Text>
                  {
                    scriptReducer.playersArray.filter(
                      (player) => player.positionArea === 1
                    )[0].firstName
                  }
                </Text>
              </View>
              <View style={stylesVwPlayerPositionArea5}>
                <Text>Area 5</Text>
                <Text>
                  {
                    scriptReducer.playersArray.filter(
                      (player) => player.positionArea === 5
                    )[0].firstName
                  }
                </Text>
              </View>
              <SvbVolleyballCourt />
            </View>
          </GestureDetector>
        </GestureHandlerRootView>
      </View>
      {/* ------------ BOTTOM Container ------------ */}
      <View style={styles.containerBottom}>
        <View style={styles.vwRallyButtonsGroup}>
          <View style={styles.vwGroupButtons}>
            <View style={stylesVwGroupButtonsCircle} />
            <View style={stylesVwGroupButtonsDiagonalLine} />
            <ButtonKvImage
              onPress={() => {
                console.log("pressed service");

                Alert.alert(
                  "Development Feature",
                  `Do you want to clear session actions array?`,
                  [
                    { text: "No", style: "cancel" },
                    {
                      text: "Yes",
                      style: "destructive",
                      onPress: () =>
                        dispatch(updateScriptSessionActionsArray([])),
                    },
                  ],
                  { cancelable: true }
                );
              }}
              style={styles.btnRallyGroupBottom}
            >
              <BtnService style={stylesBtnBottom} />
            </ButtonKvImage>
            <ButtonKvImage
              onPress={() => {
                console.log("pressed reception");
              }}
              style={styles.btnRallyGroupTop}
            >
              <BtnReception style={stylesBtnTop} />
            </ButtonKvImage>
          </View>
          <View style={styles.vwButtonFavorite}>
            <ButtonKvImage
              onPress={() => {
                console.log("pressed favorite");
                props.handleModifyFavorite();
              }}
              style={{ margin: 0, padding: 0 }}
            >
              <BtnFavorite style={stylesBtnFavorite} />
            </ButtonKvImage>
          </View>
          <View style={styles.vwGroupButtons}>
            <View style={stylesVwGroupButtonsCircle} />
            <View style={stylesVwGroupButtonsDiagonalLine} />
            <ButtonKvImage
              onPress={() => {
                console.log("pressed win");
                props.handleSetScorePress("analyzed", 1);
              }}
              style={styles.btnRallyGroupBottom}
            >
              <BtnWin style={stylesBtnBottom} />
            </ButtonKvImage>

            <ButtonKvImage
              onPress={() => {
                console.log("pressed lose");
                props.handleSetScorePress("opponent", 1);
              }}
              style={styles.btnRallyGroupTop}
            >
              <BtnLose style={stylesBtnTop} />
            </ButtonKvImage>
          </View>
        </View>
        <View style={styles.vwSendScriptGroup}>
          <View>
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
          </View>
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
      <View>
        <Text>Player positions</Text>
        <ScrollView style={{ height: 150 }}>
          <Text>
            {JSON.stringify(scriptReducer.playerObjectPositionalArray, null, 2)}
          </Text>
        </ScrollView>
        {/* <Text>
          {
            typeof scriptReducer.sessionActionsArray[
              scriptReducer.sessionActionsArray.length - 1
            ]?.subtype
          }
        </Text> */}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  // ------------
  // TOP Container
  // ------------
  containerTop: {
    width: "100%",
  },
  testActionsContainer: {
    height: 80,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  vwTeamNames: {
    backgroundColor: "#806181",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    height: 50,
    overflow: "hidden",
  },
  txtTeamName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  vwGroupScoreAndSets: {
    flexDirection: "row",
    width: Dimensions.get("window").width,
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
    width: Dimensions.get("window").width * 0.4,
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "dashed",
  },
  vwRowButtonsAdjustScore: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "20%",
  },
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
  vwRowScore: {
    backgroundColor: "#806181",
    borderRadius: 20,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: "15%",
  },
  txtRowScore: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  vwGroupLastActionButtonsInstructionsAndLabels: {
    // width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "dashed",
  },
  vwGroupInstructionsAndLabels: {
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
  },
  txtInstructions: {
    color: "#806181",
    fontSize: 12,
    fontWeight: "bold",
    width: Dimensions.get("window").width * 0.8 + 5,
  },
  vwGroupLabels: {
    flexDirection: "row",
    position: "relative",
    height: 15,
    width: Dimensions.get("window").width * 0.8 + 5, // +5 for padding linked to btnLastActionSmall and btnLastActionBig
  },
  txtGroupLabel: {
    color: "gray",
    fontSize: 10,
    position: "absolute",
    top: 0,
    zIndex: 1,
    textAlign: "center",
  },
  vwGroupLastActionButtonsSuper: {
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "dashed",
  },
  vwGroupLastActionButtons: {
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#806181",
    borderRadius: 20,
    padding: 5,
    width: Dimensions.get("window").width * 0.8 + 5, // +5 for padding linked to btnLastActionSmall and btnLastActionBig
  },
  btnLastAction: {
    backgroundColor: "#BD9AC1",
    borderWidth: 0,
    height: null,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    width: null,
  },
  btnLastActionSmall: {
    width: Dimensions.get("window").width * 0.1 - 5, // +5 for padding linked to vwGroupLastActionButtons
  },
  btnLastActionBig: {
    width: Dimensions.get("window").width * 0.2 - 5, // +5 for padding linked to vwGroupLastActionButtons
  },
  txtLastAction: {
    color: "#806181",
    fontSize: 15,
  },
  vwDropDownContainer: {
    position: "absolute",
    top: 30,
    // left: Dimensions.get("window").width * 0.4 + 5,
    // width: Dimensions.get("window").width * 0.2 - 5,
    backgroundColor: "#806181",
    borderRadius: 10,
    padding: 5,
    zIndex: 2,
    gap: 5,
  },
  btnDropDown: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
  },
  txtDropDownBtn: {
    color: "#806181",
    // fontSize: 15,
  },
  // ------------
  // MIDDLE Container
  // ------------
  containerMiddle: {
    alignItems: "center",
    // width: Dimensions.get("window").width,
  },
  containerMiddleSub: {
    backgroundColor: "#F0EAF9",
    alignItems: "center",
    width: Dimensions.get("window").width,
    // padding: 15,
    // gap: 20,
    paddingBottom: 20,
    borderWidth: 2,
    borderColor: "#F0EAF9",
  },
  containerMiddleSubFavorited: {
    // borderWidth: 2,
    borderColor: "#806181",
    // boxSizing: "border-box",
  },
  // vwPlayerSuperSpacer: {
  //   borderWidth: 1,
  //   borderColor: "#6E4C84",
  //   borderStyle: "dashed",
  //   width: "100%",
  //   // alignItems: "center",
  //   paddingVertical: 0,
  // },
  // vwPlayer: {
  //   position: "absolute",

  //   borderWidth: 1,
  //   borderColor: "#6E4C84",
  //   borderRadius: 30,
  //   backgroundColor: "white",
  //   flexDirection: "row",
  //   gap: 10,
  //   padding: 5,
  //   width: Dimensions.get("window").width * 0.3,
  //   zIndex: 1,
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

  // ------------
  // BOTTOM Container
  // ------------

  containerBottom: {
    width: "100%",
    // backgroundColor: "green",
  },
  vwRallyButtonsGroup: {
    flexDirection: "row",
  },
  vwGroupButtons: {
    position: "relative",
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.4,
    justifyContent: "center",
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "dashed",
  },

  btnRallyGroupBottom: {
    paddingHorizontal: 0,
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "dashed",
    paddingTop: 50,
  },
  vwGroupButtonsLine: {
    width: Dimensions.get("window").width * 0.4,
    height: 5,
    backgroundColor: "#806181",
    position: "absolute",
    top: Dimensions.get("window").width * 0.2 - 20,
    left: 0,
    // rotate
    transform: [{ rotate: "-45deg" }],
    zIndex: 0,
  },
  btnRallyGroupTop: {
    // borderColor: "gray",
    // borderWidth: 1,
    // borderStyle: "dashed",
  },
  btnReception: {
    width: 50,
    height: 50,
  },
  vwButtonFavorite: {
    borderRadius: (Dimensions.get("window").width * 0.2) / 2,
    backgroundColor: "white",
    marginTop: -35,
    paddingTop: 5,
    width: Dimensions.get("window").width * 0.2,
    alignItems: "center",

    // height: Dimensions.get("window").width * 0.15,
  },
  btnFavorite: {
    // marginTop: -50,
  },
  vwSendScriptGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
});
