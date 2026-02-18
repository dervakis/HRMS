import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { LoginResponseType } from "../types/AuthType";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        authToken: '',
        isAuthenticated: false,
        role: '',
        isCollapsed: false, 
        fullName: '',
        email: '',
        userId: 0
    },
    reducers: {
        Authenticate : (state, action:PayloadAction<LoginResponseType>) => {
            state.authToken = action.payload.authToken;
            localStorage.setItem('authToken', action.payload.authToken);
            state.role = action.payload.role;
            state.fullName = action.payload.fullName;
            state.email = action.payload.email;
            state.userId = action.payload.userId;
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


