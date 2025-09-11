import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: {
    username: null,
    email: null,
  },
  contractTeamUserArray: [],
  portraitHeight: null,
  portraitWidth: null,
  // circleRadiusOuter: 70,
  // circleRadiusMiddle: 50,
  // circleRadiusInner: 20,
  circleRadiusOuter: 0,
  circleRadiusMiddle: 0,
  circleRadiusInner: 0,
  scriptPositionGuides: false,
  defaultWheelColors: {
    1: "rgba(230, 144, 64, 1)", // right
    2: "rgba(147, 191, 81, 1)", // bottom
    3: "rgba(60, 126, 181, 1)", // left
    4: "rgba(178, 61, 149, 1)", // top
    5: "gray", // rightMiddle
    6: "black", // rightBottom
    7: "white", // bottomRight
    8: "gray", // bottomMiddle
    9: "black", // bottomLeft
    10: "black", // leftBottom
    11: "gray", // leftMiddle
    12: "white", // leftTop
    13: "black", // topleft
    14: "gray", // topMiddle
    15: "white", // topRight
    16: "white", // rightTop
    center: "white",
  },
  selectedWheelColors: {
    1: "#BD9AC1", // right
    // 2: "brown", // right
    2: "#BD9AC1", // bottom
    3: "#BD9AC1", // left
    4: "#BD9AC1", // top
    5: "#BD9AC1",
    6: "#BD9AC1",
    7: "#BD9AC1",
    8: "#BD9AC1",
    9: "#BD9AC1",
    10: "#BD9AC1",
    11: "#BD9AC1",
    12: "#BD9AC1",
    13: "#BD9AC1",
    14: "#BD9AC1",
    15: "#BD9AC1",
    16: "#BD9AC1",
    center: "#BD9AC1",
  },
  swipePadTextStyleMiddleCircle: Object.fromEntries(
    Array.from({ length: 4 }, (_, i) => [
      i + 1, // Key: 1 to 16`
      {
        color: "black",
        fontSize: 20,
        fontWeight: "bold",
      },
    ])
  ),
  swipePadTextStyleOuterCircle: Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [
      i + 1, // Key: 1 to 12`
      {
        color: "black",
        fontSize: 14,
        // fontWeight: "bold",
      },
    ])
  ),
  swipePadTextStyleOuterCircle: {
    1: { color: "black", fontSize: 14, fontWeight: "bold" }, // rightMiddle
    2: { color: "white", fontSize: 16, fontWeight: "bold" }, // rightBottom
    3: { color: "black", fontSize: 14, fontWeight: "bold" }, // bottomRight
    4: { color: "black", fontSize: 14, fontWeight: "bold" }, // bottomMiddle
    5: { color: "white", fontSize: 16, fontWeight: "bold" }, // bottomLeft
    6: { color: "white", fontSize: 16, fontWeight: "bold" }, // leftBottom
    7: { color: "black", fontSize: 14, fontWeight: "bold" }, // leftMiddle
    8: { color: "black", fontSize: 14, fontWeight: "bold" }, // leftTop
    9: { color: "white", fontSize: 16, fontWeight: "bold" }, // topleft
    10: { color: "black", fontSize: 14, fontWeight: "bold" }, // topMiddle
    11: { color: "black", fontSize: 14, fontWeight: "bold" }, // topRight
    12: { color: "black", fontSize: 14, fontWeight: "bold" }, // rightTop
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.token = action.payload.token;
      state.user.username = action.payload.username;
      state.user.email = action.payload.email;
      state.contractTeamUserArray = action.payload.contractTeamUserArray;
    },

    reducerSetScreenDimensions: (state, action) => {
      console.log(`- dans Redux: reducerSetScreenDimensions 🔔`);
      state.portraitHeight = action.payload.portraitHeight;
      state.portraitWidth = action.payload.portraitWidth;
    },
    reducerSetUserSwipePadWheel: (state, action) => {
      state.circleRadiusOuter = action.payload.circleRadiusOuter;
      state.circleRadiusMiddle = action.payload.circleRadiusMiddle;
      state.circleRadiusInner = action.payload.circleRadiusInner;
    },
    switchPositionGuides: (state) => {
      console.log("switchPositionGuides");
      state.scriptPositionGuides = !state.scriptPositionGuides;
    },
    logoutUser: (state) => {
      state.token = null;
      state.user.username = null;
      state.user.email = null;
      state.contractTeamUserArray = [];
    },
    updateContractTeamUserArray: (state, action) => {
      state.contractTeamUserArray = action.payload;
    },
  },
});

export const {
  loginUser,
  reducerSetScreenDimensions,
  reducerSetUserSwipePadWheel,
  switchPositionGuides,
  logoutUser,
  updateContractTeamUserArray,
} = userSlice.actions;
export default userSlice.reducer;
