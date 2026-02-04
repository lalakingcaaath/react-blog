import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserProfiles } from "../types/userProfiles";

const initialState: UserProfiles = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfiles>) => {
      state.id = action.payload.id;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
    },
    logout: (state) => {
      state.id = "";
      state.firstName = "";
      state.lastName = "";
      state.email = "";
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
