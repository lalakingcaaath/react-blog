import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// These types help TypeScript understand your store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
