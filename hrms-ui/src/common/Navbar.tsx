import type { RootState } from '@reduxjs/toolkit/query';
import { Avatar, Button, Navbar as NavbarComponent } from 'flowbite-react'
import { LogOut, Menu } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatchType, RootStateType } from '../redux-store/store';
import { Logout, toggleSidebar } from '../redux-store/UserSlice';

function Navbar() {
  const dispatch = useDispatch<AppDispatchType>();
  const user = useSelector((state:RootStateType)=>state.user);
  return (
    <NavbarComponent fluid rounded className='bg-white shadow-md border-b-2 border-blue-500'>
      <div className='flex items-center gap-3'>
      <Button color='blue'><Menu className='size-5' onClick={() => dispatch(toggleSidebar())}/></Button>
      <span className='self-center whitespace-nowrap text-xl font-semibold'>HRMS</span>
      </div>
      <div className='flex items-center gap-4'>
        <span className='text-sm font-medium text-gray-700'>{user.fullName}</span>
        <Avatar rounded size='md' />
        {/* image link img = ''kari ne add */}
        <Button color='red' size='md' onClick={()=> dispatch(Logout())}><LogOut/></Button>
      </div>
    </NavbarComponent>
  )
}

export default Navbar