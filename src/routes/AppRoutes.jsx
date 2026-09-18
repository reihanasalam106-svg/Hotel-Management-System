import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Login } from '../pages/Login/Login';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { Reservations } from '../pages/Reservations/Reservations';
import { Rooms } from '../pages/Rooms/Rooms';
import { Guests } from '../pages/Guests/Guests';
import { Housekeeping } from '../pages/Housekeeping/Housekeeping';
import { Billing } from '../pages/Billing/Billing';
import { Reports } from '../pages/Reports/Reports';
import { Staff } from '../pages/Staff/Staff';
import { Settings } from '../pages/Settings/Settings';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Main App Navigation Routes wrapped in MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/guests" element={<Guests />} />
        <Route path="/housekeeping" element={<Housekeeping />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch-all fallback redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
