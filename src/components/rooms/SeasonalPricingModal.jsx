import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useHotel } from '../../context/ReservationContext';
import { Calendar, Percent, Plus, Tag, CheckCircle2, XCircle } from 'lucide-react';
import './SeasonalPricingModal.css';

export const SeasonalPricingModal = ({ isOpen, onClose }) => {
  const { seasonalPricing, addSeasonalPricing, toggleSeasonalPricing } = useHotel();

  const [form, setForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    adjustmentPercent: 20
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.startDate || !form.endDate) return;

    addSeasonalPricing(form);
    setForm({ name: '', startDate: '', endDate: '', adjustmentPercent: 20 });
    setShowAddForm(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Seasonal Pricing Configuration"
      maxWidth="640px"
    >
      <div className="seasonal-modal-container">
        <p className="seasonal-intro-text">
          Configure seasonal room rate adjustments for upcoming peak seasons or holidays.
        </p>

        {/* Existing Rules List */}
        <div className="rules-section">
          <div className="rules-header">
            <h4 className="rules-title">Active Pricing Rules</h4>
            <button
              className="add-rule-toggle-btn"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus size={15} />
              <span>{showAddForm ? 'Hide Form' : 'New Pricing Rule'}</span>
            </button>
          </div>

          <div className="rules-list">
            {seasonalPricing.length === 0 ? (
              <p className="no-rules-text">No active seasonal rules configured.</p>
            ) : (
              seasonalPricing.map((rule) => (
                <div key={rule.id} className={`rule-card ${rule.isActive ? 'active' : 'inactive'}`}>
                  <div className="rule-main">
                    <div className="rule-title-row">
                      <Tag size={16} className="rule-tag-icon" />
                      <span className="rule-name">{rule.name}</span>
                      <span className="adjustment-badge">+{rule.adjustmentPercent}% Rate</span>
                    </div>
                    <div className="rule-dates">
                      <Calendar size={13} />
                      <span>{rule.startDate} to {rule.endDate}</span>
                    </div>
                  </div>

                  <button
                    className={`toggle-status-btn ${rule.isActive ? 'on' : 'off'}`}
                    onClick={() => toggleSeasonalPricing(rule.id)}
                  >
                    {rule.isActive ? (
                      <>
                        <CheckCircle2 size={14} /> Active
                      </>
                    ) : (
                      <>
                        <XCircle size={14} /> Inactive
                      </>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add New Rule Form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="add-rule-form">
            <h4 className="form-sub-title">Configure Seasonal Rule</h4>
            <div className="sp-form-grid-2">
              <div className="sp-field">
                <label className="sp-label">Season Name</label>
                <input
                  type="text"
                  required
                  className="sp-input"
                  placeholder="e.g. Festival Peak"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="sp-field">
                <label className="sp-label">Rate Adjustment (%)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  className="sp-input"
                  placeholder="20"
                  value={form.adjustmentPercent}
                  onChange={(e) => setForm({ ...form, adjustmentPercent: e.target.value })}
                />
              </div>
            </div>

            <div className="sp-form-grid-2">
              <div className="sp-field">
                <label className="sp-label">Start Date</label>
                <input
                  type="date"
                  required
                  className="sp-input"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>

              <div className="sp-field">
                <label className="sp-label">End Date</label>
                <input
                  type="date"
                  required
                  className="sp-input"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="sp-actions">
              <Button variant="secondary" type="button" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Rule
              </Button>
            </div>
          </form>
        )}

        <div className="modal-close-footer">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
