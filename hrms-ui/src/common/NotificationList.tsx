import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatchType, RootStateType } from '../redux-store/Store';
import { MarkAsRead } from '../redux-store/NotificationSlice';
import { useMarkNotificationAsRead } from '../query/EmployeeQuery';
import { Card } from 'flowbite-react';

interface propType {
    visible: boolean
}

function NotificationList({ visible }: propType) {
    const dispatch = useDispatch<AppDispatchType>();
    const notifications = useSelector((state: RootStateType) => state.notification);
    const markAsReadMutation = useMarkNotificationAsRead();
    const handleMarkRead = (id: number) => {
        dispatch(MarkAsRead(id));
        markAsReadMutation.mutate(id);
    };
    if (!visible) return null;
    const getIcon = (status: string) => {
        switch (status) {
            case "TravelDocument":
                return '🪪';
            case "TravelPlan":
                return '✈️';
            case "TravelExpense":
                return '💰';
            case "GameBook":
                return '🎯';
            case "Warning":
                return '⚠️';
        }
    };

    return (
        <Card className="absolute right-5 top-20 w-80 z-50 max-h-64 overflow-y-auto hide-scrollbar">
            {notifications.items.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No notifications</div>
            ) : (
                notifications.items.map((n) => (
                        <div className='p-2 shadow-md rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100' key={n.notificationId} onClick={() => handleMarkRead(n.notificationId)} >
                            {n.message}
                            <div className='flex'>
                                <p className='text-left'>{getIcon(n.notificationType)}</p>
                                <p className='ml-auto text-sm font-light'>{new Date(n.createdAt).toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>

                        </div>
                    ))
            )}
        </Card>
    )
}

export default NotificationList


