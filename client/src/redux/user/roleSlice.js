// redux/role/roleSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdmin: false,
  isAuthor: false,
  role: "user", // "user", "author", "admin"
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload.role;
      state.isAdmin = action.payload.role === "admin";
      state.isAuthor = action.payload.role === "author";
    },
    clearRole: (state) => {
      state.role = "user";
      state.isAdmin = false;
      state.isAuthor = false;
    },
  },
});

export const { setRole, clearRole } = roleSlice.actions;
export default roleSlice.reducer;
