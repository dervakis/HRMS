import React, { type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import type { RootStateType } from '../redux-store/store'
import { Navigate } from 'react-router-dom';

function ProtectedRoute({allowedRoles, children}:({allowedRoles?:string[], children?:ReactNode})) {
    const isAuthenticated = useSelector((state:RootStateType)=>state.user.isAuthenticated);
    const role = useSelector((state:RootStateType) => state.user.role);
    if(!isAuthenticated)
        return <Navigate to='/login'/>
    if(isAuthenticated && allowedRoles && !allowedRoles.includes(role))
        return <Navigate to='/'/>

  return (
    <>{children}</>
  )
}
export default ProtectedRoute