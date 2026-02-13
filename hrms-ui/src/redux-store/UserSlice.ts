import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { useNavigate } from "react-router-dom";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        authToken: '',
        isAuthenticated: false,
        role: ''
    },
    reducers: {
        Authenticate : (state, action:PayloadAction<string>) => {
            state.authToken = action.payload;
            state.isAuthenticated = true;
        },
        Logout: (state) => {
            state.authToken = '';
            state.isAuthenticated = false;

        }
    }
});

export const {Authenticate, Logout} = userSlice.actions;
export default userSlice.reducer;


