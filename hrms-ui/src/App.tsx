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
import ManageJob from './pages/job/ManageJob'
import OpenJob from './pages/job/OpenJob'
import Refferal from './pages/job/Refferal'
import ManageJobReferral from './pages/job/ManageJobReferral'
import OrganizationChart from './pages/general/OrganizationChart'
import GameBooking from './pages/game/GameBooking'

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
        {
          path: '/manage-job',
          element: <ProtectedRoute allowedRoles={['hr']}><ManageJob/></ProtectedRoute>
        },
        {
          path: '/open-job',
          element: <ProtectedRoute><OpenJob/></ProtectedRoute>
        },
        {
          path: '/refferal',
          element: <ProtectedRoute><Refferal/></ProtectedRoute>
        },
        {
          path: '/manage-referral',
          element: <ProtectedRoute allowedRoles={['hr']}><ManageJobReferral/></ProtectedRoute>
        },
        {
          path: '/org-chart',
          element: <ProtectedRoute><OrganizationChart/></ProtectedRoute>
        },
        {
          path: '/manage-game',
          element: <ProtectedRoute allowedRoles={['hr']}><ManageGames/></ProtectedRoute>
        },
        {
          path: '/book-game',
          element: <ProtectedRoute><GameBooking/></ProtectedRoute>
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
