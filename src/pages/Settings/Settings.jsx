import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { LoadingState } from '../../components/common/LoadingState';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { useReservations } from '../../context/ReservationContext';
import { useAuth } from '../../context/AuthContext';

import { SettingsSidebar } from '../../components/settings/SettingsSidebar';
import { HotelProfileSection } from '../../components/settings/HotelProfileSection';
import { GeneralSettingsSection } from '../../components/settings/GeneralSettingsSection';
import { BillingTaxSection } from '../../components/settings/BillingTaxSection';
import { InvoiceSettingsSection } from '../../components/settings/InvoiceSettingsSection';
import { RoomTypesSection } from '../../components/settings/RoomTypesSection';
import { NotificationsSection } from '../../components/settings/NotificationsSection';
import { AppearanceSection } from '../../components/settings/AppearanceSection';

export const Settings = () => {
  const { hasRole } = useAuth();
  const isAuthorized = hasRole('Admin', 'Manager');

  const {
    settings,
    roomTypes,
    rooms,
    updateHotelProfile,
    updateGeneralSettings,
    updateBillingSettings,
    updateInvoiceSettings,
    updateNotificationSettings,
    updateAppearanceSettings,
    addRoomType,
    updateRoomType,
    toggleRoomTypeStatus,
    isLoading,
    error,
    refreshAllData
  } = useReservations();

  const [activeTab, setActiveTab] = useState('hotel-profile');

  if (!isAuthorized) {
    return (
      <div className="module-page" style={{ padding: '3rem', textAlign: 'center' }}>
        <ShieldAlert size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Access Denied</h2>
        <p style={{ color: '#94a3b8' }}>Only Administrators and Managers have permission to view or modify system settings.</p>
      </div>
    );
  }

  if (isLoading && !settings?.hotelProfile?.hotelName) {
    return (
      <div className="module-page">
        <LoadingState label="Loading hotel settings from database..." />
      </div>
    );
  }

  if (error && !settings?.hotelProfile?.hotelName) {
    return (
      <div className="module-page" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
        <button onClick={refreshAllData} className="btn-primary" style={{ margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={16} />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  return (
    <div className="module-page">
      <PageHeader
        title="Settings"
        description="Manage hotel profile, billing preferences and system settings."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }} className="settings-main-layout">
        {/* Left Sidebar Navigation */}
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Right Active Settings Section Panel */}
        <div className="settings-content-panel">
          {activeTab === 'hotel-profile' && (
            <HotelProfileSection
              profileData={settings?.hotelProfile}
              onSave={updateHotelProfile}
            />
          )}

          {activeTab === 'general' && (
            <GeneralSettingsSection
              generalData={settings?.general}
              onSave={updateGeneralSettings}
            />
          )}

          {activeTab === 'billing-tax' && (
            <BillingTaxSection
              billingData={settings?.billing}
              onSave={updateBillingSettings}
            />
          )}

          {activeTab === 'invoice' && (
            <InvoiceSettingsSection
              invoiceData={settings?.invoice}
              onSave={updateInvoiceSettings}
            />
          )}

          {activeTab === 'room-types' && (
            <RoomTypesSection
              roomTypes={roomTypes}
              rooms={rooms}
              onAddRoomType={addRoomType}
              onUpdateRoomType={updateRoomType}
              onToggleStatus={toggleRoomTypeStatus}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsSection
              notificationData={settings?.notifications}
              onSave={updateNotificationSettings}
            />
          )}

          {activeTab === 'appearance' && (
            <AppearanceSection
              appearanceData={settings?.appearance}
              onSave={updateAppearanceSettings}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
