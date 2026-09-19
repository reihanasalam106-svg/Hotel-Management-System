import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingState } from '../../components/common/LoadingState';
import { UserPlus, Users, RotateCcw, RefreshCw } from 'lucide-react';
import { useReservations } from '../../context/ReservationContext';

import { GuestSummaryCards } from '../../components/guests/GuestSummaryCards';
import { GuestFilters } from '../../components/guests/GuestFilters';
import { GuestTable } from '../../components/guests/GuestTable';
import { GuestFormModal } from '../../components/guests/GuestFormModal';
import { GuestDetailsModal } from '../../components/guests/GuestDetailsModal';

export const Guests = () => {
  const {
    guests,
    reservations,
    rooms,
    invoices,
    addGuest,
    updateGuest,
    changeGuestStatus,
    isLoading,
    error,
    refreshAllData
  } = useReservations();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [guestTypeFilter, setGuestTypeFilter] = useState('All');
  const [bookingFilter, setBookingFilter] = useState('All');

  // Sorting State
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [viewingGuest, setViewingGuest] = useState(null);

  // Trigger search on button click / enter key
  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveSearchTerm('');
    setStatusFilter('All');
    setGuestTypeFilter('All');
    setBookingFilter('All');
    setCurrentPage(1);
  };

  // Sort toggle handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter & Sort Pipeline
  const filteredAndSortedGuests = useMemo(() => {
    return guests
      .filter((guest) => {
        // Search term filtering (name, phone, email, ID, or current room)
        const term = (activeSearchTerm || searchTerm).toLowerCase().trim();
        if (term) {
          const matchName = (guest.name || '').toLowerCase().includes(term);
          const matchPhone = (guest.phone || '').includes(term);
          const matchEmail = (guest.email || '').toLowerCase().includes(term);
          const matchId = (guest.id || '').toLowerCase().includes(term);
          const matchRoom = (guest.currentRoom || '').toLowerCase().includes(term);
          if (!matchName && !matchPhone && !matchEmail && !matchId && !matchRoom) {
            return false;
          }
        }

        // Status Filter
        if (statusFilter !== 'All' && guest.status !== statusFilter) {
          return false;
        }

        // Guest Type Filter
        if (guestTypeFilter !== 'All' && guest.guestType !== guestTypeFilter) {
          return false;
        }

        // Booking Filter
        if (bookingFilter === 'Has Booking') {
          if (!guest.totalBookings && !guest.currentRoom) return false;
        } else if (bookingFilter === 'No Booking') {
          if (guest.totalBookings > 0 || guest.currentRoom) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === 'name') {
          valA = (a.name || '').toLowerCase();
          valB = (b.name || '').toLowerCase();
        } else if (sortField === 'totalBookings') {
          valA = Number(a.totalBookings) || 0;
          valB = Number(b.totalBookings) || 0;
        } else if (sortField === 'lastStay') {
          valA = a.lastStay ? new Date(a.lastStay).getTime() : 0;
          valB = b.lastStay ? new Date(b.lastStay).getTime() : 0;
        } else if (sortField === 'status') {
          valA = (a.status || '').toLowerCase();
          valB = (b.status || '').toLowerCase();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [guests, searchTerm, activeSearchTerm, statusFilter, guestTypeFilter, bookingFilter, sortField, sortOrder]);

  // Paginated Subset
  const totalItems = filteredAndSortedGuests.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedGuests = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedGuests.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedGuests, currentPage, pageSize]);

  if (isLoading && guests.length === 0) {
    return (
      <div className="guests-page">
        <LoadingState label="Loading guest directory from database..." />
      </div>
    );
  }

  if (error && guests.length === 0) {
    return (
      <div className="guests-page" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
        <Button onClick={refreshAllData} variant="primary" icon={RefreshCw}>
          Retry Loading
        </Button>
      </div>
    );
  }

  // Form Submissions
  const handleCreateGuestSubmit = (formData) => {
    addGuest(formData);
    setIsAddModalOpen(false);
  };

  const handleEditGuestSubmit = (formData) => {
    if (editingGuest) {
      updateGuest(editingGuest.id, formData);
      setEditingGuest(null);
    }
  };

  return (
    <div className="module-page">
      {/* 1. Page Header */}
      <PageHeader
        title="Guest Management"
        description="Manage guest profiles, stays, booking history and guest information."
        action={
          <Button variant="primary" icon={UserPlus} onClick={() => setIsAddModalOpen(true)}>
            + Add Guest
          </Button>
        }
      />

      {/* 2. Dynamic Summary Cards */}
      <GuestSummaryCards guests={guests} />

      {/* 3. Filter & Search Toolbar */}
      <GuestFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        guestTypeFilter={guestTypeFilter}
        setGuestTypeFilter={setGuestTypeFilter}
        bookingFilter={bookingFilter}
        setBookingFilter={setBookingFilter}
        onSearch={handleSearch}
        onClearFilters={handleClearFilters}
      />

      {/* 4. Guest Table / Empty State */}
      {displayedGuests.length > 0 ? (
        <>
          <GuestTable
            guests={displayedGuests}
            onViewGuest={(g) => setViewingGuest(g)}
            onEditGuest={(g) => setEditingGuest(g)}
            onChangeStatus={(id, status) => changeGuestStatus(id, status)}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      ) : (
        <EmptyState
          icon={Users}
          title="No guests found"
          description="Try changing your search or filter criteria."
          action={
            <Button variant="outline" icon={RotateCcw} onClick={handleClearFilters}>
              Clear Filters
            </Button>
          }
        />
      )}

      {/* Add Guest Modal */}
      <GuestFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateGuestSubmit}
      />

      {/* Edit Guest Modal */}
      {editingGuest && (
        <GuestFormModal
          isOpen={Boolean(editingGuest)}
          onClose={() => setEditingGuest(null)}
          onSubmit={handleEditGuestSubmit}
          initialData={editingGuest}
        />
      )}

      {/* View Guest Details Modal / Drawer */}
      {viewingGuest && (
        <GuestDetailsModal
          isOpen={Boolean(viewingGuest)}
          onClose={() => setViewingGuest(null)}
          guest={viewingGuest}
          reservations={reservations}
          rooms={rooms}
          invoices={invoices}
          onChangeStatus={(id, status) => {
            changeGuestStatus(id, status);
            setViewingGuest((prev) => (prev ? { ...prev, status } : null));
          }}
        />
      )}
    </div>
  );
};

export default Guests;
