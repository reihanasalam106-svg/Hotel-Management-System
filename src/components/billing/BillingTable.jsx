import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  MoreVertical,
  Eye,
  Edit3,
  CreditCard,
  Send,
  Printer,
  XCircle,
  ArrowUpDown
} from 'lucide-react';
import './Billing.css';

export const BillingTable = ({
  invoices = [],
  sortField,
  sortOrder,
  onSort,
  onViewInvoice,
  onEditInvoice,
  onRecordPayment,
  onIssueInvoice,
  onPrintInvoice,
  onCancelInvoice
}) => {
  const [activeMenuInvoiceId, setActiveMenuInvoiceId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuInvoiceId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleActionMenu = (invoiceId, e) => {
    e.stopPropagation();
    setActiveMenuInvoiceId((prev) => (prev === invoiceId ? null : invoiceId));
  };

  const formatDateShort = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <th onClick={() => onSort('invoiceId')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Invoice ID <ArrowUpDown size={12} />
              </div>
            </th>
            <th>Guest</th>
            <th>Reservation</th>
            <th>Room</th>
            <th>Stay</th>
            <th>Subtotal</th>
            <th>Discount</th>
            <th>Tax</th>
            <th onClick={() => onSort('totalAmount')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Total <ArrowUpDown size={12} />
              </div>
            </th>
            <th onClick={() => onSort('paidAmount')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Paid <ArrowUpDown size={12} />
              </div>
            </th>
            <th onClick={() => onSort('balanceAmount')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Balance <ArrowUpDown size={12} />
              </div>
            </th>
            <th onClick={() => onSort('paymentStatus')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                Payment Status <ArrowUpDown size={12} />
              </div>
            </th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => {
            const stayStr = `${formatDateShort(inv.checkIn)} - ${formatDateShort(inv.checkOut)}`;
            const isDraft = inv.invoiceStatus === 'Draft';
            const isCancelled = inv.invoiceStatus === 'Cancelled';
            const hasBalance = inv.balanceAmount > 0 && !isCancelled;

            return (
              <tr key={inv.id}>
                <td style={{ fontWeight: 800, color: 'var(--primary-navy)' }}>
                  {inv.invoiceId}
                  {isDraft && (
                    <span
                      style={{
                        marginLeft: '6px',
                        fontSize: '0.675rem',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background: 'var(--bg-subtle)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      DRAFT
                    </span>
                  )}
                  {isCancelled && (
                    <span
                      style={{
                        marginLeft: '6px',
                        fontSize: '0.675rem',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background: 'var(--status-danger-bg)',
                        color: 'var(--status-danger-text)'
                      }}
                    >
                      CANCELLED
                    </span>
                  )}
                </td>
                <td style={{ fontWeight: 600 }}>{inv.guestName}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{inv.reservationId}</td>
                <td>
                  <strong>Room {inv.roomNumber}</strong>
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{stayStr}</td>
                <td>₹{inv.subtotal.toLocaleString('en-IN')}</td>
                <td style={{ color: 'var(--status-danger-text)' }}>
                  {inv.discount > 0 ? `-₹${inv.discount.toLocaleString('en-IN')}` : '₹0'}
                </td>
                <td>₹{inv.taxAmount.toLocaleString('en-IN')}</td>
                <td style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  ₹{inv.totalAmount.toLocaleString('en-IN')}
                </td>
                <td style={{ fontWeight: 700, color: 'var(--status-success-text)' }}>
                  ₹{inv.paidAmount.toLocaleString('en-IN')}
                </td>
                <td style={{ fontWeight: 700, color: inv.balanceAmount > 0 ? 'var(--status-danger-text)' : 'var(--text-muted)' }}>
                  ₹{inv.balanceAmount.toLocaleString('en-IN')}
                </td>
                <td>
                  <Badge status={inv.paymentStatus} />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="action-dropdown-wrapper" ref={activeMenuInvoiceId === inv.id ? menuRef : null}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={MoreVertical}
                      onClick={(e) => toggleActionMenu(inv.id, e)}
                    />
                    {activeMenuInvoiceId === inv.id && (
                      <div className="action-menu-popup">
                        <button
                          className="action-menu-item"
                          onClick={() => {
                            setActiveMenuInvoiceId(null);
                            onViewInvoice(inv);
                          }}
                        >
                          <Eye size={14} /> View Invoice Details
                        </button>

                        {isDraft && (
                          <button
                            className="action-menu-item"
                            onClick={() => {
                              setActiveMenuInvoiceId(null);
                              onEditInvoice(inv);
                            }}
                          >
                            <Edit3 size={14} /> Edit Bill
                          </button>
                        )}

                        {hasBalance && (
                          <button
                            className="action-menu-item"
                            onClick={() => {
                              setActiveMenuInvoiceId(null);
                              onRecordPayment(inv);
                            }}
                          >
                            <CreditCard size={14} color="#15803d" /> Record Payment
                          </button>
                        )}

                        {isDraft && (
                          <button
                            className="action-menu-item"
                            onClick={() => {
                              setActiveMenuInvoiceId(null);
                              onIssueInvoice(inv);
                            }}
                          >
                            <Send size={14} color="#0369a1" /> Issue Invoice
                          </button>
                        )}

                        <button
                          className="action-menu-item"
                          onClick={() => {
                            setActiveMenuInvoiceId(null);
                            onPrintInvoice(inv);
                          }}
                        >
                          <Printer size={14} color="#c5a059" /> Print Invoice
                        </button>

                        {!isCancelled && (
                          <button
                            className="action-menu-item danger"
                            onClick={() => {
                              setActiveMenuInvoiceId(null);
                              onCancelInvoice(inv);
                            }}
                          >
                            <XCircle size={14} /> Cancel Invoice
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
