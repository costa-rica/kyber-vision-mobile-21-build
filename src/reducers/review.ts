import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types for review reducer state
export interface VideoSession {
	id: number;
	sessionDate: string;
	city: string;
	createdAt: string;
	updatedAt: string;
	teamId: number;
	teamName: string;
	teamCity: string | null;
	teamCoach: string | null;
}

export interface ContractTeamUser {
	id: number;
	teamId: number;
	userId: number;
}

export interface VideoObject {
	id: number;
	sessionId: number;
	contractTeamUserId: number;
	filename: string;
	url: string;
	videoFileCreatedDateTimeEstimate: string | null;
	videoFileSizeInMb: number;
	pathToVideoFile: string;
	processingCompleted: boolean;
	processingFailed: boolean;
	youTubeVideoId: string;
	originalVideoFilename: string;
	createdAt: string;
	updatedAt: string;
	ContractTeamUser: ContractTeamUser;
	session: VideoSession;
	selected?: boolean;
}

export interface ReviewAction {
	actionsDbTableId: number;
	reviewVideoActionsArrayIndex: number;
	playerId: number;
	timestamp: number;
	type: string;
	subtype: string | null;
	quality: string;
	isDisplayed: boolean;
	isFavorite: boolean;
	isPlaying: boolean;
}

export interface PlayerDbObject {
	id: number;
	firstName: string;
	lastName: string;
	shirtNumber: number;
	birthDate: string;
	isDisplayed: boolean;
}

export interface ReviewState {
	videoObject: VideoObject | null;
	actionsArray: ReviewAction[];
	playerDbObjectsArray: PlayerDbObject[];
}

const initialState: ReviewState = {
	videoObject: null,
	actionsArray: [],
	playerDbObjectsArray: [],
};

export const reviewSlice = createSlice({
	name: "review",
	initialState,
	reducers: {
		updateReviewReducerVideoObject: (
			state,
			action: PayloadAction<VideoObject>
		) => {
			state.videoObject = action.payload;
		},
		createReviewActionsArray: (
			state,
			action: PayloadAction<ReviewAction[]>
		) => {
			state.actionsArray = action.payload;
		},
		createReviewActionsArrayUniquePlayersNamesAndObjects: (
			state,
			action: PayloadAction<{ playerDbObjectsArray: PlayerDbObject[] }>
		) => {
			state.playerDbObjectsArray = action.payload.playerDbObjectsArray;
		},
		clearReviewReducer: (state) => {
			state.videoObject = null;
			state.actionsArray = [];
			state.playerDbObjectsArray = [];
		},
	},
});

export const {
	updateReviewReducerVideoObject,
	createReviewActionsArray,
	createReviewActionsArrayUniquePlayersNamesAndObjects,
	clearReviewReducer,
} = reviewSlice.actions;

export default reviewSlice.reducer;

// // Export types for use in components
// export type { ReviewState };
