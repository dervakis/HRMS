import { Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react';
import { BookmarkCheck, Briefcase, BriefcaseBusiness, Files, FileText, Home, IndianRupee, Landmark, Mail, Plane, Settings, Share2, ShieldCheck, Wallet } from 'lucide-react';
import React from 'react'
import { useSelector } from 'react-redux';
import type { RootStateType } from '../redux-store/store';
import { NavLink } from 'react-router-dom';

function Sidebar2() {
  // const isCollapsed = useSelector((state: RootStateType) => state.user.isCollapsed);
  const user = useSelector((state: RootStateType) => state.user);
  return (
    <Sidebar collapsed={user.isCollapsed} className='h-full border-r-2 border-blue-300' >
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
          <NavLink to='/documents'>
              {
              ({ isActive }: { isActive: boolean }) => (
                <SidebarItem icon={FileText} className={isActive ? 'bg-blue-300' : ''}>
                  My Documents
                </SidebarItem>
              )}
            </NavLink>

          <SidebarCollapse icon={Plane} label="Travel Plane">
            <NavLink hidden={user.role != 'HR'} to='/manage-travel'>
              {
              ({ isActive }: { isActive: boolean }) => (
                <SidebarItem icon={Settings} className={isActive ? 'bg-blue-300' : ''}>
                  Manage Travel
                </SidebarItem>
              )}
            </NavLink>
            <NavLink hidden={user.role != 'HR'} to='/manage-expense'>
              {
              ({ isActive }: { isActive: boolean }) => (
                <SidebarItem icon={Landmark} className={isActive ? 'bg-blue-300' : ''}>
                  Manage Expense
                </SidebarItem>
              )}
            </NavLink>
            <NavLink hidden={user.role != 'HR'} to='/verify-docuement'>
              {
              ({ isActive }: { isActive: boolean }) => (
                <SidebarItem icon={ShieldCheck} className={isActive ? 'bg-blue-300' : ''}>
                  Document Varification
                </SidebarItem>
              )}
            </NavLink>
            <NavLink to='/travel-document'>
              {
              ({ isActive }: { isActive: boolean }) => (
                <SidebarItem icon={Files} className={isActive ? 'bg-blue-300' : ''}>
                  Travel Documents
                </SidebarItem>
              )}
            </NavLink>
            <NavLink to='/travel-expense'>
              {
              ({ isActive }: { isActive: boolean }) => (
                <SidebarItem icon={IndianRupee} className={isActive ? 'bg-blue-300' : ''}>
                  My Expenses
                </SidebarItem>
              )}
            </NavLink>
          </SidebarCollapse>
          <SidebarCollapse icon={BriefcaseBusiness} label="Jobs">
            <NavLink hidden={user.role != 'HR'} to='/manage-job'>
              {
              ({ isActive }: { isActive: boolean }) => (
                <SidebarItem icon={Settings} className={isActive ? 'bg-blue-300' : ''}>
                  Manage Job
                </SidebarItem>
              )}
            </NavLink>
            <NavLink hidden={user.role != 'HR'} to='/manage-referral'>
              {
              ({ isActive }: { isActive: boolean }) => (
                <SidebarItem icon={BookmarkCheck} className={isActive ? 'bg-blue-300' : ''}>
                  Job Refferals
                </SidebarItem>
              )}
            </NavLink>
            <NavLink to='/open-job'>
              {
              ({ isActive }: { isActive: boolean }) => (
                <SidebarItem icon={Briefcase} className={isActive ? 'bg-blue-300' : ''}>
                  Open Job
                </SidebarItem>
              )}
            </NavLink>
            <NavLink to='/refferal'>
              {
              ({ isActive }: { isActive: boolean }) => (
                <SidebarItem icon={Share2} className={isActive ? 'bg-blue-300' : ''}>
                  My Referrals
                </SidebarItem>
              )}
            </NavLink>
          </SidebarCollapse>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}
export default Sidebar2