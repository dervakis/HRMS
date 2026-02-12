import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div className="min-h-screen">
        <Navbar/>
        <div className='flex'>
            <Sidebar/>
            <main className='flex-1 p-8'>
                <Outlet/>
            </main>
        </div>
    </div>
  )
}

export default MainLayout