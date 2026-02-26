import { Avatar, Button, Label, Navbar as NavbarComponent } from 'flowbite-react'
import { Bell, LogOut, Menu } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Logout, toggleSidebar } from '../redux-store/UserSlice';
import { useNavigate } from 'react-router-dom';
import type { AppDispatchType, RootStateType } from '../redux-store/store';
import NotificationList from './NotificationList';

function Navbar() {
  const dispatch = useDispatch<AppDispatchType>();
  const user = useSelector((state: RootStateType) => state.user);
  const notification = useSelector((state: RootStateType) => state.notification);
  const [showComment, setShowComment] = useState(false);
  const navigate = useNavigate();

  return (
    <NavbarComponent fluid rounded className='bg-white shadow-md border-b-2 border-blue-500'>
      <div className='flex items-center gap-3'>
        <Button color='blue'><Menu className='size-5' onClick={() => dispatch(toggleSidebar())} /></Button>
        <span className='self-center whitespace-nowrap text-xl font-semibold'>HRMS</span>
      </div>
      <div className='flex items-center gap-4'>
        <div className="relative">
          <Label className='text-xl' onClick={()=>setShowComment((prev)=>!prev)}>🔔<span className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
              {notification.count}
            </span></Label>
        </div>
        <span className='text-sm font-medium text-gray-700'>{user.fullName.toUpperCase()} ({user.role.toLowerCase()})</span>
        <Avatar rounded size='md' onClick={() => navigate('/profile')} />
        <Button color='red' size='md' onClick={() => dispatch(Logout())}><LogOut /></Button>
      </div>
      <NotificationList visible={showComment} />
    </NavbarComponent>
  )
}

export default Navbar