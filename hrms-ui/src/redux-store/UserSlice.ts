import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: 'user',
    initialState: {
        authToken: '',
        isAuthenticated: false,
        role: '',
        isCollapsed: false
    },
    reducers: {
        Authenticate : (state, action:PayloadAction<string>) => {
            state.authToken = action.payload;
            state.isAuthenticated = true;
        },
        Logout: (state) => {
            state.authToken = '';
            state.isAuthenticated = false;
        },
        toggleSidebar: (state) => {
            state.isCollapsed = !state.isCollapsed;
        }
    }
});

export const {Authenticate, Logout, toggleSidebar} = userSlice.actions;
export default userSlice.reducer;


