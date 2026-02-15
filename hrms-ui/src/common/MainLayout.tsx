import React from 'react'
import Navbar from './Navbar'
import Sidebar2 from './Sidebar'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div className="h-screen flex flex-col">
        <Navbar/>
        <div className='flex flex-1'>
            <Sidebar2/>
            <main className='flex-1 p-8'>
                <Outlet/>
            </main>
        </div>
    </div>
  )
}

export default MainLayout