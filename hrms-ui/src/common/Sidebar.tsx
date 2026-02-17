import { Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react';
import { FileText, Home, Mail, Plane, Settings, Wallet } from 'lucide-react';
import React from 'react'
import { useSelector } from 'react-redux';
import type { RootStateType } from '../redux-store/store';
import { NavLink } from 'react-router-dom';

function Sidebar2() {
  const isCollapsed = useSelector((state: RootStateType) => state.user.isCollapsed);
  return (
    <Sidebar collapsed={isCollapsed} className='h-full border-r-2 border-blue-300' >
      <SidebarItems>
        <SidebarItemGroup>
          <NavLink to='/' className={({ isActive }: { isActive: boolean }) => isActive ? 'bg-blue-600' : ''}>
            {
              ({ isActive }: { isActive: boolean }) => (
                <SidebarItem icon={Home} className={isActive ? 'bg-blue-300' : ''}>
                  Home
                </SidebarItem>
              )}
          </NavLink>

          <SidebarCollapse icon={Plane} label="Travel Plane">
            <NavLink to='/travel'>
              {
              ({ isActive }: { isActive: boolean }) => (
                <SidebarItem icon={Settings} className={isActive ? 'bg-blue-300' : ''}>
                  Manage Travel
                </SidebarItem>
              )}
            </NavLink>
            <NavLink to='/expense'>
              {
              ({ isActive }: { isActive: boolean }) => (
                <SidebarItem icon={Wallet} className={isActive ? 'bg-blue-300' : ''}>
                  Manage Expense
                </SidebarItem>
              )}
            </NavLink>
            <NavLink to='/documents'>
              {
              ({ isActive }: { isActive: boolean }) => (
                <SidebarItem icon={FileText} className={isActive ? 'bg-blue-300' : ''}>
                  Documents
                </SidebarItem>
              )}
            </NavLink>
            {/* <SidebarItem>Option 1</SidebarItem>
            <SidebarItem href="#">2</SidebarItem>
            <SidebarItem href="#">3</SidebarItem>
            <SidebarItem href="#">4</SidebarItem> */}
          </SidebarCollapse>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}
export default Sidebar2