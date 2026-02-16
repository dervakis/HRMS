import React from 'react'
import Navbar from './Navbar'
import Sidebar2 from './Sidebar'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
        <Navbar/>
        <div className='flex flex-1 overflow-hidden'>
            <Sidebar2/>
            <main className='flex-1 p-8 overflow-y-auto'>
                <Outlet/>
            </main>
        </div>
    </div>
  )
}

export default MainLayout