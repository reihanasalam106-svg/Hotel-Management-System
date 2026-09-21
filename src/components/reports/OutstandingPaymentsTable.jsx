import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Eye, AlertCircle } from 'lucide-react';

export const OutstandingPaymentsTable = ({ data = [], onViewInvoice }) => {
  const displayData = data || [];

  return (
    <Card
      title="Outstanding Payments & Receivables"
      subtitle="Invoices with pending balance amounts requiring payment collection"
    >
      <div className="table-responsive" style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
        <table className="guest-table" style={{ width: '100%', fontSize: '0.85rem' }}>
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
            {displayData.length > 0 ? (
              displayData.map((inv) => (
                <tr key={inv.invoiceId}>
                  <td style={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>{inv.invoiceId}</td>
                  <td>
                    <strong>{inv.guestName}</strong>
                  </td>
                  <td>Room {inv.roomNumber}</td>
                  <td>₹{(inv.totalAmount || 0).toLocaleString('en-IN')}</td>
                  <td style={{ color: 'var(--status-success-text)' }}>
                    ₹{(inv.paidAmount || 0).toLocaleString('en-IN')}
                  </td>
                  <td style={{ color: 'var(--status-danger-text)', fontWeight: 700 }}>
                    ₹{(inv.balanceAmount || 0).toLocaleString('en-IN')}
                  </td>
                  <td>
                    <Badge status={inv.paymentStatus}>{inv.paymentStatus}</Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      onClick={() => {
                        if (onViewInvoice) {
                          onViewInvoice(inv);
                        } else {
                          alert(`Viewing Invoice Details: ${inv.invoiceId}\nGuest: ${inv.guestName}\nBalance Due: ₹${inv.balanceAmount}`);
                        }
                      }}
                    >
                      View Invoice
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                  No outstanding receivables or pending balances found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
