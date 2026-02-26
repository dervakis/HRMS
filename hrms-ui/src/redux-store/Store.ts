import {configureStore} from '@reduxjs/toolkit'
import userReducer from './UserSlice'
import notificationReducer from './NotificationSlice'

export const Store = configureStore({
    reducer: {
        user: userReducer,
        notification: notificationReducer
    },
})

export type RootStateType = ReturnType<typeof Store.getState>
export type AppDispatchType = typeof Store.dispatch