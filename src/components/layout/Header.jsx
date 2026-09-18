import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Menu, Calendar as CalendarIcon, User, Search, CheckCircle2 } from 'lucide-react';
import './Header.css';

export const Header = ({ onToggleMobileSidebar }) => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  // Helper to resolve route titles and subheaders
  const getRouteInfo = (pathname) => {
    switch (pathname) {
      case '/dashboard':
        return {
          title: 'Welcome back, Admin 👋',
          description: 'Manage your hotel operations efficiently'
        };
      case '/reservations':
        return {
          title: 'Reservations Management',
          description: 'View, filter, and create guest room reservations'
        };
      case '/rooms':
        return {
          title: 'Rooms & Inventory',
          description: 'Monitor room status, categories, and availability'
        };
      case '/guests':
        return {
          title: 'Guest Directory',
          description: 'Manage guest profiles, stay histories, and preferences'
        };
      case '/housekeeping':
        return {
          title: 'Housekeeping Operations',
          description: 'Assign tasks, track cleaning schedules, and maintenance'
        };
      case '/billing':
        return {
          title: 'Billing & Invoicing',
          description: 'Process guest folios, invoices, and payments'
        };
      case '/reports':
        return {
          title: 'Analytics & Reports',
          description: 'Track occupancy, revenue metrics, and operational performance'
        };
      case '/staff':
        return {
          title: 'Staff Management',
          description: 'Manage hotel staff schedules, departments, and roles'
        };
      case '/settings':
        return {
          title: 'System Settings',
          description: 'Configure hotel parameters, taxes, and system preferences'
        };
      default:
        return {
          title: 'HotelPro Console',
          description: 'Hospitality Management Engine'
        };
    }
  };

  const routeInfo = getRouteInfo(location.pathname);

  // Format today's date
  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="mobile-hamburger-btn"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <div className="header-page-heading">
          <h2 className="header-title">{routeInfo.title}</h2>
          <p className="header-description">{routeInfo.description}</p>
        </div>
      </div>

      <div className="header-right">
        {/* Date Display */}
        <div className="header-date-badge">
          <CalendarIcon size={16} className="date-icon" />
          <span>{todayDateStr}</span>
        </div>

        {/* Notifications Container */}
        <div className="header-notification-wrapper">
          <button
            className="header-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="notification-dot" />
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-title">Notifications</span>
                <span className="dropdown-count">3 New</span>
              </div>
              <div className="dropdown-list">
                <div className="dropdown-item">
                  <CheckCircle2 size={16} className="text-success" />
                  <div className="item-content">
                    <p className="item-text">Aarav Sharma checked into Room 101</p>
                    <span className="item-time">10 mins ago</span>
                  </div>
                </div>
                <div className="dropdown-item">
                  <div className="dot-warning" />
                  <div className="item-content">
                    <p className="item-text">Room 303 marked for Maintenance</p>
                    <span className="item-time">45 mins ago</span>
                  </div>
                </div>
                <div className="dropdown-item">
                  <div className="dot-info" />
                  <div className="item-content">
                    <p className="item-text">New reservation from Booking.com</p>
                    <span className="item-time">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <div className="header-user-profile">
          <div className="avatar-wrapper">
            <div className="user-avatar">
              <User size={18} />
            </div>
            <span className="status-online-dot" title="Online" />
          </div>
          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="user-role">Hotel Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
};
