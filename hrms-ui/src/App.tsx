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
import ManageGames from './pages/game/ManageGames'

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
      // element: <MainLayout/>,
      element: <ProtectedRoute><MainLayout/></ProtectedRoute>,
      children: [
        {path:'/',
          element: <>Main Body</>
        },
        {
          path: '/manage-travel',
          element: <ProtectedRoute allowedRoles={['hr']}><ManageTravel/></ProtectedRoute>
        },
        {
          path: '/manage-expense',
          element: <ProtectedRoute allowedRoles={['hr']}><ManageExpense/></ProtectedRoute>
        },
        {path: '/verify-docuement',
          element: <ProtectedRoute allowedRoles={['hr']}><DocumentVarification/></ProtectedRoute>
        },
        {
          path: '/documents',
          element: <ProtectedRoute><EmployeeDocument/></ProtectedRoute>
        },
        {path: '/travel-document',
          element: <ProtectedRoute><TravelDocument/></ProtectedRoute>
        },
        {path: '/travel-expense',
          element: <ProtectedRoute><EmployeeTravelExpense/></ProtectedRoute>
        },
        // {path: '/game',
        //   element: <ManageGames/>
        // }

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
