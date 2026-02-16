import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './common/Navbar'
import Sidebar from './common/Sidebar'
import MainLayout from './common/MainLayout'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import ProtectedRoute from './common/ProtectedRoute'
import ManageTravel from './pages/ManageTravel'

function App() {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login/>
    },
    {
      path: '/reset-password',
      element: <ResetPassword/>
    },
    {
      path:'/',
      element: <MainLayout/>,
      // element: <ProtectedRoute><MainLayout/></ProtectedRoute>
      children: [
        {path:'/',
          element: <>Main Body</>
        },
        {
          path: '/travel',
          element: <ManageTravel/>
        }
      ]
    },
    {
      path: '*',
      element: <>Sorry No Page Found.</>
    }

  ])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
