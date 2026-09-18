import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AlertCircle, CreditCard } from 'lucide-react';
import './Billing.css';

export const OutstandingPayments = ({ invoices = [], onRecordPayment, onViewInvoice }) => {
  const unpaidInvoices = invoices.filter(
    (inv) => inv.balanceAmount > 0 && inv.invoiceStatus !== 'Cancelled'
  );

  if (unpaidInvoices.length === 0) return null;

  return (
    <div className="outstanding-card">
      <div className="outstanding-header">
        <AlertCircle size={18} style={{ color: '#be123c' }} />
        Outstanding Guest Balances ({unpaidInvoices.length} Pending Invoices)
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Guest Name</th>
              <th>Room</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Balance Due</th>
              <th>Payment Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {unpaidInvoices.slice(0, 5).map((inv) => (
              <tr key={inv.id}>
                <td style={{ fontWeight: 800, color: 'var(--primary-navy)' }}>{inv.invoiceId}</td>
                <td style={{ fontWeight: 600 }}>{inv.guestName}</td>
                <td>Room {inv.roomNumber}</td>
                <td>₹{inv.totalAmount.toLocaleString('en-IN')}</td>
                <td style={{ color: 'var(--status-success-text)', fontWeight: 700 }}>
                  ₹{inv.paidAmount.toLocaleString('en-IN')}
                </td>
                <td style={{ color: 'var(--status-danger-text)', fontWeight: 800 }}>
                  ₹{inv.balanceAmount.toLocaleString('en-IN')}
                </td>
                <td>
                  <Badge status={inv.paymentStatus} />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={CreditCard}
                    onClick={() => onRecordPayment(inv)}
                  >
                    Record Payment
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
