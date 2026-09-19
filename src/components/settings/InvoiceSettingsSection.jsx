import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Save, FileText } from 'lucide-react';

export const InvoiceSettingsSection = ({ invoiceData = {}, onSave }) => {
  const [formData, setFormData] = useState({
    invoicePrefix: 'INV-',
    startingNumber: 1001,
    showLogo: true,
    showGuestAddress: true,
    showPaymentDetails: true,
    showTaxBreakdown: true,
    footerMessage: 'Thank you for staying at HotelPro Grand. Have a safe journey!'
  });

  useEffect(() => {
    if (invoiceData && Object.keys(invoiceData).length > 0) {
      setFormData((prev) => ({ ...prev, ...invoiceData }));
    }
  }, [invoiceData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card title="Invoice Formatting & Print Layout" subtitle="Configure guest invoice headers, display elements, and terms footer">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="invoicePrefix">Invoice Code Prefix</label>
            <input
              type="text"
              id="invoicePrefix"
              name="invoicePrefix"
              className="form-control"
              value={formData.invoicePrefix}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="startingNumber">Starting Sequence Number</label>
            <input
              type="number"
              id="startingNumber"
              name="startingNumber"
              className="form-control"
              value={formData.startingNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Display Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', uppercase: true }}>Invoice Elements Visibility</strong>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', cursor: 'pointer' }}>
            <span>Show Hotel Logo on Header</span>
            <input type="checkbox" name="showLogo" checked={formData.showLogo} onChange={handleChange} style={{ width: 16, height: 16, accentColor: 'var(--accent-gold)' }} />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', cursor: 'pointer' }}>
            <span>Show Guest Address & Contact</span>
            <input type="checkbox" name="showGuestAddress" checked={formData.showGuestAddress} onChange={handleChange} style={{ width: 16, height: 16, accentColor: 'var(--accent-gold)' }} />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', cursor: 'pointer' }}>
            <span>Show Payment Transactions & Method</span>
            <input type="checkbox" name="showPaymentDetails" checked={formData.showPaymentDetails} onChange={handleChange} style={{ width: 16, height: 16, accentColor: 'var(--accent-gold)' }} />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', cursor: 'pointer' }}>
            <span>Show Itemized Tax Breakdown</span>
            <input type="checkbox" name="showTaxBreakdown" checked={formData.showTaxBreakdown} onChange={handleChange} style={{ width: 16, height: 16, accentColor: 'var(--accent-gold)' }} />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="footerMessage">Invoice Footer Terms & Greeting</label>
          <textarea
            id="footerMessage"
            name="footerMessage"
            rows="2"
            className="form-control"
            value={formData.footerMessage}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <Button type="submit" variant="primary" icon={Save}>
            Save Invoice Settings
          </Button>
        </div>
      </form>
    </Card>
  );
};
