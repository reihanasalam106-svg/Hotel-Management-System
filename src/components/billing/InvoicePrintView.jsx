import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Printer, Download } from 'lucide-react';
import './Billing.css';

export const InvoicePrintView = ({ isOpen, onClose, invoice }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Printable Invoice - ${invoice.invoiceId}`} maxWidth="780px">
      <div className="printable-invoice-container">
        <div className="invoice-print-paper">
          {/* Hotel Branding Header */}
          <div className="invoice-header-row">
            <div>
              <div className="hotel-brand-title">GRAND LUXURY HOTEL & SUITES</div>
              <div className="hotel-brand-sub">123 Hospitality Way, Luxury Bay, City 600001</div>
              <div className="hotel-brand-sub">Phone: +91 44 2800 9000 | Email: billing@grandluxuryhotel.com</div>
            </div>
            <div className="invoice-title-meta">
              <div className="invoice-title-text">TAX INVOICE</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '4px' }}>{invoice.invoiceId}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Date: {invoice.createdAt}</div>
            </div>
          </div>

          {/* Guest & Stay Details */}
          <div className="invoice-info-grid">
            <div className="invoice-info-block">
              <span className="invoice-info-title">BILLED TO (GUEST)</span>
              <strong>{invoice.guestName}</strong>
              <span>Phone: {invoice.guestPhone}</span>
              <span>Email: {invoice.guestEmail}</span>
            </div>
            <div className="invoice-info-block">
              <span className="invoice-info-title">RESERVATION & STAY DETAILS</span>
              <strong>Reservation Ref: {invoice.reservationId}</strong>
              <span>Room {invoice.roomNumber} ({invoice.roomType})</span>
              <span>Stay: {invoice.checkIn} to {invoice.checkOut} ({invoice.nights} Nights)</span>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Qty / Days</th>
                <th>Unit Rate (₹)</th>
                <th style={{ textAlign: 'right' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Room Accommodation Charge - Room {invoice.roomNumber} ({invoice.roomType})</td>
                <td>{invoice.nights} nights</td>
                <td>₹{invoice.roomRate.toLocaleString('en-IN')}</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>
                  ₹{invoice.roomCharges.toLocaleString('en-IN')}
                </td>
              </tr>
              {invoice.additionalServices && invoice.additionalServices.map((svc, idx) => (
                <tr key={svc.id || idx}>
                  <td>{svc.name}</td>
                  <td>{svc.quantity}</td>
                  <td>₹{svc.unitPrice.toLocaleString('en-IN')}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>
                    ₹{svc.total.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <div style={{ width: '320px' }} className="calc-summary-box">
              <div className="calc-row">
                <span>Subtotal:</span>
                <span>₹{invoice.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="calc-row" style={{ color: 'var(--status-danger-text)' }}>
                <span>Discount:</span>
                <span>-₹{invoice.discount.toLocaleString('en-IN')}</span>
              </div>
              <div className="calc-row">
                <span>Taxable Amount:</span>
                <span>₹{invoice.taxableAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="calc-row">
                <span>GST Tax ({invoice.taxRate}%):</span>
                <span>+₹{invoice.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="calc-row total">
                <span>Grand Total:</span>
                <span>₹{invoice.totalAmount.toLocaleString('en-IN')}</span>
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
          </div>

          {/* Payment History Breakdown */}
          {invoice.payments && invoice.payments.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="invoice-info-title" style={{ display: 'block', marginBottom: '0.4rem' }}>
                PAYMENT RECORD & TRANSACTIONS
              </span>
              <table className="custom-table" style={{ fontSize: '0.8rem' }}>
                <thead>
                  <tr>
                    <th>Txn ID</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Reference</th>
                    <th style={{ textAlign: 'right' }}>Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.payments.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 700 }}>{p.id}</td>
                      <td>{p.date}</td>
                      <td>{p.method}</td>
                      <td>{p.reference}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--status-success-text)' }}>
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Terms Footer */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Thank you for staying with Grand Luxury Hotel & Suites! For queries, contact billing@grandluxuryhotel.com.
          </div>
        </div>

        {/* Modal Buttons (Hidden when browser prints) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" icon={Printer} onClick={handlePrint}>
            Print / Save as PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};
