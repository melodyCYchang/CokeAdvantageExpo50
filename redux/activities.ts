import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Dispatch } from "react";
// import { createDuck, FSA } from "redux-duck";
// import { AnyAction } from "redux";

export const activitiesSlice = createSlice({
  name: 'activities',
  initialState: {
    activities: [],
  },
  reducers: {
    setActivities: (state, action: PayloadAction<any>) => {
      state.activities = action.payload;
    },
  },
});

// Selectors
export const getActivities = (state: any) => state.activities.activities;

// each case under reducers becomes an action
export const { setActivities } = activitiesSlice.actions;

export default activitiesSlice.reducer;
