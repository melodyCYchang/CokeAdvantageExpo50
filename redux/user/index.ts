import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StrapiUser } from "../../types/StrapiUser";

// eslint-disable-next-line import/no-cycle
import { RootState } from "../store";

export interface UserState {
  user: StrapiUser | null;
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<StrapiUser | null>) => {
      state.user = action.payload;
    },
    setStrapiID: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.strapiID = action.payload;
      }
    },
    resetUser: (state) => {
      state.user = null;
    },
  },
});

// Selectors
export const getUser = (state: RootState) => state.user.user;

// each case under reducers becomes an action
export const { setUser, resetUser, setStrapiID } = userSlice.actions;

export default userSlice.reducer;
