import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Dispatch } from "react";
// import { createDuck, FSA } from "redux-duck";
// import { AnyAction } from "redux";

// export interface PersistState {
//   readonly saved?: string;
//   readonly notificationsStatus?: string;
//   readonly pushToken?: string;
// }

interface Log {
  ts: number;
  message: string;
}

const initialState: {
  saved: string;
  notificationsStatus: string;
  pushToken: string;
  lastReadActivityTimestamp: number;
  numberOfUnreadActivities: number;
  log: Array<Log>;
} = {
  saved: 'initial',
  notificationsStatus: 'granted',
  pushToken: '',
  lastReadActivityTimestamp: 0,
  numberOfUnreadActivities: 0,
  log: [],
};

export const persistSlice = createSlice({
  name: 'persist',
  initialState,
  reducers: {
    setPushToken: (state, action: PayloadAction<string>) => {
      state.pushToken = action.payload;
    },
    setNotificationsStatus: (state, action: PayloadAction<string>) => {
      state.notificationsStatus = action.payload;
    },
    setLastReadActivityTimestamp: (state, action: PayloadAction<number>) => {
      state.lastReadActivityTimestamp = action.payload;
    },
    setNumberOfUnreadActivities: (state, action: PayloadAction<number>) => {
      state.numberOfUnreadActivities = action.payload;
    },
    appendLog: (state, action: PayloadAction<string>) => {
      if (!state.log) state.log = [];
      state.log.push({ ts: new Date().valueOf(), message: action.payload });
    },
    clearLog: (state, action: PayloadAction<string>) => {
      state.log = [];
    },
  },
});

// Selectors
export const getPushToken = (state: any) => state.persist.pushToken;
export const getNotificationsStatus = (state: any) => state.persist.pushToken;
export const getLastReadActivityTimestamp = (state: any) =>
  state.persist.lastReadActivityTimestamp;
export const getNumberOfUnreadActivities = (state: any) =>
  state.persist.numberOfUnreadActivities;
export const getPersistLog = (state: any) => state.persist.log;
// each case under reducers becomes an action
export const {
  setPushToken,
  setNotificationsStatus,
  setLastReadActivityTimestamp,
  setNumberOfUnreadActivities,
  appendLog,
  clearLog,
} = persistSlice.actions;

export default persistSlice.reducer;
