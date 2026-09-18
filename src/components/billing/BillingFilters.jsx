import React from 'react';
import { SearchBar } from '../common/SearchBar';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Search, RotateCcw } from 'lucide-react';
import './Billing.css';

export const BillingFilters = ({
  searchQuery,
  onSearchChange,
  selectedPaymentStatus,
  onPaymentStatusChange,
  selectedPaymentMethod,
  onPaymentMethodChange,
  selectedInvoiceStatus,
  onInvoiceStatusChange,
  selectedDateRange,
  onDateRangeChange,
  onClearFilters,
  onApplySearch
}) => {
  const paymentStatusOptions = [
    { value: 'ALL', label: 'All Payment Statuses' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Partial', label: 'Partial' },
    { value: 'Refunded', label: 'Refunded' }
  ];

  const paymentMethodOptions = [
    { value: 'ALL', label: 'All Payment Methods' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Card', label: 'Card' },
    { value: 'UPI', label: 'UPI' },
    { value: 'Bank Transfer', label: 'Bank Transfer' }
  ];

  const invoiceStatusOptions = [
    { value: 'ALL', label: 'All Invoice Statuses' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Issued', label: 'Issued' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const dateRangeOptions = [
    { value: 'ALL', label: 'All Dates' },
    { value: 'TODAY', label: 'Today' },
    { value: 'THIS_WEEK', label: 'This Week' },
    { value: 'THIS_MONTH', label: 'This Month' }
  ];

  return (
    <div className="billing-filter-toolbar">
      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
        Filter Guest Invoices & Payments
      </div>

      <div className="billing-filter-row">
        <div className="billing-search-item">
          <SearchBar
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search invoice, guest or reservation..."
          />
        </div>

        <div className="billing-filter-item">
          <Select
            value={selectedPaymentStatus}
            onChange={(e) => onPaymentStatusChange(e.target.value)}
            options={paymentStatusOptions}
          />
        </div>

        <div className="billing-filter-item">
          <Select
            value={selectedPaymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            options={paymentMethodOptions}
          />
        </div>

        <div className="billing-filter-item">
          <Select
            value={selectedInvoiceStatus}
            onChange={(e) => onInvoiceStatusChange(e.target.value)}
            options={invoiceStatusOptions}
          />
        </div>

        <div className="billing-filter-item">
          <Select
            value={selectedDateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            options={dateRangeOptions}
          />
        </div>

        <div className="billing-filter-actions">
          <Button variant="primary" icon={Search} onClick={onApplySearch}>
            Search
          </Button>
          <Button variant="outline" icon={RotateCcw} onClick={onClearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
