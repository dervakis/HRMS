import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { NotificationType } from "../types/CommonType";

interface NotificationState {
    items: NotificationType[],
    count: number
}

const initial: NotificationState = {
    items: [],
    count: 0
}

const NotificationSlic = createSlice({
    name: 'notification',
    initialState: initial,
    reducers: {
        InitNotification: (state, action: PayloadAction<NotificationType[]>) => {
            if (action.payload && action.payload.length > 0) {
                state.items = action.payload
                state.count = action.payload.length
            }
        },
        AddNotification: (state, action: PayloadAction<NotificationType>) => {
            state.items.unshift(action.payload);
            state.count = state.count + 1;
        },
        MarkAsRead: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((obj) => obj.notificationId !== action.payload);
            state.count = state.count - 1;
        }
    }
})

export const { InitNotification, AddNotification, MarkAsRead } = NotificationSlic.actions;
export default NotificationSlic.reducer;