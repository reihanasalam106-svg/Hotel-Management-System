import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Save, Percent } from 'lucide-react';

export const BillingTaxSection = ({ billingData = {}, onSave }) => {
  const [formData, setFormData] = useState({
    taxEnabled: true,
    taxRate: 18,
    taxName: 'GST',
    serviceChargeEnabled: true,
    serviceChargeRate: 5,
    invoicePrefix: 'INV-'
  });

  useEffect(() => {
    if (billingData && Object.keys(billingData).length > 0) {
      setFormData((prev) => ({ ...prev, ...billingData }));
    }
  }, [billingData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      taxRate: Number(formData.taxRate) || 18,
      serviceChargeRate: Number(formData.serviceChargeRate) || 0
    });
  };

  return (
    <Card title="Billing, Tax & Financial Rules" subtitle="Configure applicable property taxes (GST/VAT), service charges, and invoice prefix rules">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
        {/* Tax Toggle */}
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Enable Tax Calculation</strong>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Automatically apply tax rates to room folios and invoices</span>
          </div>
          <label className="switch-toggle" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="taxEnabled"
              checked={formData.taxEnabled}
              onChange={handleChange}
              style={{ width: 18, height: 18, accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
            />
          </label>
        </div>

        <div className="form-grid-3">
          <div className="form-group">
            <label htmlFor="taxName">Tax Name / Label</label>
            <input
              type="text"
              id="taxName"
              name="taxName"
              className="form-control"
              placeholder="e.g. GST"
              value={formData.taxName}
              onChange={handleChange}
              disabled={!formData.taxEnabled}
            />
          </div>

          <div className="form-group">
            <label htmlFor="taxRate">Configurable Tax Rate (%) *</label>
            <input
              type="number"
              id="taxRate"
              name="taxRate"
              min="0"
              max="50"
              step="0.5"
              className="form-control"
              value={formData.taxRate}
              onChange={handleChange}
              disabled={!formData.taxEnabled}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="invoicePrefix">Default Invoice Prefix</label>
            <input
              type="text"
              id="invoicePrefix"
              name="invoicePrefix"
              className="form-control"
              placeholder="e.g. INV-"
              value={formData.invoicePrefix}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Service Charge Toggle */}
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Enable Service Charge</strong>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Add optional hospitality service charge to final guest bills</span>
          </div>
          <input
            type="checkbox"
            name="serviceChargeEnabled"
            checked={formData.serviceChargeEnabled}
            onChange={handleChange}
            style={{ width: 18, height: 18, accentColor: 'var(--accent-gold)', cursor: 'pointer' }}
          />
        </div>

        {formData.serviceChargeEnabled && (
          <div className="form-group" style={{ maxWidth: '300px' }}>
            <label htmlFor="serviceChargeRate">Service Charge Rate (%)</label>
            <input
              type="number"
              id="serviceChargeRate"
              name="serviceChargeRate"
              min="0"
              max="25"
              step="0.5"
              className="form-control"
              value={formData.serviceChargeRate}
              onChange={handleChange}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <Button type="submit" variant="primary" icon={Save}>
            Save Billing Settings
          </Button>
        </div>
      </form>
    </Card>
  );
};
