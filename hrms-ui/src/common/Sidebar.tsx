import { Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react';
import { Home, Mail } from 'lucide-react';
import React from 'react'
import { useSelector } from 'react-redux';
import type { RootStateType } from '../redux-store/store';

function Sidebar2() {
  const isCollapsed = useSelector((state:RootStateType) => state.user.isCollapsed);
  return (
    <Sidebar collapsed={isCollapsed} className='h-full border-r-2 border-blue-300' >
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="#" icon={Home}>
            Home
          </SidebarItem>
          <SidebarCollapse icon={Mail} label="Drop down">
            <SidebarItem href="#">Option 1</SidebarItem>
            <SidebarItem href="#">2</SidebarItem>
            <SidebarItem href="#">3</SidebarItem>
            <SidebarItem href="#">4</SidebarItem>
          </SidebarCollapse>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}
export default Sidebar2