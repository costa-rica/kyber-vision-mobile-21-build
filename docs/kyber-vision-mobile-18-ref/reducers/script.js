import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scriptId: null,
  sessionsArray: [],
  sessionActionsArray: [], // former actionsArray
  sessionPointsTableArray: [], // former pointsTableArray
  playersArray: [],
  scriptingPlayerCount: null,
  scriptingForPlayerObject: null, // <-- player object (id, firstName, lastName, shirtNumber)
  scriptingTeamObject: null, // <-- team object (id, name)
  // /// - testing
  // objToModify: null,
  // testPayloadTime: null,
  // testPayloadQuailty: null,
  // newObj: null,
  // --- These are meant to be hardcoded and available throughout the app --- NO MODIFY in code
  typesArray: ["Bl", "Def", "Set", "Att", "Serve", "Reception"],
  subtypesByType: {
    Serve: [
      "Default (Power serve)",
      "Float (or jump float)",
      "Spin (or jump spin)",
      "Hybrid",
    ],
    Bl: ["1 player", "2 players (default)", "3 players"],
    Def: ["Dig (default)", "Attack cover", "Tip cover", "Freeball"],
    Reception: ["Default (Pass)", "Overhead", "Dive"], // keep if needed elsewhere
    Set: [
      "Second tempo (default)",
      "First tempo",
      "High ball",
      "Negative tempo",
    ],
    Att: [
      "Power (default)",
      "Fake (or Tip or Deep shot)",
      "Block Out attempt",
      "Block Touch attempt",
      "First hand (or pushed)",
      "Over the net fight",
      "Freeball",
      "Block recycle",
      "Roll shot",
      "Off Speed",
    ],
  },
  qualityArrayOuterCircle: [
    "0",
    "-",
    "+",
    "0",
    "-",
    "-",
    "0",
    "+",
    "-",
    "0",
    "+",
    "+",
    "tap",
  ],
  qualityArray: ["=", "-", "0", "+", "#"],
  rotationArray: ["P1", "P2", "P3", "P4", "P5", "P6"],
  positionalAreasArray: Array.from({ length: 6 }, (_, i) => i + 1),
  // playerNamesArray: ["Léa", "Odeyssa", "Yoann", "Johanne", "Ted", "Sarah"],
  // playerNamesArrayRotated: [], // Initialized empty, will be set in reducer
  playerObjectPositionalArray: [],
  pointsArray: Array.from({ length: 50 }, (_, i) => i),
  setOptionsArray: Array.from({ length: 4 }, (_, i) => i),
  // scriptLivePortraitVwVolleyballCourtCoords: {
  coordsScriptLivePortraitContainerMiddle: {
    x: null,
    y: null,
    width: null,
    height: null,
  },
  coordsScriptLivePortraitVwPlayerSuperSpacer: {
    x: null,
    y: null,
    width: null,
    height: null,
  },
  coordsScriptLiveLandscapeContainerLeft: {
    x: null,
    y: null,
    width: null,
    height: null,
  },
  coordsScriptLiveLandscapeContainerMiddleTop: {
    x: null,
    y: null,
    width: null,
    height: null,
  },
  coordsScriptLiveLandscapeContainerMiddleBottom: {
    x: null,
    y: null,
    width: null,
    height: null,
  },
  coordsScriptLiveLandscapeVwPlayerSuper: {
    x: null,
    y: null,
    width: null,
    height: null,
  },
  coordsScriptLiveLandscapeVwBelowSvgVolleyballCourt: {
    x: null,
    y: null,
    width: null,
    height: null,
  },
};
// *** Important Type Inforamtion ***

// actionsArray element properties
// dateScripted: new Date().toISOString(), // Convert to ISO string
// timeStamp: player.currentTime,
// type: actionObj.type,
// subType: "tap - sub",
// quality: "some quality",
// playerId: "Player 1",
// scriptId: scriptReducer.scriptId,
// newAction: true,
// pointId: "set" - "scoreTeamAnalyzed + scoreTeamOpponent"

// pointsTableArray element properties
// pointId: "set" - "scoreTeamAnalyzed + scoreTeamOpponent"
// setNumber: 1,
// scoreTeamAnalyzed: 0,
// scoreTeamOpponent: 0,
// rotation: p1
// opponentServed: false
// favorite: false

// *** (END) Important Type Inforamtion ***

export const scriptSlice = createSlice({
  name: "script",
  initialState,
  reducers: {
    // newScript: (state, action) => {
    //   console.log("start newScript (in script reduer)");
    //   state.scriptId = action.payload.scriptId;
    //   state.tokenWithUserId = action.payload.userId;
    //   console.log("END newScript (in script reduer)");
    // },
    // deleteScript: (state) => {
    // emptySessionActionsArray: (state) => {
    //   // state.scriptId = null;
    //   // state.tokenWithUserId = null;
    //   state.sessionActionsArray = [];
    // },
    updateScriptSessionActionsArray: (state, action) => {
      console.log("--> updateScriptSessionActionsArray");

      // state.sessionActionsArray = action.payload.sessionActionsArray;
      state.sessionActionsArray = action.payload;
    },
    updateScriptingPlayerCount: (state, action) => {
      state.scriptingPlayerCount = action.payload;
    },

    updateQualityPropertyInObjectOfSessionActionsArray: (state, action) => {
      const { timestamp, quality } = action.payload;

      // Find the index of the object to update
      const index = state.sessionActionsArray.findIndex(
        (obj) => obj.timestamp === timestamp
      );
      if (index !== -1) {
        // Create a new object with the updated quality
        const updatedObject = { ...state.sessionActionsArray[index], quality };

        // Create a new array with the updated object
        const updatedArray = [
          ...state.sessionActionsArray.slice(0, index), // gets all objects from 0 to index
          updatedObject,
          ...state.sessionActionsArray.slice(index + 1), // gets all object from index+1 to end
        ];

        // Sort the array by timeStamp
        state.sessionActionsArray = updatedArray.sort(
          (a, b) => a.timestamp - b.timestamp
        );
      }
    },
    updateTypePropertyInObjectOfSessionActionsArray: (state, action) => {
      const { timestamp, type } = action.payload;

      // Find the index of the object to update
      const index = state.sessionActionsArray.findIndex(
        (obj) => obj.timestamp === timestamp
      );
      if (index !== -1) {
        // Create a new object with the updated quality
        const updatedObject = { ...state.sessionActionsArray[index], type };

        // Create a new array with the updated object
        const updatedArray = [
          ...state.sessionActionsArray.slice(0, index), // gets all objects from 0 to index
          updatedObject,
          ...state.sessionActionsArray.slice(index + 1), // gets all object from index+1 to end
        ];

        // Sort the array by timeStamp
        state.sessionActionsArray = updatedArray.sort(
          (a, b) => a.timestamp - b.timestamp
        );
      }
    },
    updateSubtypePropertyInObjectOfSessionActionsArray: (state, action) => {
      const { timestamp, subtype } = action.payload;

      // Find the index of the object to update
      const index = state.sessionActionsArray.findIndex(
        (obj) => obj.timestamp === timestamp
      );
      if (index !== -1) {
        // Create a new object with the updated quality
        const updatedObject = { ...state.sessionActionsArray[index], subtype };

        // Create a new array with the updated object
        const updatedArray = [
          ...state.sessionActionsArray.slice(0, index), // gets all objects from 0 to index
          updatedObject,
          ...state.sessionActionsArray.slice(index + 1), // gets all object from index+1 to end
        ];

        // Sort the array by timeStamp
        state.sessionActionsArray = updatedArray.sort(
          (a, b) => a.timestamp - b.timestamp
        );
      }
    },
    updateSessionPointsTableArray: (state, action) => {
      state.sessionPointsTableArray = action.payload.sessionPointsTableArray;
    },
    // rotatePlayerNamesArray: (state) => {
    //   if (state.playerNamesArrayRotated.length === 0) {
    //     // Initialize if not already set
    //     state.playerNamesArrayRotated = [...state.playerNamesArray];
    //   }
    //   if (state.playerNamesArrayRotated.length > 1) {
    //     // Rotate array elements to the left
    //     state.playerNamesArrayRotated = [
    //       ...state.playerNamesArrayRotated.slice(1),
    //       state.playerNamesArrayRotated[0],
    //     ];
    //   }
    // },
    // initializePlayerNamesArrayRotated: (state) => {
    //   console.log("--- >  initializePlayerNamesArrayRotated");
    //   // This action can be dispatched at app startup to ensure correct initialization
    //   state.playerNamesArrayRotated = [...state.playerNamesArray];
    // },
    setScriptingForPlayerObject: (state, action) => {
      state.scriptingForPlayerObject = action.payload;
    },
    setScriptingTeamObject: (state, action) => {
      state.scriptingTeamObject = action.payload;
    },

    // NEW for Version 15
    // updateScriptLivePortraitVwVolleyballCourtCoords: (state, action) => {
    updateCoordsScriptLivePortraitContainerMiddle: (state, action) => {
      state.coordsScriptLivePortraitContainerMiddle = action.payload;
    },
    updatePlayersArray: (state, action) => {
      state.playersArray = action.payload;
    },
    updateSessionsArray: (state, action) => {
      state.sessionsArray = action.payload;
    },

    // NEW for Version 18
    updateCoordsScriptLiveLandscapeContainerLeft: (state, action) => {
      state.coordsScriptLiveLandscapeContainerLeft = action.payload;
    },
    updateCoordsScriptLiveLandscapeContainerMiddleTop: (state, action) => {
      state.coordsScriptLiveLandscapeContainerMiddleTop = action.payload;
    },
    updateCoordsScriptLiveLandscapeContainerMiddleBottom: (state, action) => {
      state.coordsScriptLiveLandscapeContainerMiddleBottom = action.payload;
    },
    updateCoordsScriptLivePortraitVwPlayerSuperSpacer: (state, action) => {
      state.coordsScriptLivePortraitVwPlayerSuperSpacer = action.payload;
    },
    updateCoordsScriptLiveLandscapeVwPlayerSuper: (state, action) => {
      state.coordsScriptLiveLandscapeVwPlayerSuper = action.payload;
    },
    updateCoordsScriptLiveLandscapeVwBelowSvgVolleyballCourt: (
      state,
      action
    ) => {
      state.coordsScriptLiveLandscapeVwBelowSvgVolleyballCourt = action.payload;
    },
    createPlayerArrayPositionProperties: (state) => {
      // console.log("📢 createPlayerArrayPositionProperties");
      state.playersArray.forEach((player, index) => {
        player.positionArea = index < 6 ? index + 1 : null;
      });
      state.playerObjectPositionalArray = state.playersArray.filter(
        (player) => player.positionArea !== null
      );
    },
  },
});

export const {
  // newScript,
  // deleteScript,
  // emptySessionActionsArray,
  updateScriptSessionActionsArray,
  updateScriptingPlayerCount,
  updateQualityPropertyInObjectOfSessionActionsArray,
  updateTypePropertyInObjectOfSessionActionsArray,
  updateSubtypePropertyInObjectOfSessionActionsArray,
  updateSessionPointsTableArray,
  // rotatePlayerNamesArray,
  // initializePlayerNamesArrayRotated,
  setScriptingForPlayerObject,
  setScriptingTeamObject,

  // NEW for Version 15
  updateCoordsScriptLivePortraitContainerMiddle,
  updatePlayersArray,
  // updateScriptId,
  updateSessionsArray,

  // NEW for Version 18
  updateCoordsScriptLiveLandscapeContainerLeft,
  updateCoordsScriptLiveLandscapeContainerMiddleTop,
  updateCoordsScriptLiveLandscapeContainerMiddleBottom,
  updateCoordsScriptLivePortraitVwPlayerSuperSpacer,
  updateCoordsScriptLiveLandscapeVwPlayerSuper,
  updateCoordsScriptLiveLandscapeVwBelowSvgVolleyballCourt,
  createPlayerArrayPositionProperties,
} = scriptSlice.actions;
export default scriptSlice.reducer;
