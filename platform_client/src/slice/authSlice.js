import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  token: '',
  creation_time: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.creation_time  = action.payload.creation_time;
    },
    clearCredentials: (state) => {
      state.username = '';
      state.token = '';
      state.creation_time = '';
    },
    getCredentials: (state,action)=>{
      return {
        username: state.username,
        token: state.token,
        creation_time: state.creation_time,
      }
    }
  }
});

export const { setCredentials, clearCredentials, getCredentials } = authSlice.actions;
export default authSlice.reducer;