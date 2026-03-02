import { Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { BookmarkCheck, Briefcase, BriefcaseBusiness, CalendarCheck, Files, FileText, Gamepad2, History, Home, IndianRupee, Landmark, MonitorCog, Network, Plane, Settings, Share2, ShieldCheck, Swords, Trophy, UserCog } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import type { RootStateType } from "../redux-store/store";
import { NavLink } from "react-router-dom";

type SidebarLinkProps = {
  to: string;
  icon: any;
  label: string;
  role?: string;
};

const SidebarLink = ({ to, icon: Icon, label, role }: SidebarLinkProps) => {
  const userRole = useSelector((state: RootStateType) => state.user.role);
  if (role && role !== userRole) return null;
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <SidebarItem icon={Icon} className={isActive ? "bg-blue-300" : ""}>
          {label}
        </SidebarItem>
      )}
    </NavLink>
  );
};

function Sidebar2() {
  const user = useSelector((state: RootStateType) => state.user);
  return (
    <Sidebar collapsed={user.isCollapsed} className="h-full border-r-2 border-blue-300">
      <SidebarItems>
        <SidebarItemGroup>

          <SidebarLink to="/" icon={Home} label="Home" />
          <SidebarLink to="/documents" icon={FileText} label="My Documents" />

          <SidebarCollapse icon={Plane} label="Travels">
            <SidebarLink to="/manage-travel" icon={Settings} label="Manage Travel" role="HR" />
            <SidebarLink to="/manage-expense" icon={Landmark} label="Manage Expense" role="HR" />
            <SidebarLink to="/verify-docuement" icon={ShieldCheck} label="Document Verification" role="HR" />
            <SidebarLink to="/travel-document" icon={Files} label="My Travel Trips" />
            <SidebarLink to="/travel-expense" icon={IndianRupee} label="My Expenses" />
          </SidebarCollapse>

          <SidebarCollapse icon={BriefcaseBusiness} label="Jobs">
            <SidebarLink to="/manage-job" icon={Settings} label="Manage Job" role="HR" />
            <SidebarLink to="/manage-referral" icon={BookmarkCheck} label="Job Referrals" role="HR" />
            <SidebarLink to="/open-job" icon={Briefcase} label="Open Job" />
            <SidebarLink to="/refferal" icon={Share2} label="My Referrals" />
          </SidebarCollapse>

          <SidebarLink to="/org-chart" icon={Network} label="My Organization" />

          <SidebarCollapse icon={Gamepad2} label="Game">
            <SidebarLink to="/manage-game" icon={Settings} label="Manage Game" role="HR" />
            <SidebarLink to="/book-game" icon={CalendarCheck} label="Book GameSlot" />
            <SidebarLink to="/booking-history" icon={History} label="History" />
            <SidebarLink to="/today-booking" icon={Swords} label="Today's Clash" />
          </SidebarCollapse>
          <SidebarLink to="/achievement" icon={Trophy} label="Achievement" />
          {
            user.role === 'HR' &&
            <SidebarCollapse icon={Settings} label="Configuration">
              <SidebarLink to="/configuration" icon={MonitorCog} label="General" role="HR" />
              <SidebarLink to="/emp-configuration" icon={UserCog} label="User" role="HR" />
            </SidebarCollapse>
          }
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}

export default Sidebar2;