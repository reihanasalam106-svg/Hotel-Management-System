import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  DoorOpen,
  Users,
  Sparkles,
  Receipt,
  BarChart3,
  UserCheck,
  Settings,
  LogOut,
  Crown,
  User,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();

  const allNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Receptionist', 'Housekeeping', 'Staff'] },
    { name: 'Reservations', path: '/reservations', icon: Calendar, roles: ['Admin', 'Manager', 'Receptionist'] },
    { name: 'Rooms', path: '/rooms', icon: DoorOpen, roles: ['Admin', 'Manager', 'Receptionist', 'Housekeeping', 'Staff'] },
    { name: 'Guests', path: '/guests', icon: Users, roles: ['Admin', 'Manager', 'Receptionist', 'Staff'] },
    { name: 'Housekeeping', path: '/housekeeping', icon: Sparkles, roles: ['Admin', 'Manager', 'Receptionist', 'Housekeeping'] },
    { name: 'Billing', path: '/billing', icon: Receipt, roles: ['Admin', 'Manager', 'Receptionist'] },
    { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['Admin', 'Manager'] },
    { name: 'Staff', path: '/staff', icon: UserCheck, roles: ['Admin', 'Manager'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['Admin', 'Manager'] }
  ];

  const visibleNavItems = allNavItems.filter(item => hasRole(...item.roles));

  const handleLogout = async (e) => {
    e.preventDefault();
    if (onCloseMobile) onCloseMobile();
    await logout();
    navigate('/login');
  };

  const displayName = user?.full_name || user?.username || 'User';
  const displayRole = user?.role || 'Staff';

  return (
    <>
      {/* Backdrop for mobile view */}
      {isMobileOpen && (
        <div className="sidebar-backdrop" onClick={onCloseMobile} aria-hidden="true" />
      )}

      <aside className={`sidebar-aside ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-logo-icon">
              <Crown size={22} className="crown-icon" />
            </div>
            <div className="brand-titles">
              <span className="brand-main">HOTEL MANAGEMENT</span>
              <span className="brand-sub">HotelPro Engine</span>
            </div>
          </div>
          {isMobileOpen && (
            <button className="mobile-close-btn" onClick={onCloseMobile} aria-label="Close menu">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="sidebar-content">
          <div className="nav-section-label">MAIN MENU</div>
          <nav className="sidebar-nav">
            {visibleNavItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                  }}
                >
                  <IconComponent className="nav-icon" size={19} />
                  <span className="nav-text">{item.name}</span>
                  {isActive && <div className="active-indicator" />}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Profile & Logout */}
        <div className="sidebar-footer">
          <div className="sidebar-user-profile">
            <div className="user-avatar-sm">
              <User size={16} />
            </div>
            <div className="user-details">
              <span className="user-name-text">{displayName}</span>
              <span className="user-role-text">{displayRole}</span>
            </div>
          </div>
          <button className="nav-link logout-link" onClick={handleLogout}>
            <LogOut className="nav-icon" size={19} />
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
