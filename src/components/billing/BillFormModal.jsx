import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { Plus, Trash2, Calculator } from 'lucide-react';
import './Billing.css';

export const BillFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  reservations = [],
  rooms = [],
  defaultTaxRate = 18
}) => {
  const [selectedResId, setSelectedResId] = useState('');
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    roomNumber: '',
    roomType: '',
    checkIn: '',
    checkOut: '',
    nights: 1,
    roomRate: 5000,
    discountType: 'fixed',
    discountValue: 0,
    taxRate: defaultTaxRate,
    notes: ''
  });

  const [additionalServices, setAdditionalServices] = useState([]);
  const [errors, setErrors] = useState({});

  const handleReservationSelect = React.useCallback((resId) => {
    setSelectedResId(resId);
    const res = reservations.find((r) => r.id === resId);
    if (res) {
      const checkInDate = new Date(res.checkIn);
      const checkOutDate = new Date(res.checkOut);
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      const calculatedNights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

      const roomObj = rooms.find((r) => r.number === String(res.roomNumber));
      const rate = roomObj ? roomObj.ratePerNight : 5000;

      setFormData((prev) => ({
        ...prev,
        reservationId: res.id,
        guestId: res.guestId || '',
        guestName: res.guestName,
        guestEmail: res.email || '',
        guestPhone: res.phone || '',
        roomNumber: res.roomNumber,
        roomType: res.roomType || (roomObj ? roomObj.type : 'Deluxe'),
        checkIn: res.checkIn,
        checkOut: res.checkOut,
        nights: calculatedNights,
        roomRate: rate
      }));
    }
  }, [reservations, rooms]);

  useEffect(() => {
    if (initialData) {
      setSelectedResId(initialData.reservationId || '');
      setFormData({
        guestName: initialData.guestName || '',
        guestEmail: initialData.guestEmail || '',
        guestPhone: initialData.guestPhone || '',
        roomNumber: initialData.roomNumber || '',
        roomType: initialData.roomType || '',
        checkIn: initialData.checkIn || '',
        checkOut: initialData.checkOut || '',
        nights: initialData.nights || 1,
        roomRate: initialData.roomRate || 5000,
        discountType: initialData.discountType || 'fixed',
        discountValue: initialData.discountValue || 0,
        taxRate: initialData.taxRate !== undefined ? initialData.taxRate : defaultTaxRate,
        notes: initialData.notes || ''
      });
      setAdditionalServices(initialData.additionalServices || []);
    } else {
      setSelectedResId('');
      if (reservations.length > 0) {
        handleReservationSelect(reservations[0].id);
      } else {
        setFormData({
          guestName: '',
          guestEmail: '',
          guestPhone: '',
          roomNumber: '101',
          roomType: 'Deluxe',
          checkIn: new Date().toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          nights: 1,
          roomRate: 5000,
          discountType: 'fixed',
          discountValue: 0,
          taxRate: defaultTaxRate,
          notes: ''
        });
      }
      setAdditionalServices([]);
    }
    setErrors({});
  }, [initialData, isOpen, reservations, defaultTaxRate, handleReservationSelect]);

  // Service item management
  const handleAddService = () => {
    setAdditionalServices((prev) => [
      ...prev,
      { id: `SVC-${Date.now()}`, name: 'Room Service', quantity: 1, unitPrice: 500, total: 500 }
    ]);
  };

  const handleRemoveService = (index) => {
    setAdditionalServices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleServiceChange = (index, field, value) => {
    setAdditionalServices((prev) =>
      prev.map((s, i) => {
        if (i === index) {
          const updated = { ...s, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            const qty = Number(field === 'quantity' ? value : updated.quantity) || 0;
            const price = Number(field === 'unitPrice' ? value : updated.unitPrice) || 0;
            updated.total = qty * price;
          }
          return updated;
        }
        return s;
      })
    );
  };

  // Real-time calculations
  const roomCharges = (Number(formData.nights) || 1) * (Number(formData.roomRate) || 0);
  const additionalTotal = additionalServices.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  const subtotal = roomCharges + additionalTotal;

  let discountAmount = 0;
  if (formData.discountType === 'percent') {
    discountAmount = (subtotal * (Number(formData.discountValue) || 0)) / 100;
  } else {
    discountAmount = Number(formData.discountValue) || 0;
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((taxableAmount * (Number(formData.taxRate) || 0)) / 100);
  const grandTotal = taxableAmount + taxAmount;

  const reservationOptions = reservations.map((res) => ({
    value: res.id,
    label: `${res.id} - ${res.guestName} (Room ${res.roomNumber})`
  }));

  const servicePresetOptions = [
    { value: 'Room Service', label: 'Room Service' },
    { value: 'Laundry', label: 'Laundry' },
    { value: 'Food & Beverage', label: 'Food & Beverage' },
    { value: 'Extra Bed', label: 'Extra Bed' },
    { value: 'Airport Transfer', label: 'Airport Transfer' },
    { value: 'Mini Bar', label: 'Mini Bar' },
    { value: 'Other', label: 'Other' }
  ];

  const validate = () => {
    const errs = {};
    if (!selectedResId && !formData.guestName) errs.reservation = 'Reservation selection is required';
    if (!formData.roomNumber) errs.roomNumber = 'Room number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      reservationId: selectedResId || formData.reservationId || 'RES-1001',
      additionalServices,
      subtotal,
      discount: discountAmount,
      taxableAmount,
      taxAmount,
      totalAmount: grandTotal,
      paidAmount: initialData ? initialData.paidAmount : 0
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Guest Bill' : 'Create Guest Bill & Invoice'}
      maxWidth="720px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
            Select Reservation <span className="required-star">*</span>
          </label>
          <Select
            value={selectedResId}
            onChange={(e) => handleReservationSelect(e.target.value)}
            options={reservationOptions}
            placeholder="Choose reservation..."
          />
          {errors.reservation && <div className="form-field-error">{errors.reservation}</div>}
        </div>

        {/* Auto Populated Guest & Stay Details */}
        <div className="grid-3" style={{ background: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-sm)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Guest Name</span>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formData.guestName || 'N/A'}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Room</span>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
              Room {formData.roomNumber} ({formData.roomType})
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Stay Duration</span>
            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
              {formData.checkIn} to {formData.checkOut} ({formData.nights} nights)
            </div>
          </div>
        </div>

        {/* Room Charges Row */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '0.875rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--primary-navy)' }}>
            Room Charge Breakdown
          </div>
          <div className="grid-3">
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Rate per Night (₹)</label>
              <Input
                type="number"
                value={formData.roomRate}
                onChange={(e) => setFormData({ ...formData, roomRate: Number(e.target.value) })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Number of Nights</label>
              <Input
                type="number"
                value={formData.nights}
                onChange={(e) => setFormData({ ...formData, nights: Number(e.target.value) })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Room Charge</label>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-gold-dark)', marginTop: '0.4rem' }}>
                ₹{roomCharges.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-navy)' }}>
              Additional Services & Amenities
            </span>
            <Button variant="outline" size="sm" icon={Plus} type="button" onClick={handleAddService}>
              Add Service
            </Button>
          </div>

          {additionalServices.length === 0 ? (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '0.5rem' }}>
              No additional services added yet. Click "+ Add Service" to add room service, laundry, etc.
            </div>
          ) : (
            <table className="service-items-table">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Service Name</th>
                  <th style={{ width: '20%' }}>Qty</th>
                  <th style={{ width: '25%' }}>Price (₹)</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Total</th>
                  <th style={{ width: '10%' }}></th>
                </tr>
              </thead>
              <tbody>
                {additionalServices.map((svc, idx) => (
                  <tr key={svc.id || idx}>
                    <td>
                      <Select
                        value={svc.name}
                        onChange={(e) => handleServiceChange(idx, 'name', e.target.value)}
                        options={servicePresetOptions}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={svc.quantity}
                        onChange={(e) => handleServiceChange(idx, 'quantity', e.target.value)}
                        min={1}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={svc.unitPrice}
                        onChange={(e) => handleServiceChange(idx, 'unitPrice', e.target.value)}
                      />
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      ₹{(Number(svc.total) || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(idx)}
                        style={{ color: 'var(--status-danger-text)', padding: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Discount & Configurable Tax */}
        <div className="grid-2">
          <div style={{ background: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>
              Discount Settings
            </span>
            <div className="grid-2">
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Type</label>
                <Select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  options={[
                    { value: 'fixed', label: 'Fixed (₹)' },
                    { value: 'percent', label: 'Percentage (%)' }
                  ]}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Value</label>
                <Input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>
              Tax Configuration
            </span>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Configured Tax Rate (%)</label>
              <Input
                type="number"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Real-time Calculation Summary Box */}
        <div className="calc-summary-box">
          <div className="calc-row">
            <span>Room Charges ({formData.nights} nights × ₹{formData.roomRate}):</span>
            <span>₹{roomCharges.toLocaleString('en-IN')}</span>
          </div>
          <div className="calc-row">
            <span>Additional Services Total:</span>
            <span>₹{additionalTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="calc-row" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            <span>Subtotal:</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="calc-row" style={{ color: 'var(--status-danger-text)' }}>
            <span>Discount ({formData.discountType === 'percent' ? `${formData.discountValue}%` : 'Fixed'}):</span>
            <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="calc-row">
            <span>Taxable Amount:</span>
            <span>₹{taxableAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="calc-row">
            <span>Tax ({formData.taxRate}% GST):</span>
            <span>+₹{taxAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="calc-row total">
            <span>Grand Total:</span>
            <span style={{ color: 'var(--accent-gold-dark)' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
            Billing Notes / Remarks
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add payment notes or special invoice details..."
            rows={2}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '0.875rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" icon={Calculator}>
            {initialData ? 'Save Changes' : 'Create Bill'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
