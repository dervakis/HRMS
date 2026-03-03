import { Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { LogOut, MonitorCog, Settings, UserCog } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatchType, RootStateType } from "../redux-store/Store";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Logout } from "../redux-store/UserSlice";

type SidebarLinkProps = {
  to: string;
  icon: any;
  label: string;
  role?: string;
};

const SidebarLink = ({ to, icon: Icon, label, role }: SidebarLinkProps) => {
  const userRole = useSelector((state: RootStateType) => state.user.role);
  const navigate = useNavigate();
  const location = useLocation();
  if (role && role !== userRole) return null;
  return (
    // <NavLink to={to}>
    //   {({ isActive }) => (
    //     <SidebarItem icon={Icon} className={isActive ? "bg-blue-300" : ""}>
    //       {label}
    //     </SidebarItem>
    //   )}
    // </NavLink>
    <SidebarItem
      icon={Icon}
      active={location.pathname === to}
      onClick={() => navigate(to)}
      >
      {label}
    </SidebarItem>
  );
};

const SidebarIcon = (icon: string) => {
  return (
    <span className="text-2xl leading-none">{icon}</span>
  );
}

function Sidebar2() {
  const user = useSelector((state: RootStateType) => state.user);
  const dispatch = useDispatch<AppDispatchType>();

  return (
    <Sidebar collapsed={user.isCollapsed} className={`h-full border-r-2 border-blue-300 fixed lg:static top-0 left-0 z-50 lg:z-0 md:block lg:block ${user.isCollapsed && 'hidden'}`}>
      <SidebarItems>
        <SidebarItemGroup>

          <SidebarLink to="/" icon={() => SidebarIcon('🏠')} label="Home" />
          <SidebarLink to="/documents" icon={() => SidebarIcon('📑')} label="My Documents" />

          <SidebarCollapse icon={() => SidebarIcon('✈️')} label="Travels">
            <SidebarLink to="/manage-travel" icon={() => SidebarIcon('⚙️')} label="Manage Travel" role="HR" />
            <SidebarLink to="/manage-expense" icon={() => SidebarIcon('🏛️')} label="Manage Expense" role="HR" />
            <SidebarLink to="/verify-docuement" icon={() => SidebarIcon('🛡️')} label="Document Verify" role="HR" />
            <SidebarLink to="/travel-document" icon={() => SidebarIcon('🚞')} label="My Travel Trips" />
            <SidebarLink to="/travel-expense" icon={() => SidebarIcon('🪙')} label="My Expenses" />
          </SidebarCollapse>

          <SidebarCollapse icon={() => SidebarIcon('💼')} label="Jobs">
            <SidebarLink to="/manage-job" icon={() => SidebarIcon('⚙️')} label="Manage Job" role="HR" />
            <SidebarLink to="/manage-referral" icon={() => SidebarIcon('🎟️')} label="Job Referrals" role="HR" />
            <SidebarLink to="/open-job" icon={() => SidebarIcon('📧')} label="Open Job" />
            <SidebarLink to="/refferal" icon={() => SidebarIcon('🏷️')} label="My Referrals" />
          </SidebarCollapse>

          <SidebarLink to="/org-chart" icon={() => SidebarIcon('🕸️')} label="My Organization" />

          <SidebarCollapse icon={() => SidebarIcon('🎯')} label="Game">
            <SidebarLink to="/manage-game" icon={() => SidebarIcon('⚙️')} label="Manage Game" role="HR" />
            <SidebarLink to="/book-game" icon={() => SidebarIcon('📆')} label="Book GameSlot" />
            <SidebarLink to="/booking-history" icon={() => SidebarIcon('🗃️')} label="History" />
            <SidebarLink to="/today-booking" icon={() => SidebarIcon('⚔️')} label="Today's Clash" />
          </SidebarCollapse>
          <SidebarLink to="/achievement" icon={() => SidebarIcon('🏆')} label="Achievement" />
          {
            user.role === 'HR' &&
            <SidebarCollapse icon={Settings} label="Configuration">
              <SidebarLink to="/configuration" icon={MonitorCog} label="General" role="HR" />
              <SidebarLink to="/emp-configuration" icon={UserCog} label="User" role="HR" />
            </SidebarCollapse>
          }

        </SidebarItemGroup>
        <SidebarItemGroup className="md:hidden">
          <SidebarLink to="/profile" icon={() => SidebarIcon('👤')} label="User Profile" />
          <SidebarItem className="bg-red-700 text-white font-bold" onClick={() => dispatch(Logout())}>Logout</SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}

export default Sidebar2;