import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './common/Navbar'
import Sidebar from './common/Sidebar'
import MainLayout from './common/MainLayout'
import ResetPassword from './pages/travel/ResetPassword'
import ProtectedRoute from './common/ProtectedRoute'
import ManageTravel from './pages/travel/ManageTravel'
import ManageExpense from './pages/travel/ManageExpense'
import EmployeeDocument from './pages/travel/EmployeeDocument'
import TravelDocument from './pages/travel/TravelDocument'
import EmployeeTravelExpense from './pages/travel/EmployeeTravelExpense'
import DocumentVarification from './pages/travel/DocumentVarification'
import ManageGames from './pages/game/ManageGames'
import ManageJob from './pages/job/ManageJob'
import OpenJob from './pages/job/OpenJob'
import Refferal from './pages/job/Refferal'
import ManageJobReferral from './pages/job/ManageJobReferral'
import OrganizationChart from './pages/general/OrganizationChart'
import GameBooking from './pages/game/GameBooking'
import BookingHistory from './pages/game/BookingHistory'
import TodayBooking from './pages/game/TodayBooking'
import EmployeeConfiguration from './pages/general/EmployeeConfiguration'
import Login from './pages/general/Login'
import Profile from './pages/general/Profile'
import Feed from './pages/achievement/Feed'
import Home from './pages/general/Home'
import Configuration from './pages/general/Configuration'
// import GameBooking from './pages/game/GameBooking'

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
          element: <ProtectedRoute><Home/></ProtectedRoute>
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
        },
        {
          path: '/booking-history',
          element: <ProtectedRoute><BookingHistory/></ProtectedRoute>
        },
        {
          path: '/today-booking',
          element: <ProtectedRoute><TodayBooking/></ProtectedRoute>
        },
        {
          path: '/emp-configuration',
          element: <ProtectedRoute><EmployeeConfiguration/></ProtectedRoute>
        },
        {
          path: 'configuration',
          element: <ProtectedRoute><Configuration/></ProtectedRoute>
        },
        {
          path: '/profile',
          element: <ProtectedRoute><Profile/></ProtectedRoute>
        },
        {
          path: '/achievement',
          element: <ProtectedRoute><Feed/></ProtectedRoute>
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
