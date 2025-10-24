import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [],
    selectedUser: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
    },
});

export const { setUsers, setSelectedUser } = chatSlice.actions;
export default chatSlice.reducer;
