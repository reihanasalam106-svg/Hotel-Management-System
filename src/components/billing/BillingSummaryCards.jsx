import React from 'react';
import { IndianRupee, CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';
import './Billing.css';

export const BillingSummaryCards = ({ invoices = [] }) => {
  const nonCancelledInvoices = invoices.filter((inv) => inv.invoiceStatus !== 'Cancelled');

  const totalRevenue = nonCancelledInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  const totalPaid = nonCancelledInvoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);
  const totalPending = nonCancelledInvoices.reduce((acc, inv) => acc + (inv.balanceAmount || 0), 0);
  const partialCount = nonCancelledInvoices.filter((inv) => inv.paymentStatus === 'Partial').length;
  const totalInvoicesCount = invoices.length;

  const cards = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: '#c5a059',
      bgColor: 'rgba(197, 160, 89, 0.15)'
    },
    {
      title: 'Paid Amount',
      value: `₹${totalPaid.toLocaleString('en-IN')}`,
      icon: CheckCircle2,
      color: '#15803d',
      bgColor: '#dcfce7'
    },
    {
      title: 'Pending Amount',
      value: `₹${totalPending.toLocaleString('en-IN')}`,
      icon: Clock,
      color: '#be123c',
      bgColor: '#ffe4e6'
    },
    {
      title: 'Partial Payments',
      value: partialCount,
      icon: AlertCircle,
      color: '#0369a1',
      bgColor: '#e0f2fe'
    },
    {
      title: 'Total Invoices',
      value: totalInvoicesCount,
      icon: FileText,
      color: '#6b21a8',
      bgColor: '#f3e8ff'
    }
  ];

  return (
    <div className="billing-summary-grid">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div className="billing-summary-card" key={idx}>
            <div
              className="billing-card-icon"
              style={{ backgroundColor: card.bgColor, color: card.color }}
            >
              <IconComponent size={22} />
            </div>
            <div className="billing-card-content">
              <span className="billing-card-title">{card.title}</span>
              <span className="billing-card-value">{card.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
