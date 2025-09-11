import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  syncReducerSelectedVideoObject: null,
  syncReducerSelectedSessionObject: null,
  syncReducerScriptsArray: [],
};

export const syncSlice = createSlice({
  name: "sync",
  initialState,
  reducers: {
    updateSyncReducerSelectedVideoObject: (state, action) => {
      state.syncReducerSelectedVideoObject = action.payload;
    },
    updateSyncReducerSelectedSessionObject: (state, action) => {
      state.syncReducerSelectedSessionObject = action.payload;
    },
    updateSyncReducerScriptsArray: (state, action) => {
      state.syncReducerScriptsArray = action.payload;
    },
  },
});

export const {
  updateSyncReducerSelectedVideoObject,
  updateSyncReducerSelectedSessionObject,
  updateSyncReducerScriptsArray,
} = syncSlice.actions;

export default syncSlice.reducer;
