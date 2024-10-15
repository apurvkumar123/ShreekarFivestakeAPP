import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'userDetails',
  initialState: {},
  reducers: {
    setUserData: (state, action) => {
      state.UserData = action.payload;
    },
  },
});

export const {setUserData} = userSlice.actions;

export default userSlice.reducer;
