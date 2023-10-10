import { configureStore, ThunkAction, Action, combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice";
import { createWrapper } from "next-redux-wrapper";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { config } from "process";

const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
});

const makeConfiguredStore = () => configureStore({
  reducer: rootReducer,
  devTools: true,
});

export const makeStore = () => {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return makeConfiguredStore();
  } else {
    const persistedConfig = {
      key: "nextjs",
      whitelist: ["auth"],
      storage,
    };
    const persistedReducer = persistReducer(persistedConfig, rootReducer);
    let store: any = configureStore({
      reducer: persistedReducer,
      devTools: process.env.NODE_ENV !== "production",
    });
    store.__persistor = persistStore(store);
    return store;
  }
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const wrapper = createWrapper<AppStore>(makeStore);
