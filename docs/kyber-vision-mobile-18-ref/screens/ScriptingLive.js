import {
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	TextInput,
	Alert,
} from "react-native";
import TemplateViewWithTopChildrenSmall from "./subcomponents/TemplateViewWithTopChildrenSmall";
import ScriptingPortrait from "./subcomponents/ScriptingLivePortrait";
import ScriptingLiveLandscape from "./subcomponents/ScriptingLiveLandscape";
import { Gesture } from "react-native-gesture-handler";
import * as ScreenOrientation from "expo-screen-orientation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	// replaceScriptMatchActionsArray,
	updateScriptSessionActionsArray,
	updatePlayersArray,
	setScriptingForPlayerObject,
	// updateScriptId,
} from "../reducers/script";
import SwipePad from "./subcomponents/swipePads/SwipePad";
import { useMemo } from "react";
export default function ScriptingLive({ navigation }) {
	// const [tapIsActive, setTapIsActive] = useState(true);
	// const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });
	// const [circleSize, setCircleSize] = useState({ width: 50, height: 50 });
	const topChildren = (
		<View>
			<Text style={styles.txtTopChildren}>Live Scripting </Text>
		</View>
	);
	const userReducer = useSelector((state) => state.user);
	const scriptReducer = useSelector((state) => state.script);
	const dispatch = useDispatch();
	const [setScores, setSetScores] = useState({
		teamAnalyzed: 0,
		teamOpponent: 0,
	});
	const [matchSetsWon, setMatchSetsWon] = useState({
		teamAnalyzed: 0,
		teamOpponent: 0,
	});

	// Dropdowns Visibility
	const [
		lastActionDropDownIsVisibleQuality,
		setLastActionDropDownIsVisibleQuality,
	] = useState(false);
	const [
		lastActionDropDownIsVisiblePosition,
		setLastActionDropDownIsVisiblePosition,
	] = useState(false);
	const [
		lastActionDropDownIsVisiblePlayer,
		setLastActionDropDownIsVisiblePlayer,
	] = useState(false);
	const [lastActionDropDownIsVisibleType, setLastActionDropDownIsVisibleType] =
		useState(false);
	const [
		lastActionDropDownIsVisibleSubtype,
		setLastActionDropDownIsVisibleSubtype,
	] = useState(false);

	const [
		scriptingPlayerDropdownIsVisible,
		setScriptingPlayerDropdownIsVisible,
	] = useState(false);

	// set only one to true all others to false
	const setDropdownVisibility = (dropdownName) => {
		console.log(`setDropdownVisibility: ${dropdownName}`);
		// setLastActionDropDownIsVisibleQuality((prev) => !prev);
		// setLastActionDropDownIsVisiblePosition((prev) => !prev);
		console.log("There was no error");
		switch (dropdownName) {
			case "quality":
				// setLastActionDropDownIsVisibleQuality(true);
				setLastActionDropDownIsVisibleQuality((prev) => !prev);
				setLastActionDropDownIsVisiblePosition(false);
				setLastActionDropDownIsVisiblePlayer(false);
				setLastActionDropDownIsVisibleType(false);
				setLastActionDropDownIsVisibleSubtype(false);
				setScriptingPlayerDropdownIsVisible(false);
				break;
			case "position":
				console.log("setDropdownVisibility: position");
				setLastActionDropDownIsVisibleQuality(false);
				setLastActionDropDownIsVisiblePosition((prev) => !prev);
				setLastActionDropDownIsVisiblePlayer(false);
				setLastActionDropDownIsVisibleType(false);
				setLastActionDropDownIsVisibleSubtype(false);
				setScriptingPlayerDropdownIsVisible(false);
				break;
			case "player":
				setLastActionDropDownIsVisibleQuality(false);
				setLastActionDropDownIsVisiblePosition(false);
				setLastActionDropDownIsVisiblePlayer((prev) => !prev);
				setLastActionDropDownIsVisibleType(false);
				setLastActionDropDownIsVisibleSubtype(false);
				setScriptingPlayerDropdownIsVisible(false);
				break;
			case "type":
				setLastActionDropDownIsVisibleQuality(false);
				setLastActionDropDownIsVisiblePosition(false);
				setLastActionDropDownIsVisiblePlayer(false);
				setLastActionDropDownIsVisibleType((prev) => !prev);
				setLastActionDropDownIsVisibleSubtype(false);
				setScriptingPlayerDropdownIsVisible(false);
				break;
			case "subtype":
				setLastActionDropDownIsVisibleQuality(false);
				setLastActionDropDownIsVisiblePosition(false);
				setLastActionDropDownIsVisiblePlayer(false);
				setLastActionDropDownIsVisibleType(false);
				setLastActionDropDownIsVisibleSubtype((prev) => !prev);
				setScriptingPlayerDropdownIsVisible(false);
				break;
			case "scriptingPlayer":
				setLastActionDropDownIsVisibleQuality(false);
				setLastActionDropDownIsVisiblePosition(false);
				setLastActionDropDownIsVisiblePlayer(false);
				setLastActionDropDownIsVisibleType(false);
				setLastActionDropDownIsVisibleSubtype(false);
				setScriptingPlayerDropdownIsVisible((prev) => !prev);
				break;
			default:
				break;
		}
	};
	// -------------
	// Orientation Stuff
	// -------------
	// orientation
	const [orientation, setOrientation] = useState("portrait");

	useEffect(() => {
		// console.log("- Position useEffect");
		ScreenOrientation.unlockAsync();
		checkOrientation();
		const subscriptionScreenOrientation =
			ScreenOrientation.addOrientationChangeListener(handleOrientationChange);

		return () => {
			subscriptionScreenOrientation.remove();
			ScreenOrientation.lockAsync();
		};
	});

	const checkOrientation = async () => {
		// console.log("in checkOrientation");
		const orientationObject = await ScreenOrientation.getOrientationAsync();
		// console.log(`orientation is ${orientationObject}`);
		if (
			orientationObject.orientationInfo.orientation == 4 ||
			orientationObject.orientationInfo.orientation == 3
		) {
			setOrientation("landscape");
		} else {
			setOrientation("portrait");
		}
	};
	const handleOrientationChange = async (orientationObject) => {
		if (
			orientationObject.orientationInfo.orientation == 4 ||
			orientationObject.orientationInfo.orientation == 3
		) {
			setOrientation("landscape");
			await ScreenOrientation.lockAsync(
				ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
			);
		} else {
			setOrientation("portrait");
			await ScreenOrientation.lockAsync(
				ScreenOrientation.OrientationLock.PORTRAIT_UP
			);
		}
	};

	// -----------------
	//  Swipe Pad - 1
	// -----------------
	const [padVisible, setPadVisible] = useState(false);
	const [tapIsActive, setTapIsActive] = useState(true);
	const [tapDetails, setTapDetails] = useState({
		timestamp: "no date",
		padPosCenterX: 0,
		padPosCenterY: 0,
	});
	const [padPositionCenter, setPadPositionCenter] = useState({ x: 0, y: 0 });
	const [swipeColorDict, setSwipeColorDict] = useState(
		userReducer.defaultWheelColors
	);
	const stdSwipePadDefaultTextColor = "black";
	const stdSwipePadDefaultTextFontSize = 10;
	const defaultTextStyles = Object.fromEntries(
		Array.from({ length: 16 }, (_, i) => [
			i + 1, // Key: 1 to 16
			{
				color: stdSwipePadDefaultTextColor,
				fontSize: stdSwipePadDefaultTextFontSize,
				selected: false,
			},
		])
	);
	const [swipeTextStyleDict, setSwipeTextStyleDict] =
		useState(defaultTextStyles);

	const [numTrianglesMiddle, setNumTrianglesMiddle] = useState(4); // 2, 4, or 5
	const [numTrianglesOuter, setNumTrianglesOuter] = useState(12); // 8, 10 or 12

	// -------------
	// Gesture Stuff
	// -------------
	const gestureTapBegin = Gesture.Tap().onBegin((event) => {
		console.log("gestureTapBegin");

		// 🚫 Stop if match already won (best of 5 → first to 3)
		if (matchSetsWon.teamAnalyzed === 3 || matchSetsWon.teamOpponent === 3) {
			Alert.alert("Reached end of game", "Please send the script.");
			return;
		}

		setSwipeColorDict(userReducer.defaultWheelColors);
		setSwipeTextStyleDict(defaultTextStyles);
		if (tapIsActive) {
			const timestamp = new Date().toISOString();
			const { x, y, absoluteX, absoluteY } = event;
			if (orientation == "portrait") {
				const xPosPortait = x - userReducer.circleRadiusOuter;
				const yPosPortait =
					y +
					scriptReducer.coordsScriptLivePortraitContainerMiddle.y -
					userReducer.circleRadiusOuter;

				// console.log(`y: ${y}`);
				// console.log(
				//   `scriptReducer.coordsScriptLivePortraitContainerMiddle.y: ${scriptReducer.coordsScriptLivePortraitContainerMiddle.y}`
				// );

				setPadPositionCenter({
					x: xPosPortait,
					y: yPosPortait,
				});
				console.log(`TapBegin - X: ${xPosPortait} - Y: ${yPosPortait}`);
				console.log(
					`scriptReducer.coordsScriptLivePortraitVwPlayerSuperSpacer.height: ${scriptReducer.coordsScriptLivePortraitVwPlayerSuperSpacer.height}`
				);
				setTapDetails({
					timestamp,
					padPosCenterX: xPosPortait,
					padPosCenterY: yPosPortait,
				});
				// Note: y in this case, starts at 0, so
				//   scriptReducer.coordsScriptLivePortraitVwPlayerSuperSpacer.height is a good top reference compared to y
				if (
					y > scriptReducer.coordsScriptLivePortraitVwPlayerSuperSpacer.height
				) {
					setPadVisible(true);
					setTapIsActive(false);
				}
			} else {
				// Landscape
				const xPosLandscape =
					x +
					scriptReducer.coordsScriptLiveLandscapeContainerLeft.width -
					userReducer.circleRadiusOuter;
				const yPosLandscape =
					y +
					scriptReducer.coordsScriptLiveLandscapeContainerMiddleTop.height -
					userReducer.circleRadiusOuter;
				setPadPositionCenter({
					x: xPosLandscape,
					y: yPosLandscape,
				});
				console.log(`TapBegin - X: ${xPosLandscape} - Y: ${yPosLandscape}`);
				setTapDetails({
					timestamp,
					padPosCenterX: xPosLandscape,
					padPosCenterY: yPosLandscape,
				});
				if (
					y > scriptReducer.coordsScriptLiveLandscapeVwPlayerSuper.height &&
					y <
						scriptReducer.coordsScriptLiveLandscapeContainerMiddleBottom
							.height -
							scriptReducer.coordsScriptLiveLandscapeVwBelowSvgVolleyballCourt
								.height
				) {
					setPadVisible(true);
					setTapIsActive(false);
				}
			}
		}
	});

	const gestureTapEnd = Gesture.Tap()
		.maxDuration(10000) // <-- basically if user keeps hold for more than 10 seconds the wheel will just stay there.
		.onEnd((event) => {
			console.log("gestureTapEnd");
			setPadVisible(false);
			setTapIsActive(true);
		});

	const gestureSwipeOnChange = Gesture.Pan().onChange((event) => {
		// console.log("👍 start gestureSwipeOnChange");

		const { x, y, translationX, translationY, absoluteX, absoluteY } = event;

		let swipePosX;
		let swipePosY;
		if (orientation === "portrait") {
			swipePosX = x - userReducer.circleRadiusOuter;
			swipePosY =
				y +
				scriptReducer.coordsScriptLivePortraitContainerMiddle.y -
				userReducer.circleRadiusOuter;
		} else {
			// // Landscape
			swipePosX =
				x +
				scriptReducer.coordsScriptLiveLandscapeContainerLeft.width -
				userReducer.circleRadiusOuter;
			swipePosY =
				y +
				scriptReducer.coordsScriptLiveLandscapeContainerMiddleTop.height -
				userReducer.circleRadiusOuter;
		}

		const distanceFromCenter = Math.sqrt(
			Math.pow(swipePosX - tapDetails.padPosCenterX, 2) +
				Math.pow(swipePosY - tapDetails.padPosCenterY, 2)
		);

		const relativeToPadCenterX = swipePosX - tapDetails.padPosCenterX;
		const relativeToPadCenterY = swipePosY - tapDetails.padPosCenterY;

		const inInnerCircle = distanceFromCenter < userReducer.circleRadiusInner;
		const inMiddleCircle = distanceFromCenter < userReducer.circleRadiusMiddle;

		if (inInnerCircle) {
			handleSwipeColorChange("center");
			// setCurrentActionType(null);
		} else {
			logicFourTwelveCircle(
				relativeToPadCenterX,
				relativeToPadCenterY,
				inMiddleCircle
			);
		}
	});

	// Combine swipe and tap gestures
	const gestureSwipeOnEnd = Gesture.Pan().onEnd((event) => {
		const { x, y, translationX, translationY, absoluteX, absoluteY } = event;

		const swipePosX = x - userReducer.circleRadiusOuter;
		const swipePosY =
			y +
			scriptReducer.coordsScriptLivePortraitContainerMiddle.y -
			userReducer.circleRadiusOuter;

		const distanceFromCenter = Math.sqrt(
			Math.pow(swipePosX - tapDetails.padPosCenterX, 2) +
				Math.pow(swipePosY - tapDetails.padPosCenterY, 2)
		);

		// NOTE: the logic here is if the swipe is outside the inner circle then add a new action to the sessionActionsArray
		// - if the swipe is inside the inner circle then do either:
		// -- if no actions recorded in sessionActionsArray then reset to "?"
		// -- if actions recorded in sessionActionsArray then update to the last action in the sessionActionsArray
		if (distanceFromCenter > userReducer.circleRadiusInner) {
			// console.log(" !! Add action ");

			console.log(
				`tapDetails: ${tapDetails.padPosCenterX} - ${tapDetails.padPosCenterY}`
			);

			// tapDetails.padPosCenterY is adjusted on the y axis to account for the circle radius
			const tapYAdjusted =
				tapDetails.padPosCenterY + userReducer.circleRadiusOuter;
			const tapXAdjusted =
				tapDetails.padPosCenterX + userReducer.circleRadiusOuter;

			// Determine posistion portait
			if (orientation == "portrait") {
				if (
					tapYAdjusted >
					scriptReducer.coordsScriptLivePortraitContainerMiddle.y +
						scriptReducer.coordsScriptLivePortraitContainerMiddle.height * 0.5
				) {
					// console.log("back row");
					if (
						tapXAdjusted >
						scriptReducer.coordsScriptLivePortraitContainerMiddle.width * 0.66
					) {
						// console.log("right");
						lastActionPositionIndexRef.current = 1;
						// setLastActionPosition(1);
					} else if (
						tapXAdjusted >
						scriptReducer.coordsScriptLivePortraitContainerMiddle.width * 0.33
					) {
						// console.log("middle");
						lastActionPositionIndexRef.current = 6;
						// setLastActionPosition(6);
					} else {
						// console.log("left ");
						lastActionPositionIndexRef.current = 5;
						// setLastActionPosition(5);
					}
				} else {
					// console.log("front row");
					if (
						tapXAdjusted >
						scriptReducer.coordsScriptLivePortraitContainerMiddle.width * 0.66
					) {
						// console.log("right");
						lastActionPositionIndexRef.current = 2;
						// setLastActionPosition(2);
					} else if (
						tapXAdjusted >
						scriptReducer.coordsScriptLivePortraitContainerMiddle.width * 0.33
					) {
						// console.log("middle");
						lastActionPositionIndexRef.current = 3;
						// setLastActionPosition(3);
					} else {
						// console.log("left ");
						lastActionPositionIndexRef.current = 4;
						// setLastActionPosition(4);
					}
				}
			} else {
				console.log(`tapXAdjusted: ${tapXAdjusted}`);
				console.log(
					`landscape gest first 1/3: ${
						scriptReducer.coordsScriptLiveLandscapeContainerMiddleBottom.width *
						0.33
					}`
				);
				if (
					tapYAdjusted >
					scriptReducer.coordsScriptLiveLandscapeContainerMiddleTop.height +
						scriptReducer.coordsScriptLiveLandscapeContainerMiddleBottom
							.height /
							2
				) {
					// Landscape Back Row
					if (
						tapXAdjusted >
						scriptReducer.coordsScriptLiveLandscapeContainerLeft.width +
							scriptReducer.coordsScriptLiveLandscapeContainerMiddleBottom
								.width *
								0.66
					) {
						lastActionPositionIndexRef.current = 1;
					} else if (
						tapXAdjusted >
						scriptReducer.coordsScriptLiveLandscapeContainerLeft.width +
							scriptReducer.coordsScriptLiveLandscapeContainerMiddleBottom
								.width *
								0.33
					) {
						lastActionPositionIndexRef.current = 6;
					} else {
						lastActionPositionIndexRef.current = 5;
					}
				} else {
					// Landscape Front Row
					if (
						tapXAdjusted >
						scriptReducer.coordsScriptLiveLandscapeContainerLeft.width +
							scriptReducer.coordsScriptLiveLandscapeContainerMiddleBottom
								.width *
								0.66
					) {
						lastActionPositionIndexRef.current = 2;
					} else if (
						tapXAdjusted >
						scriptReducer.coordsScriptLiveLandscapeContainerLeft.width +
							scriptReducer.coordsScriptLiveLandscapeContainerMiddleBottom
								.width *
								0.33
					) {
						lastActionPositionIndexRef.current = 3;
					} else {
						lastActionPositionIndexRef.current = 4;
					}
				}
			}
			addNewActionToScriptReducersActionsArray(
				scriptReducer.typesArray[lastActionTypeIndexRef.current],
				scriptReducer.qualityArrayOuterCircle[
					lastActionQualityIndexRef.current
				],
				lastActionPositionIndexRef.current
			);
		} else {
			console.log(" no action registered on this swipe ");
		}
	});

	// const combinedGestures = Gesture.Simultaneous(gestureTapBegin, gestureTapEnd);
	const combinedGestures = Gesture.Simultaneous(
		gestureTapBegin,
		gestureTapEnd,
		gestureSwipeOnChange,
		gestureSwipeOnEnd
	);

	// -----------------
	// Swiping Functions
	// -----------------

	// Function to temporarily change color
	const handleSwipeColorChange = (direction, outerDirection = false) => {
		setSwipeColorDict(userReducer.defaultWheelColors);
		setSwipeTextStyleDict(defaultTextStyles);

		if (!outerDirection) {
			setSwipeColorDict((prevColors) => ({
				...prevColors,
				[direction]: userReducer.selectedWheelColors[direction],
			}));
			setSwipeTextStyleDict((prevTextStyles) => ({
				...prevTextStyles,
				[direction]: {
					color: "black",
					fontSize: 15,
					fontWeight: "bold",
					selected: true,
				},
			}));
		} else {
			setSwipeColorDict((prevColors) => ({
				...prevColors,
				[direction]: userReducer.selectedWheelColors[direction],
				[outerDirection]: userReducer.selectedWheelColors[outerDirection],
			}));
			setSwipeTextStyleDict((prevTextStyles) => ({
				...prevTextStyles,
				[direction]: {
					color: "black",
					fontSize: 15,
					fontWeight: "bold",
					selected: true,
				},
				[outerDirection]: {
					color: "black",
					fontSize: 15,
					fontWeight: "bold",
					selected: true,
				},
			}));
		}
	};

	const lastActionTypeIndexRef = useRef(null);
	const lastActionQualityIndexRef = useRef(null);
	const lastActionPositionIndexRef = useRef(null);

	const logicFourTwelveCircle = (
		relativeToPadCenterX,
		relativeToPadCenterY,
		inMiddleCircle
	) => {
		// Y dependent
		const boundary15Y = relativeToPadCenterX * Math.tan((Math.PI / 180) * 15); // ? parts to circle, 15 degrees
		const boundary45Y = relativeToPadCenterX * Math.tan((Math.PI / 180) * 45); // 8 parts to circle 45 = 360/8
		// X dependent
		const boundary75X =
			relativeToPadCenterY * (1 / Math.tan((Math.PI / 180) * 75));

		let wheelPositionMiddle = 0; // 0-4
		let wheelPositionOuter = 5; // 5-12, 5 is like 0, according to the scriptReducer.subtypesArray
		if (Math.abs(relativeToPadCenterY) < boundary45Y) {
			// Right side
			wheelPositionMiddle = 1;
			handleSwipeColorChange(wheelPositionMiddle);
			lastActionTypeIndexRef.current = wheelPositionMiddle - 1;
			if (!inMiddleCircle) {
				wheelPositionOuter = 16; // like 16
				lastActionQualityIndexRef.current = 0;
				if (-relativeToPadCenterY > boundary15Y) {
					// console.log("--- Right Top ---");
					handleSwipeColorChange(wheelPositionMiddle, wheelPositionOuter);
					lastActionQualityIndexRef.current = wheelPositionOuter - 5;
				} else if (Math.abs(relativeToPadCenterY) < boundary15Y) {
					// console.log("--- Right Middle ---");
					wheelPositionOuter = 5;
					handleSwipeColorChange(wheelPositionMiddle, wheelPositionOuter);
					lastActionQualityIndexRef.current = wheelPositionOuter - 5;
				} else {
					// console.log("--- Right Bottom ---");
					wheelPositionOuter = 6;
					handleSwipeColorChange(wheelPositionMiddle, wheelPositionOuter);
					lastActionQualityIndexRef.current = wheelPositionOuter - 5;
				}
			}
		} else if (relativeToPadCenterY > Math.abs(boundary45Y)) {
			// Bottom
			wheelPositionMiddle = 2;
			lastActionQualityIndexRef.current = 0;
			handleSwipeColorChange(wheelPositionMiddle);
			lastActionTypeIndexRef.current = wheelPositionMiddle - 1;
			if (!inMiddleCircle) {
				wheelPositionOuter = 7;
				if (relativeToPadCenterX > boundary75X) {
					handleSwipeColorChange(wheelPositionMiddle, wheelPositionOuter);
					// Def Quality
					lastActionQualityIndexRef.current = wheelPositionOuter - 5;
				} else if (Math.abs(relativeToPadCenterX) < boundary75X) {
					wheelPositionOuter = 8;
					handleSwipeColorChange(wheelPositionMiddle, wheelPositionOuter);
					// Def Quality
					lastActionQualityIndexRef.current = wheelPositionOuter - 5;
				} else {
					wheelPositionOuter = 9;
					handleSwipeColorChange(wheelPositionMiddle, wheelPositionOuter);
					// Def Quality
					lastActionQualityIndexRef.current = wheelPositionOuter - 5;
				}
			}
		} else if (relativeToPadCenterY > boundary45Y) {
			// Left
			wheelPositionMiddle = 3;
			lastActionQualityIndexRef.current = 0;
			handleSwipeColorChange(wheelPositionMiddle);
			lastActionTypeIndexRef.current = wheelPositionMiddle - 1;
			if (!inMiddleCircle) {
				wheelPositionOuter = 10;
				if (relativeToPadCenterY > Math.abs(boundary15Y)) {
					handleSwipeColorChange(wheelPositionMiddle, wheelPositionOuter);
					// Set Quality
					lastActionQualityIndexRef.current = wheelPositionOuter - 5;
				} else if (relativeToPadCenterY > boundary15Y) {
					wheelPositionOuter = 11;
					handleSwipeColorChange(wheelPositionMiddle, wheelPositionOuter);
					// Set Quality
					lastActionQualityIndexRef.current = wheelPositionOuter - 5;
				} else {
					wheelPositionOuter = 12;
					handleSwipeColorChange(wheelPositionMiddle, wheelPositionOuter);
					// Set Quality
					lastActionQualityIndexRef.current = wheelPositionOuter - 5;
				}
			}
		} else if (relativeToPadCenterY < boundary45Y) {
			// Top
			wheelPositionMiddle = 4;
			lastActionQualityIndexRef.current = 0;
			handleSwipeColorChange(wheelPositionMiddle);
			lastActionTypeIndexRef.current = wheelPositionMiddle - 1;
			if (!inMiddleCircle) {
				wheelPositionOuter = 13;
				if (relativeToPadCenterX < boundary75X) {
					handleSwipeColorChange(wheelPositionMiddle, wheelPositionOuter);
					// Att Quality
					lastActionQualityIndexRef.current = wheelPositionOuter - 5;
				} else if (relativeToPadCenterX < Math.abs(boundary75X)) {
					wheelPositionOuter = 14;
					handleSwipeColorChange(wheelPositionMiddle, wheelPositionOuter);
					// Att Quality
					lastActionQualityIndexRef.current = wheelPositionOuter - 5;
				} else {
					wheelPositionOuter = 15;
					handleSwipeColorChange(wheelPositionMiddle, wheelPositionOuter);
					// Att Quality
					lastActionQualityIndexRef.current = wheelPositionOuter - 5;
				}
			}
		} else {
			console.log(" !! Not add action ");
			setSwipeColorDict(userReducer.defaultWheelColors);
		}
	};

	const addNewActionToScriptReducersActionsArray = (
		type,
		quality,
		position
	) => {
		const newActionObj = {
			dateScripted: new Date().toISOString(), // Convert to ISO string
			timestamp: new Date().toISOString(),
			// type: lastActionType,
			type: type,
			subtype: null,
			quality: quality || 0,
			playerId: scriptReducer.scriptingForPlayerObject.id,
			setNumber: matchSetsWon.teamAnalyzed + matchSetsWon.teamOpponent + 1,
			scoreTeamAnalyzed: setScores.teamAnalyzed,
			// scoreTeamOpponent: setScores.teamOpponent,
			scoreTeamOther: setScores.teamOpponent,
			// rotation: scriptReducer.rotationArray[0],
			rotation: "rotation not set yet",
			zone: position,
			opponentServed: false,
			favorite: false,
			sessionId: scriptReducer.sessionsArray.find((s) => s.selected).id,
			playerId: scriptReducer.scriptingForPlayerObject.id,
		};

		let tempArray = [...scriptReducer.sessionActionsArray, newActionObj];
		tempArray.sort((a, b) => a.timestamp - b.timestamp);
		dispatch(updateScriptSessionActionsArray(tempArray));
	};

	const sendScriptReducerSessionActionsArrayToServer = async () => {
		console.log("----> sendScriptReducerSessionActionsArrayToServer");

		const bodyObj = {
			actionsArray: scriptReducer.sessionActionsArray,
			sessionId: scriptReducer.sessionsArray.find((s) => s.selected).id,
			// scriptId: scriptReducer.scriptId,
		};

		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_BASE_URL}/scripts/scripting-live-screen/receive-actions-array`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userReducer.token}`,
				},
				body: JSON.stringify(bodyObj),
			}
		);

		console.log("Received response:", response.status);

		let resJson = null;
		const contentType = response.headers.get("Content-Type");

		if (contentType?.includes("application/json")) {
			resJson = await response.json();
		}

		if (response.ok && resJson) {
			dispatch(updateScriptSessionActionsArray([]));
			alert(
				`${scriptReducer.sessionActionsArray.length} actions sent to server successfully`
			);
		} else {
			const errorMessage =
				resJson?.error ||
				`There was a server error (and no resJson): ${response.status}`;
			alert(errorMessage);
		}
	};

	// -----------------
	//  Last Action - Modify
	// -----------------

	const handleModifyQuality = (quality) => {
		console.log(`lastActionQuality: ${quality}`);
		const lastRecordedAction =
			scriptReducer.sessionActionsArray[
				scriptReducer.sessionActionsArray.length - 1
			];

		if (!lastRecordedAction) return;

		const updatedArray = scriptReducer.sessionActionsArray.map((action) =>
			action.timestamp === lastRecordedAction.timestamp
				? { ...action, quality }
				: action
		);

		dispatch(updateScriptSessionActionsArray(updatedArray));
	};
	const handleModifyPosition = (position) => {
		console.log(`lastActionPosition: ${position}`);
		const lastRecordedAction =
			scriptReducer.sessionActionsArray[
				scriptReducer.sessionActionsArray.length - 1
			];

		if (!lastRecordedAction) return;

		const updatedArray = scriptReducer.sessionActionsArray.map((action) =>
			action.timestamp === lastRecordedAction.timestamp
				? { ...action, zone: position }
				: action
		);

		dispatch(updateScriptSessionActionsArray(updatedArray));
	};

	const handleModifyLastActionPlayer = (playerObj) => {
		console.log(`lastActionPlayer: ${playerObj.firstName}`);
		const tempArray = scriptReducer.playersArray.map((player) => {
			if (player.id === playerObj.id) {
				return {
					...player,
					selected: !player.selected,
				};
			}
			return { ...player, selected: false };
		});
		dispatch(updatePlayersArray(tempArray));
		// dispatch(setScriptingForPlayerObject(playerObj));
		console.log(`- selected player [2]: ${playerObj.firstName}`);
		// setLastActionPlayer(player);
		const lastRecordedAction =
			scriptReducer.sessionActionsArray[
				scriptReducer.sessionActionsArray.length - 1
			];

		if (!lastRecordedAction) return;

		const updatedArray = scriptReducer.sessionActionsArray.map((action) =>
			action.timestamp === lastRecordedAction.timestamp
				? { ...action, playerId: playerObj.id }
				: action
		);

		dispatch(updateScriptSessionActionsArray(updatedArray));
	};

	const handleModifyType = (type) => {
		console.log(`lastActionType: ${type}`);
		const lastRecordedAction =
			scriptReducer.sessionActionsArray[
				scriptReducer.sessionActionsArray.length - 1
			];

		if (!lastRecordedAction) return;

		const updatedArray = scriptReducer.sessionActionsArray.map((action) =>
			action.timestamp === lastRecordedAction.timestamp
				? { ...action, type }
				: action
		);

		dispatch(updateScriptSessionActionsArray(updatedArray));
	};

	const handleModifySubtype = (subtype) => {
		console.log(`lastActionSubtype: ${subtype}`);
		// setLastActionSubtype(subtype);

		const lastRecordedAction =
			scriptReducer.sessionActionsArray[
				scriptReducer.sessionActionsArray.length - 1
			];

		if (!lastRecordedAction) return;

		const updatedArray = scriptReducer.sessionActionsArray.map((action) =>
			action.timestamp === lastRecordedAction.timestamp
				? { ...action, subtype }
				: action
		);

		dispatch(updateScriptSessionActionsArray(updatedArray));
	};

	// -----------------
	//  Score + Set Logic (best of 5, win by 2; set 5 to 15)
	// -----------------
	// team: "analyzed" | "opponent"
	// scoreAdjust: +1 or -1 (we only evaluate set end on +1)
	const handleSetScorePress = (team, scoreAdjust) => {
		// // 🚫 Stop Alert is in GestureTapBegin

		// Compute new set scores with floor at 0
		let newAnalyzed = setScores.teamAnalyzed;
		let newOpponent = setScores.teamOpponent;

		if (team === "analyzed") {
			const next = newAnalyzed + scoreAdjust;
			if (next < 0) return;
			newAnalyzed = next;
		} else {
			const next = newOpponent + scoreAdjust;
			if (next < 0) return;
			newOpponent = next;
		}

		// Push the score change into the last recorded action (if any)
		const lastRecordedAction =
			scriptReducer.sessionActionsArray[
				scriptReducer.sessionActionsArray.length - 1
			];
		if (!lastRecordedAction) {
			// No actions yet: just update the local set score state and bail
			setSetScores({ teamAnalyzed: newAnalyzed, teamOpponent: newOpponent });
			return;
		}

		// Update last action’s score fields
		let updatedArray = scriptReducer.sessionActionsArray.map((action) =>
			action.timestamp === lastRecordedAction.timestamp
				? {
						...action,
						scoreTeamAnalyzed: newAnalyzed,
						scoreTeamOther: newOpponent,
				  }
				: action
		);

		// Decide current set number and its target points
		const currentSetNumber =
			matchSetsWon.teamAnalyzed + matchSetsWon.teamOpponent + 1; // 1..5
		const setTarget = currentSetNumber === 5 ? 15 : 25;

		// Only check for set end on increment (+1). Decrements simply adjust scores.
		let setJustEnded = false;
		let winner = null; // "analyzed" | "opponent"

		if (scoreAdjust > 0) {
			// Win-by-2 condition
			if (newAnalyzed >= setTarget && newAnalyzed - newOpponent >= 2) {
				setJustEnded = true;
				winner = "analyzed";
			} else if (newOpponent >= setTarget && newOpponent - newAnalyzed >= 2) {
				setJustEnded = true;
				winner = "opponent";
			}
		}

		if (setJustEnded) {
			// 1) Update matchSetsWon
			setMatchSetsWon((prev) => {
				const next = {
					teamAnalyzed: prev.teamAnalyzed + (winner === "analyzed" ? 1 : 0),
					teamOpponent: prev.teamOpponent + (winner === "opponent" ? 1 : 0),
				};
				return next;
			});

			// 2) Reset set scores to begin next set (if match not over)
			const winsAnalyzed =
				matchSetsWon.teamAnalyzed + (winner === "analyzed" ? 1 : 0);
			const winsOpponent =
				matchSetsWon.teamOpponent + (winner === "opponent" ? 1 : 0);
			const matchOver = winsAnalyzed === 3 || winsOpponent === 3;

			setSetScores({
				teamAnalyzed: 0,
				teamOpponent: 0,
			});

			// 3) Optionally append a "Set" action to mark the start of the next set
			//    (only if the match is not over and there will be a next set)
			if (!matchOver) {
				const nextSetNumber = currentSetNumber + 1; // start of next set
				const nowIso = new Date().toISOString();

				const setStartAction = {
					dateScripted: nowIso,
					timestamp: nowIso,
					type: "Set",
					subtype: null,
					quality: "0",
					playerId: scriptReducer.scriptingForPlayerObject.id,
					setNumber: nextSetNumber,
					scoreTeamAnalyzed: 0,
					scoreTeamOther: 0,
					rotation: "rotation not set yet",
					zone: 3, // neutral/default
					opponentServed: false,
					favorite: false,
					sessionId: scriptReducer.sessionsArray.find((s) => s.selected).id,
				};

				updatedArray = [...updatedArray, setStartAction];
			}
		} else {
			// No set end: just persist the new running scores
			setSetScores({
				teamAnalyzed: newAnalyzed,
				teamOpponent: newOpponent,
			});
		}

		// Persist actions array
		dispatch(updateScriptSessionActionsArray(updatedArray));
	};

	const handleModifyFavorite = () => {
		const lastRecordedAction =
			scriptReducer.sessionActionsArray[
				scriptReducer.sessionActionsArray.length - 1
			];

		if (!lastRecordedAction) return;
		//toggle favorite
		const updatedArray = scriptReducer.sessionActionsArray.map((action) =>
			action.timestamp === lastRecordedAction.timestamp
				? { ...action, favorite: !action.favorite }
				: action
		);

		dispatch(updateScriptSessionActionsArray(updatedArray));
	};

	const lastActionIsFavorite = () => {
		if (scriptReducer.sessionActionsArray.length === 0) return false;
		const lastRecordedAction =
			scriptReducer.sessionActionsArray[
				scriptReducer.sessionActionsArray.length - 1
			];
		return lastRecordedAction.favorite;
	};

	// -----------------
	//  Set Circle (score)
	// -----------------
	// Description: These are the circles that indicate sets won by each team
	// -> There are three of these
	// Expects team: "analyzed" | "opponent"
	const handleSetCirclePress = (team, setIndex) => {
		if (team === "analyzed") {
			if (matchSetsWon.teamAnalyzed === setIndex) {
				setMatchSetsWon({
					teamAnalyzed: setIndex - 1,
					teamOpponent: matchSetsWon.teamOpponent,
				});
			} else if (matchSetsWon.teamAnalyzed + 1 === setIndex) {
				setMatchSetsWon({
					teamAnalyzed: setIndex,
					teamOpponent: matchSetsWon.teamOpponent,
				});
			}
		} else {
			if (matchSetsWon.teamOpponent === setIndex) {
				setMatchSetsWon({
					teamAnalyzed: matchSetsWon.teamAnalyzed,
					teamOpponent: setIndex - 1,
				});
			} else if (matchSetsWon.teamOpponent + 1 === setIndex) {
				setMatchSetsWon({
					teamAnalyzed: matchSetsWon.teamAnalyzed,
					teamOpponent: setIndex,
				});
			}
		}
	};

	const styleVwMainPosition = {
		position: "absolute",
		left: padPositionCenter.x, // Center modal horizontally
		top: padPositionCenter.y, // Center modal vertically
		zIndex: 2,
	};

	// Determine which component to render
	const renderSwipePad = () => {
		if (padVisible) {
			return (
				<SwipePad
					styleVwMainPosition={styleVwMainPosition}
					swipeColorDict={swipeColorDict}
					swipeTextStyleDict={swipeTextStyleDict}
					numTrianglesMiddle={numTrianglesMiddle}
					numTrianglesOuter={numTrianglesOuter}
				/>
			);
		}
	};

	const subtypesArrayForLastAction = useMemo(() => {
		const lastActionType = scriptReducer.sessionActionsArray.at(-1)?.type;
		if (!lastActionType) return [];
		return scriptReducer.subtypesByType[lastActionType] ?? [];
	}, [scriptReducer.sessionActionsArray, scriptReducer.subtypesByType]);

	const getSubtypeForLastAction = useCallback(() => {
		const last = scriptReducer.sessionActionsArray.at(-1);
		if (!last) return "?";
		const v = last.subtype ?? null;
		return typeof v === "string" && v.length > 0 ? v.slice(0, 4) : "?";
	}, [scriptReducer.sessionActionsArray]);

	// Put this helper near your other functions in ScriptingLive.js
	const confirmAsync = (title, message) =>
		new Promise((resolve) => {
			Alert.alert(
				title,
				message,
				[
					{ text: "Cancel", style: "cancel", onPress: () => resolve(false) },
					{ text: "OK", onPress: () => resolve(true) },
				],
				// onDismiss only fires on Android or when cancelable: true and backdrop/back button is used
				{ cancelable: true, onDismiss: () => resolve(false) }
			);
		});

	const handleExitScriptingLive = async () => {
		const scriptSessionActionsArrayIsEmpty =
			scriptReducer.sessionActionsArray.length === 0;
		if (scriptSessionActionsArrayIsEmpty) {
			return true;
		}
		const confirmed = await confirmAsync(
			"Confirm Exit",
			"Are you sure you want to exit Scripting Live?"
		);
		if (confirmed) {
			// clear any local state you want before leaving
			dispatch(updateScriptSessionActionsArray([]));

			if (orientation == "landscape") {
				await ScreenOrientation.lockAsync(
					ScreenOrientation.OrientationLock.PORTRAIT_UP
				); // Force back to portrait
				setOrientation("portrait");
			}
		}
		return confirmed; // <-- TemplateViewWithTopChildrenSmall awaits this
	};

	// const handleExitScriptingLive = async () => {
	//   // let goBack = false;
	//   // create alert to confirm exit
	//   const goBack = await Alert.alert(
	//     "Confirm Exit",
	//     "Are you sure you want to exit Scripting Live?",
	//     [
	//       {
	//         text: "Cancel",
	//         onPress: () => {
	//           console.log("Cancel Pressed");
	//           return false;
	//         },
	//         style: "cancel",
	//       },
	//       {
	//         text: "OK",
	//         onPress: async () => {
	//           // navigation.goBack();
	//           dispatch(updateScriptSessionActionsArray([]));
	//           return true;
	//         },
	//       },
	//     ]
	//   );
	//   return goBack;
	// };

	return orientation == "portrait" ? (
		<TemplateViewWithTopChildrenSmall
			navigation={navigation}
			topChildren={topChildren}
			topHeight="10%"
			onBackPress={handleExitScriptingLive}
		>
			<ScriptingPortrait
				combinedGestures={combinedGestures}
				orientation={orientation}
				setScores={setScores}
				matchSetsWon={matchSetsWon}
				handleSetCirclePress={handleSetCirclePress}
				handleSetScorePress={handleSetScorePress}
				// ----------- Dropdowns Value -----------
				handleModifyQuality={handleModifyQuality}
				handleModifyPosition={handleModifyPosition}
				handleModifyLastActionPlayer={handleModifyLastActionPlayer}
				handleModifyType={handleModifyType}
				handleModifySubtype={handleModifySubtype}
				handleModifyFavorite={handleModifyFavorite}
				// --------- Dropdowns Toggles -----------
				// Quality
				lastActionDropDownIsVisibleQuality={lastActionDropDownIsVisibleQuality}
				setLastActionDropDownIsVisibleQuality={
					setLastActionDropDownIsVisibleQuality
				}
				// Position
				lastActionDropDownIsVisiblePosition={
					lastActionDropDownIsVisiblePosition
				}
				setLastActionDropDownIsVisiblePosition={
					setLastActionDropDownIsVisiblePosition
				}
				// Player
				lastActionDropDownIsVisiblePlayer={lastActionDropDownIsVisiblePlayer}
				setLastActionDropDownIsVisiblePlayer={
					setLastActionDropDownIsVisiblePlayer
				}
				// Type
				lastActionDropDownIsVisibleType={lastActionDropDownIsVisibleType}
				setLastActionDropDownIsVisibleType={setLastActionDropDownIsVisibleType}
				// Subtype
				lastActionDropDownIsVisibleSubtype={lastActionDropDownIsVisibleSubtype}
				setLastActionDropDownIsVisibleSubtype={
					setLastActionDropDownIsVisibleSubtype
				}
				// Player (Scripting)
				scriptingPlayerDropdownIsVisible={scriptingPlayerDropdownIsVisible}
				setDropdownVisibility={setDropdownVisibility}
				subtypesArrayForLastAction={subtypesArrayForLastAction}
				getSubtypeForLastAction={getSubtypeForLastAction}
				sendScriptReducerSessionActionsArrayToServer={
					sendScriptReducerSessionActionsArrayToServer
				}
				lastActionIsFavorite={lastActionIsFavorite()}
			/>
			{renderSwipePad()}
		</TemplateViewWithTopChildrenSmall>
	) : (
		<View style={{ flex: 1 }}>
			{/* <Text>Scripting - Live - Landscape</Text> */}
			<ScriptingLiveLandscape
				renderSwipePad={renderSwipePad}
				navigation={navigation}
				combinedGestures={combinedGestures}
				orientation={orientation}
				setOrientation={setOrientation}
				handleExitScriptingLive={handleExitScriptingLive}
				setScores={setScores}
				matchSetsWon={matchSetsWon}
				handleSetCirclePress={handleSetCirclePress}
				handleSetScorePress={handleSetScorePress}
				// ----------- Dropdowns Value -----------
				handleModifyQuality={handleModifyQuality}
				handleModifyPosition={handleModifyPosition}
				handleModifyLastActionPlayer={handleModifyLastActionPlayer}
				handleModifyType={handleModifyType}
				handleModifySubtype={handleModifySubtype}
				handleModifyFavorite={handleModifyFavorite}
				// --------- Dropdowns Toggles -----------
				// // Quality
				lastActionDropDownIsVisibleQuality={lastActionDropDownIsVisibleQuality}
				// // Position
				lastActionDropDownIsVisiblePosition={
					lastActionDropDownIsVisiblePosition
				}
				// // Player
				lastActionDropDownIsVisiblePlayer={lastActionDropDownIsVisiblePlayer}
				// // Type
				lastActionDropDownIsVisibleType={lastActionDropDownIsVisibleType}
				// // Subtype
				lastActionDropDownIsVisibleSubtype={lastActionDropDownIsVisibleSubtype}
				scriptingPlayerDropdownIsVisible={scriptingPlayerDropdownIsVisible}
				setDropdownVisibility={setDropdownVisibility}
				subtypesArrayForLastAction={subtypesArrayForLastAction}
				getSubtypeForLastAction={getSubtypeForLastAction}
				sendScriptReducerSessionActionsArrayToServer={
					sendScriptReducerSessionActionsArrayToServer
				}
				lastActionIsFavorite={lastActionIsFavorite()}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	txtTopChildren: {
		color: "white",
		fontSize: 20,
		fontWeight: "bold",
	},
});
