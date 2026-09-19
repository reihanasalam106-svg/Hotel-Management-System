import React, { useState, useMemo } from 'react';
import { useHotel } from '../../context/ReservationContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingState } from '../../components/common/LoadingState';
import { Receipt, CreditCard, RefreshCw } from 'lucide-react';

import { BillingSummaryCards } from '../../components/billing/BillingSummaryCards';
import { BillingFilters } from '../../components/billing/BillingFilters';
import { BillingTable } from '../../components/billing/BillingTable';
import { OutstandingPayments } from '../../components/billing/OutstandingPayments';
import { BillFormModal } from '../../components/billing/BillFormModal';
import { PaymentModal } from '../../components/billing/PaymentModal';
import { InvoiceDetailsDrawer } from '../../components/billing/InvoiceDetailsDrawer';
import { InvoicePrintView } from '../../components/billing/InvoicePrintView';

export const Billing = () => {
  const {
    invoices,
    reservations,
    rooms,
    taxRate,
    addInvoice,
    updateInvoice,
    recordPayment,
    issueInvoice,
    cancelInvoice,
    isLoading,
    error,
    refreshAllData
  } = useHotel();

  // Pagination & Sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('ALL');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('ALL');
  const [selectedInvoiceStatus, setSelectedInvoiceStatus] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('ALL');

  // Modal & Drawer states
  const [isCreateBillOpen, setIsCreateBillOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTargetInvoice, setPaymentTargetInvoice] = useState(null);

  const [selectedDetailInvoice, setSelectedDetailInvoice] = useState(null);
  const [selectedPrintInvoice, setSelectedPrintInvoice] = useState(null);
  const [cancellingInvoice, setCancellingInvoice] = useState(null);

  // Filter handlers
  const handleApplySearch = () => {
    setActiveSearch(searchQuery.trim().toLowerCase());
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveSearch('');
    setSelectedPaymentStatus('ALL');
    setSelectedPaymentMethod('ALL');
    setSelectedInvoiceStatus('ALL');
    setSelectedDateRange('ALL');
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter logic
  const filteredInvoices = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    return invoices.filter((inv) => {
      // Search term check (Invoice ID, Guest Name, Reservation ID, Room Number)
      if (activeSearch) {
        const matchesInvoiceId = inv.invoiceId.toLowerCase().includes(activeSearch);
        const matchesGuest = inv.guestName.toLowerCase().includes(activeSearch);
        const matchesResId = inv.reservationId.toLowerCase().includes(activeSearch);
        const matchesRoom = String(inv.roomNumber).toLowerCase().includes(activeSearch);
        if (!matchesInvoiceId && !matchesGuest && !matchesResId && !matchesRoom) {
          return false;
        }
      }

      // Payment Status Filter
      if (selectedPaymentStatus !== 'ALL' && inv.paymentStatus !== selectedPaymentStatus) {
        return false;
      }

      // Payment Method Filter
      if (selectedPaymentMethod !== 'ALL' && inv.paymentMethod !== selectedPaymentMethod) {
        return false;
      }

      // Invoice Status Filter
      if (selectedInvoiceStatus !== 'ALL' && inv.invoiceStatus !== selectedInvoiceStatus) {
        return false;
      }

      // Date Range Filter
      if (selectedDateRange === 'TODAY' && inv.createdAt !== todayStr) {
        return false;
      }

      return true;
    });
  }, [
    invoices,
    activeSearch,
    selectedPaymentStatus,
    selectedPaymentMethod,
    selectedInvoiceStatus,
    selectedDateRange
  ]);

  // Sorting logic
  const sortedInvoices = useMemo(() => {
    return [...filteredInvoices].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'totalAmount' || sortField === 'paidAmount' || sortField === 'balanceAmount') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredInvoices, sortField, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedInvoices.length / pageSize) || 1;
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedInvoices.slice(start, start + pageSize);
  }, [sortedInvoices, currentPage, pageSize]);

  // Action handlers
  const handleCreateBillSubmit = (billData) => {
    if (editingBill) {
      updateInvoice(editingBill.invoiceId, billData);
      setEditingBill(null);
    } else {
      addInvoice(billData);
    }
  };

  const handleOpenPaymentModal = (inv = null) => {
    setPaymentTargetInvoice(inv);
    setIsPaymentModalOpen(true);
  };

  const handleRecordPaymentSubmit = (targetInvoiceId, paymentData) => {
    recordPayment(targetInvoiceId, paymentData);
  };

  const handleConfirmCancelInvoice = () => {
    if (cancellingInvoice) {
      cancelInvoice(cancellingInvoice.invoiceId);
      setCancellingInvoice(null);
    }
  };

  if (isLoading && invoices.length === 0) {
    return (
      <div className="module-page billing-container">
        <LoadingState label="Loading billing data and invoices from database..." />
      </div>
    );
  }

  if (error && invoices.length === 0) {
    return (
      <div className="module-page billing-container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
        <Button onClick={refreshAllData} variant="primary" icon={RefreshCw}>
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="module-page billing-container">
      {/* 1. Page Header */}
      <PageHeader
        title="Billing & Invoicing"
        description="Manage guest bills, payments, invoices and outstanding balances."
        action={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="outline"
              icon={CreditCard}
              onClick={() => handleOpenPaymentModal(null)}
            >
              Payment
            </Button>
            <Button
              variant="primary"
              icon={Receipt}
              onClick={() => {
                setEditingBill(null);
                setIsCreateBillOpen(true);
              }}
            >
              + Create Bill
            </Button>
          </div>
        }
      />

      {/* 2. Summary Cards */}
      <BillingSummaryCards invoices={invoices} />

      {/* 3. Filter Toolbar */}
      <BillingFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPaymentStatus={selectedPaymentStatus}
        onPaymentStatusChange={setSelectedPaymentStatus}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={setSelectedPaymentMethod}
        selectedInvoiceStatus={selectedInvoiceStatus}
        onInvoiceStatusChange={setSelectedInvoiceStatus}
        selectedDateRange={selectedDateRange}
        onDateRangeChange={setSelectedDateRange}
        onClearFilters={handleClearFilters}
        onApplySearch={handleApplySearch}
      />

      {/* 4. Outstanding Payments Section */}
      <OutstandingPayments
        invoices={invoices}
        onRecordPayment={(inv) => handleOpenPaymentModal(inv)}
        onViewInvoice={(inv) => setSelectedDetailInvoice(inv)}
      />

      {/* 5. Main Billing Table & Pagination */}
      {paginatedInvoices.length > 0 ? (
        <>
          <BillingTable
            invoices={paginatedInvoices}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            onViewInvoice={(inv) => setSelectedDetailInvoice(inv)}
            onEditInvoice={(inv) => {
              setEditingBill(inv);
              setIsCreateBillOpen(true);
            }}
            onRecordPayment={(inv) => handleOpenPaymentModal(inv)}
            onIssueInvoice={(invId) => issueInvoice(invId)}
            onPrintInvoice={(inv) => setSelectedPrintInvoice(inv)}
            onCancelInvoice={(inv) => setCancellingInvoice(inv)}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedInvoices.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <EmptyState
          icon={Receipt}
          title="No invoices found"
          description="Try changing your search or filter criteria."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      )}

      {/* MODALS & DRAWERS */}

      {/* Create / Edit Bill Modal */}
      <BillFormModal
        isOpen={isCreateBillOpen}
        onClose={() => setIsCreateBillOpen(false)}
        onSubmit={handleCreateBillSubmit}
        initialData={editingBill}
        reservations={reservations}
        rooms={rooms}
        defaultTaxRate={taxRate}
      />

      {/* Record Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmitPayment={handleRecordPaymentSubmit}
        invoice={paymentTargetInvoice}
        invoices={invoices}
      />

      {/* Invoice Details Drawer */}
      <InvoiceDetailsDrawer
        isOpen={!!selectedDetailInvoice}
        onClose={() => setSelectedDetailInvoice(null)}
        invoice={selectedDetailInvoice}
        onEditInvoice={(inv) => {
          setEditingBill(inv);
          setIsCreateBillOpen(true);
        }}
        onRecordPayment={(inv) => handleOpenPaymentModal(inv)}
        onIssueInvoice={(invId) => issueInvoice(invId)}
        onPrintInvoice={(inv) => setSelectedPrintInvoice(inv)}
        onCancelInvoice={(inv) => setCancellingInvoice(inv)}
      />

      {/* Printable Invoice Modal */}
      <InvoicePrintView
        isOpen={!!selectedPrintInvoice}
        onClose={() => setSelectedPrintInvoice(null)}
        invoice={selectedPrintInvoice}
      />

      {/* Cancel Invoice Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!cancellingInvoice}
        onClose={() => setCancellingInvoice(null)}
        onConfirm={handleConfirmCancelInvoice}
        title="Cancel Invoice"
        message="Are you sure you want to cancel this invoice?"
        confirmText="Confirm Cancellation"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default Billing;
