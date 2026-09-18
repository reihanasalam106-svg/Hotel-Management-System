import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { Settings as SettingsIcon, Save, Building, Percent, Globe, Bell } from 'lucide-react';

export const Settings = () => {
  const [hotelName, setHotelName] = useState('HotelPro Luxury Resort & Suites');
  const [currency, setCurrency] = useState('INR');
  const [gstTax, setGstTax] = useState('18%');
  const [toastMsg, setToastMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setToastMsg('HotelPro system configuration saved successfully!');
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="module-page">
      <PageHeader
        title="System Settings"
        description="Configure hotel profile, default currency, tax rules, and system parameters"
      />

      {toastMsg && (
        <div style={{ marginBottom: '1.25rem' }}>
          <Toast message={toastMsg} type="success" onClose={() => setToastMsg('')} />
        </div>
      )}

      <form onSubmit={handleSave} className="grid-2">
        <Card title="Hotel Profile & Identity" subtitle="General property information">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Input
              label="Property Name"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              icon={Building}
              required
            />
            <Input
              label="Official Contact Email"
              defaultValue="contact@hotelpro-resorts.com"
              type="email"
              required
            />
            <Input
              label="Phone Line"
              defaultValue="+91 11 4988 2000"
              required
            />
            <Input
              label="Physical Address"
              defaultValue="74 Luxury Palm Avenue, Marine Drive, Mumbai"
            />
          </div>
        </Card>

        <Card title="Financial & Tax Configuration" subtitle="Default currency and tax rates">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Select
              label="Base Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { label: 'INR (₹) - Indian Rupee', value: 'INR' },
                { label: 'USD ($) - US Dollar', value: 'USD' },
                { label: 'EUR (€) - Euro', value: 'EUR' }
              ]}
            />
            <Input
              label="GST Tax Rate (%)"
              value={gstTax}
              onChange={(e) => setGstTax(e.target.value)}
              icon={Percent}
            />
            <Select
              label="Timezone"
              defaultValue="Asia/Kolkata"
              options={[
                { label: '(UTC+05:30) India Standard Time (IST)', value: 'Asia/Kolkata' },
                { label: '(UTC+00:00) UTC', value: 'UTC' }
              ]}
            />
            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="primary" icon={Save}>
                Save System Settings
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};
