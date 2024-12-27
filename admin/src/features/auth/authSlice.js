import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { userInfo, accessToken } = action.payload;
      state.userInfo = userInfo;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
    },
    clearCredentials: () => initialState, 
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;