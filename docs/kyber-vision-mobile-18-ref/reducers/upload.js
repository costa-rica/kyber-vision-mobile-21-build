import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uploadReducerSelectedVideoObject: null,
  uploadReducerLoading: false,
  uploadReducerDeleteVideoObject: null,
  uploadReducerModalUploadVideoSelectedSessionObject: null,
};

export const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    updateUploadReducerSelectedVideoObject: (state, action) => {
      state.uploadReducerSelectedVideoObject = action.payload;
    },
    updateUploadReducerLoading: (state, action) => {
      state.uploadReducerLoading = action.payload;
    },
    updateUploadReducerDeleteVideoObject: (state, action) => {
      state.uploadReducerDeleteVideoObject = action.payload;
    },
    updateUploadReducerModalUploadVideoSelectedSessionObject: (
      state,
      action
    ) => {
      state.uploadReducerModalUploadVideoSelectedSessionObject = action.payload;
    },
  },
});

export const {
  updateUploadReducerSelectedVideoObject,
  updateUploadReducerLoading,
  updateUploadReducerDeleteVideoObject,
  updateUploadReducerModalUploadVideoSelectedSessionObject,
} = uploadSlice.actions;

export default uploadSlice.reducer;
