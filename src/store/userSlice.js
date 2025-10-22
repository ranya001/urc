import { createSlice } from '@reduxjs/toolkit';

const initialState = { token: null, username: null };

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.token = action.payload.token;
            state.username = action.payload.username;
        },
        clearUser: (state) => {
            state.token = null;
            state.username = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
