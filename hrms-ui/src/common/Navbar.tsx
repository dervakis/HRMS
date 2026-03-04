import { Avatar, Button, Label, Navbar as NavbarComponent } from 'flowbite-react'
import { Bell, LogOut, Menu } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Logout, toggleSidebar } from '../redux-store/UserSlice';
import type { AppDispatchType, RootStateType } from '../redux-store/Store';
import { useNavigate } from 'react-router-dom';
import NotificationList from './NotificationList';

function Navbar() {
  const dispatch = useDispatch<AppDispatchType>();
  const user = useSelector((state: RootStateType) => state.user);
  const notification = useSelector((state: RootStateType) => state.notification);
  const [showComment, setShowComment] = useState(false);
  const navigate = useNavigate();

  return (
    <NavbarComponent fluid rounded className='bg-white shadow-md border-b-2 border-blue-500'>
      <div className='flex justify-center items-center gap-3'>
        <Button color='blue' size='sm' onClick={() => dispatch(toggleSidebar())}><Menu className='size-5' /></Button>
        <span className='self-center whitespace-nowrap text-xl font-semibold'>HRMS</span>
      </div>
      <div className='flex items-center gap-4'>
        <span className='text-sm font-medium text-gray-700'>{user.fullName.toUpperCase()} ({user.role})</span>
        <Avatar className='hidden md:block' rounded size='md' onClick={() => navigate('/profile')} />
        <div className="relative">
          <Label className='text-xl' onClick={() => setShowComment((prev) => !prev)}>🔔<span className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
            {notification.count}
          </span></Label>
        </div>
        <Button className='hidden md:block' color='red' size='sm' onClick={() => dispatch(Logout())}><LogOut /></Button>
      </div>
      <NotificationList visible={showComment} />
    </NavbarComponent>
  )
}

export default Navbar