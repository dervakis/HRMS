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
import ManageExpense from './pages/ManageExpense'
import EmployeeDocument from './pages/EmployeeDocument'
import TravelDocument from './pages/TravelDocument'
import EmployeeTravelExpense from './pages/EmployeeTravelExpense'
import DocumentVarification from './pages/DocumentVarification'

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
        },
        {
          path: '/expense',
          element: <ManageExpense/>
        },
        {
          path: '/document',
          element: <EmployeeDocument/>
        },
        {path: '/travel-document',
          element: <TravelDocument/>
        },
        {path: 'travel-expense',
          element: <EmployeeTravelExpense/>
        },
        {path: '/document-verify',
          element: <DocumentVarification/>
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
