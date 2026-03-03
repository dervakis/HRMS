import React, { useEffect } from 'react'
import Navbar from './Navbar'
import Sidebar2 from './Sidebar'
import { Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { type AppDispatchType, type RootStateType } from '../redux-store/Store';
import toast from 'react-hot-toast';
import { AddNotification, InitNotification } from '../redux-store/NotificationSlice';
import { useGetNotification } from '../query/EmployeeQuery';
import { toggleSidebar } from '../redux-store/UserSlice';

function MainLayout() {
  const user = useSelector((state: RootStateType) => state.user);
  const dispatch = useDispatch<AppDispatchType>();

  const { data } = useGetNotification();
  useEffect(() => {
    if (data) {
      dispatch(InitNotification(data))
    }
  }, [data]);
  const location = useLocation();
  useEffect(() => {
    if (window.innerWidth < 1024 && !user.isCollapsed) {
      dispatch(toggleSidebar())
    }
  }, [location.pathname])

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(`/topic/${user.userId}`, (obj) => {
          const notification = JSON.parse(obj.body);
          toast(notification.message, { icon: '🔔' })
          dispatch(AddNotification(notification));
        });
      }
    });
    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
  }, [user.userId]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar2 />
        {!user.isCollapsed && (
          <div
            className="fixed inset-0 z-20 bg-black/50 md:hidden lg:hidden"
            onClick={() => dispatch(toggleSidebar())}
          />
        )}
        <main className='flex-1 p-4 lg:p-8 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
export default MainLayout