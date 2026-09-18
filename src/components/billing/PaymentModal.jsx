import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { CreditCard } from 'lucide-react';
import './Billing.css';

export const PaymentModal = ({
  isOpen,
  onClose,
  onSubmitPayment,
  invoice = null,
  invoices = []
}) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    method: 'UPI',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    recordedBy: 'Priya Rao',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (invoice) {
      setSelectedInvoiceId(invoice.invoiceId || invoice.id);
      setFormData({
        amount: invoice.balanceAmount || '',
        method: 'UPI',
        date: new Date().toISOString().split('T')[0],
        reference: `UPI/${Math.floor(100000 + Math.random() * 900000)}`,
        recordedBy: 'Priya Rao',
        notes: ''
      });
    } else if (invoices.length > 0) {
      const unpaid = invoices.find((inv) => inv.balanceAmount > 0 && inv.invoiceStatus !== 'Cancelled');
      const target = unpaid || invoices[0];
      setSelectedInvoiceId(target.invoiceId || target.id);
      setFormData({
        amount: target.balanceAmount || '',
        method: 'UPI',
        date: new Date().toISOString().split('T')[0],
        reference: `UPI/${Math.floor(100000 + Math.random() * 900000)}`,
        recordedBy: 'Priya Rao',
        notes: ''
      });
    }
    setErrors({});
  }, [invoice, invoices, isOpen]);

  const activeInvoice = invoice || invoices.find((i) => (i.invoiceId || i.id) === selectedInvoiceId);

  const invoiceOptions = invoices
    .filter((inv) => inv.invoiceStatus !== 'Cancelled')
    .map((inv) => ({
      value: inv.invoiceId || inv.id,
      label: `${inv.invoiceId} - ${inv.guestName} (Balance: ₹${inv.balanceAmount.toLocaleString('en-IN')})`
    }));

  const methodOptions = [
    { value: 'UPI', label: 'UPI (GPay, PhonePe, Paytm)' },
    { value: 'Card', label: 'Credit / Debit Card' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Bank Transfer', label: 'Bank Transfer / NEFT' }
  ];

  const validate = () => {
    const errs = {};
    if (!activeInvoice) errs.invoice = 'Invoice selection is required';
    if (!formData.amount || Number(formData.amount) <= 0) {
      errs.amount = 'Valid payment amount is required';
    } else if (activeInvoice && Number(formData.amount) > activeInvoice.balanceAmount) {
      errs.amount = `Amount cannot exceed remaining balance of ₹${activeInvoice.balanceAmount.toLocaleString('en-IN')}`;
    }
    if (!formData.method) errs.method = 'Payment method is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmitPayment(selectedInvoiceId, formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Guest Payment" maxWidth="520px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!invoice && (
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
              Select Invoice <span className="required-star">*</span>
            </label>
            <Select
              value={selectedInvoiceId}
              onChange={(e) => {
                setSelectedInvoiceId(e.target.value);
                const target = invoices.find((i) => (i.invoiceId || i.id) === e.target.value);
                if (target) {
                  setFormData((prev) => ({ ...prev, amount: target.balanceAmount }));
                }
              }}
              options={invoiceOptions}
              placeholder="Choose invoice to record payment..."
            />
            {errors.invoice && <div className="form-field-error">{errors.invoice}</div>}
          </div>
        )}

        {/* Selected Invoice Overview */}
        {activeInvoice && (
          <div
            style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              padding: '0.875rem',
              borderRadius: 'var(--radius-sm)',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Invoice ID & Guest</span>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {activeInvoice.invoiceId} · {activeInvoice.guestName}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Amount</span>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                ₹{activeInvoice.totalAmount.toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Already Paid</span>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--status-success-text)' }}>
                ₹{activeInvoice.paidAmount.toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Remaining Balance</span>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--status-danger-text)' }}>
                ₹{activeInvoice.balanceAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        )}

        <div className="grid-2">
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
              Payment Amount (₹) <span className="required-star">*</span>
            </label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="e.g. 5000"
            />
            {errors.amount && <div className="form-field-error">{errors.amount}</div>}
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
              Payment Method <span className="required-star">*</span>
            </label>
            <Select
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              options={methodOptions}
            />
            {errors.method && <div className="form-field-error">{errors.method}</div>}
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
              Payment Date
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
              Reference / Txn #
            </label>
            <Input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              placeholder="Transaction ref no."
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', display: 'block' }}>
            Notes / Payment Remarks
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes for payment receipt..."
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
          <Button variant="primary" type="submit" icon={CreditCard}>
            Record Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
