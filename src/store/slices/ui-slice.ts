import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { UiNotificationResponse } from "../../types";

interface UiState {
  notification: null | UiNotificationResponse;
}

const initialState: UiState = {
  notification: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialState,
  reducers: {
    showNotification(state, action: PayloadAction<UiNotificationResponse>) {
      state.notification = action.payload;
    },
    resetNotification(state) {
      state.notification = null;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
