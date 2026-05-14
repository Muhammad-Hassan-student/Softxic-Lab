import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null, // { id, email, username, role, isAdmin, ... }
  error: null,
  loading: false, // 🔥 false hona chahiye, null nahi
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload; // ✅ payload mein role bhi hoga
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    // 🔥 NEW: Role update ke liye
    updateUserRole: (state, action) => {
      if (state.currentUser) {
        state.currentUser.role = action.payload.role;
        state.currentUser.isAdmin = action.payload.role === "admin";
      }
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateInStart,
  updateInSuccess,
  updateInFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutSuccess,
  updateUserRole, // 🔥 Export karo
} = userSlice.actions;

export default userSlice.reducer;
