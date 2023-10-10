import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

export interface ParamsType {
  access_token: string,
}

export interface AuthState {
  authState: boolean,
  params: any,
}

const initialState: AuthState = {
  authState: false,
  params: getHashParams()
};

function getHashParams() {
  var hashParams = {};
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState(state, action) {
      state.authState = action.payload;
    },
    setParams(state, action) {
      state.params = action.payload
    },
    logout(state, action) {
      localStorage.removeItem("params");
      state.authState = false
      state.params = false
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const { setAuthState, setParams, logout } = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth.authState;
export const selectParams = (state: AppState) => state.auth.params;

export default authSlice.reducer;
