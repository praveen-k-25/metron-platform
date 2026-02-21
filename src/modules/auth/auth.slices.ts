import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  authenticated: boolean;
  user: {
    role: string;
    profileImage: string;
    username: string;
    id: string;
    vehicles: { id: string; username: string }[];
  };
  theme: string;
}

const initialState: initialState = {
  authenticated: false,
  user: {
    role: "",
    profileImage: "",
    username: "",
    id: "",
    vehicles: [],
  },
  theme: "light",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn: (state, action): void => {
      const data = action.payload.data;
      state.authenticated = true;
      state.user = {
        role: data.role,
        profileImage: data.profileImage,
        username: data.username,
        id: data.id,
        vehicles: data.vehicles,
      };
    },
    setLoggedOut: (state, _action): void => {
      state.authenticated = false;
      state.user = {
        role: "",
        profileImage: "",
        username: "",
        id: "",
        vehicles: [],
      };
    },
    setAuth: (state, action): void => {
      state.authenticated = action.payload;
    },
    setSliceTheme: (state, action): void => {
      state.theme = action.payload;
    },
  },
});

export default authSlice.reducer;
export const { setLoggedIn, setLoggedOut, setAuth, setSliceTheme } =
  authSlice.actions;
