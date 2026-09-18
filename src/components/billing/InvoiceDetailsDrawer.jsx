import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Edit3, CreditCard, Send, Printer, XCircle } from 'lucide-react';
import './Billing.css';

export const InvoiceDetailsDrawer = ({
  isOpen,
  onClose,
  invoice,
  onEditInvoice,
  onRecordPayment,
  onIssueInvoice,
  onPrintInvoice,
  onCancelInvoice
}) => {
  if (!invoice) return null;

  const isDraft = invoice.invoiceStatus === 'Draft';
  const isCancelled = invoice.invoiceStatus === 'Cancelled';
  const hasBalance = invoice.balanceAmount > 0 && !isCancelled;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice Details - ${invoice.invoiceId}`}
      maxWidth="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Top Header Card */}
        <div
          style={{
            background: 'var(--bg-subtle)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
              {invoice.invoiceId}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Created: {invoice.createdAt} · Due: {invoice.dueDate}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Badge status={invoice.paymentStatus} />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                background: isCancelled ? 'var(--status-danger-bg)' : isDraft ? 'var(--bg-surface)' : 'var(--accent-gold-bg)',
                color: isCancelled ? 'var(--status-danger-text)' : isDraft ? 'var(--text-secondary)' : 'var(--accent-gold-dark)',
                border: '1px solid var(--border-color)'
              }}
            >
              {invoice.invoiceStatus}
            </span>
          </div>
        </div>

        {/* Guest & Reservation Info Grid */}
        <div className="grid-2">
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '0.875rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Guest Profile Information
            </span>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.25rem' }}>{invoice.guestName}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{invoice.guestPhone}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{invoice.guestEmail}</div>
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '0.875rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Reservation & Room Details
            </span>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.25rem' }}>
              {invoice.reservationId} · Room {invoice.roomNumber} ({invoice.roomType})
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Stay: {invoice.checkIn} to {invoice.checkOut} ({invoice.nights} nights)
            </div>
          </div>
        </div>

        {/* Itemized Line Items Table */}
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'block' }}>
            Itemized Charge Breakdown
          </span>
          <table className="custom-table" style={{ fontSize: '0.85rem' }}>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty / Duration</th>
                <th>Rate / Unit Price</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Room Accommodation Charge</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Room {invoice.roomNumber} ({invoice.roomType})
                  </div>
                </td>
                <td>{invoice.nights} nights</td>
                <td>₹{invoice.roomRate.toLocaleString('en-IN')}</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>
                  ₹{invoice.roomCharges.toLocaleString('en-IN')}
                </td>
              </tr>
              {invoice.additionalServices && invoice.additionalServices.length > 0 && (
                invoice.additionalServices.map((svc, idx) => (
                  <tr key={svc.id || idx}>
                    <td>{svc.name}</td>
                    <td>{svc.quantity}</td>
                    <td>₹{svc.unitPrice.toLocaleString('en-IN')}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      ₹{svc.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Calculations Box */}
        <div className="calc-summary-box">
          <div className="calc-row">
            <span>Subtotal Amount:</span>
            <span>₹{invoice.subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="calc-row" style={{ color: 'var(--status-danger-text)' }}>
            <span>Discount ({invoice.discountType === 'percent' ? `${invoice.discountValue}%` : 'Fixed'}):</span>
            <span>-₹{invoice.discount.toLocaleString('en-IN')}</span>
          </div>
          <div className="calc-row">
            <span>Taxable Amount:</span>
            <span>₹{invoice.taxableAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="calc-row">
            <span>Taxes ({invoice.taxRate}% GST):</span>
            <span>+₹{invoice.taxAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="calc-row total">
            <span>Grand Total:</span>
            <span style={{ color: 'var(--accent-gold-dark)' }}>₹{invoice.totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="calc-row">
            <span>Paid Amount:</span>
            <span style={{ color: 'var(--status-success-text)', fontWeight: 700 }}>
              ₹{invoice.paidAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="calc-row balance">
            <span>Balance Due:</span>
            <span>₹{invoice.balanceAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Payment History */}
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'block' }}>
            Payment Transactions History
          </span>
          {invoice.payments && invoice.payments.length > 0 ? (
            <table className="custom-table" style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Reference</th>
                  <th>Recorded By</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.payments.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700 }}>{p.id}</td>
                    <td>{p.date}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{p.method}</span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.reference}</td>
                    <td>{p.recordedBy}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--status-success-text)' }}>
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              No payments recorded yet for this invoice.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {isDraft && (
            <Button
              variant="secondary"
              icon={Edit3}
              onClick={() => {
                onClose();
                onEditInvoice(invoice);
              }}
            >
              Edit Bill
            </Button>
          )}

          {hasBalance && (
            <Button
              variant="primary"
              icon={CreditCard}
              onClick={() => {
                onClose();
                onRecordPayment(invoice);
              }}
            >
              Record Payment
            </Button>
          )}

          {isDraft && (
            <Button
              variant="outline"
              icon={Send}
              onClick={() => {
                onClose();
                onIssueInvoice(invoice.invoiceId);
              }}
            >
              Issue Invoice
            </Button>
          )}

          <Button
            variant="outline"
            icon={Printer}
            onClick={() => {
              onClose();
              onPrintInvoice(invoice);
            }}
          >
            Print Invoice
          </Button>

          {!isCancelled && (
            <Button
              variant="danger"
              icon={XCircle}
              onClick={() => {
                onClose();
                onCancelInvoice(invoice);
              }}
            >
              Cancel Invoice
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
