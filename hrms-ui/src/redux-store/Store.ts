import {configureStore} from '@reduxjs/toolkit'
import userReducer from './UserSlice'

export const Store = configureStore({
    reducer: {
        user: userReducer
    },
})

export type RootStateType = ReturnType<typeof Store.getState>
export type AppDispatchType = typeof Store.dispatch