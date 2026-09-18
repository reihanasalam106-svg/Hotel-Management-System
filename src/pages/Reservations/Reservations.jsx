import React, { useState, useMemo } from 'react';
import { useReservations } from '../../context/ReservationContext';
import { ReservationFilters } from '../../components/reservations/ReservationFilters';
import { ReservationTable } from '../../components/reservations/ReservationTable';
import { ReservationFormModal } from '../../components/reservations/ReservationFormModal';
import { ReservationDetailsModal } from '../../components/reservations/ReservationDetailsModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Pagination } from '../../components/common/Pagination';
import { Plus, Calendar, CheckCircle2, LogIn, Clock, IndianRupee } from 'lucide-react';
import './Reservations.css';

export const Reservations = () => {
  const { reservations, cancelReservation } = useReservations();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [checkInFrom, setCheckInFrom] = useState('');
  const [checkInTo, setCheckInTo] = useState('');
  const [checkOutFrom, setCheckOutFrom] = useState('');
  const [checkOutTo, setCheckOutTo] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sorting & Pagination States
  const [sortField, setSortField] = useState('checkIn');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [viewingReservation, setViewingReservation] = useState(null);
  const [cancellingReservation, setCancellingReservation] = useState(null);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setCheckInFrom('');
    setCheckInTo('');
    setCheckOutFrom('');
    setCheckOutTo('');
    setRoomTypeFilter('All');
    setStatusFilter('All');
    setCurrentPage(1);
  };

  // Filter & Search Logic
  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      // 1. Search term match (guestName, roomNumber, id)
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        res.guestName.toLowerCase().includes(query) ||
        res.roomNumber.toLowerCase().includes(query) ||
        res.id.toLowerCase().includes(query);

      // 2. Room Type filter
      const matchesRoomType =
        roomTypeFilter === 'All' ||
        res.roomType.toLowerCase() === roomTypeFilter.toLowerCase();

      // 3. Status filter
      const matchesStatus =
        statusFilter === 'All' ||
        res.status.toLowerCase() === statusFilter.toLowerCase();

      // 4. Date range filters
      const matchesCheckInFrom = !checkInFrom || res.checkIn >= checkInFrom;
      const matchesCheckInTo = !checkInTo || res.checkIn <= checkInTo;
      const matchesCheckOutFrom = !checkOutFrom || res.checkOut >= checkOutFrom;
      const matchesCheckOutTo = !checkOutTo || res.checkOut <= checkOutTo;

      return (
        matchesSearch &&
        matchesRoomType &&
        matchesStatus &&
        matchesCheckInFrom &&
        matchesCheckInTo &&
        matchesCheckOutFrom &&
        matchesCheckOutTo
      );
    });
  }, [
    reservations,
    searchTerm,
    roomTypeFilter,
    statusFilter,
    checkInFrom,
    checkInTo,
    checkOutFrom,
    checkOutTo
  ]);

  // Sorting Logic
  const sortedReservations = useMemo(() => {
    return [...filteredReservations].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredReservations, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Pagination calculations
  const totalItems = sortedReservations.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedReservations = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedReservations.slice(startIndex, startIndex + pageSize);
  }, [sortedReservations, currentPage, pageSize]);

  // Modal Handlers
  const handleOpenNewModal = () => {
    setEditingReservation(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (res) => {
    setEditingReservation(res);
    setIsFormOpen(true);
  };

  const handleOpenViewModal = (res) => {
    setViewingReservation(res);
  };

  const handleOpenCancelConfirm = (res) => {
    setCancellingReservation(res);
  };

  const handleConfirmCancel = () => {
    if (cancellingReservation) {
      cancelReservation(cancellingReservation.id);
      setCancellingReservation(null);
    }
  };

  // Quick Overview Stats
  const totalConfirmed = reservations.filter((r) => r.status === 'Confirmed').length;
  const totalCheckedIn = reservations.filter((r) => r.status === 'Checked In').length;
  const totalPending = reservations.filter((r) => r.status === 'Pending').length;

  return (
    <div className="reservations-page">
      {/* PAGE HEADER SECTION */}
      <div className="page-header-bar">
        <div className="page-header-title-group">
          <h1 className="page-main-title">Reservation Management</h1>
          <p className="page-sub-title">Manage all hotel reservations and guest stays</p>
        </div>

        <button className="new-reservation-btn" onClick={handleOpenNewModal}>
          <Plus size={18} />
          <span>New Reservation</span>
        </button>
      </div>

      {/* QUICK KPI STAT CARDS */}
      <div className="res-kpi-grid">
        <div className="res-kpi-card">
          <div className="res-kpi-icon blue">
            <Calendar size={20} />
          </div>
          <div className="res-kpi-info">
            <span className="res-kpi-label">Total Bookings</span>
            <span className="res-kpi-value">{reservations.length}</span>
          </div>
        </div>

        <div className="res-kpi-card">
          <div className="res-kpi-icon green">
            <LogIn size={20} />
          </div>
          <div className="res-kpi-info">
            <span className="res-kpi-label">Checked In</span>
            <span className="res-kpi-value">{totalCheckedIn}</span>
          </div>
        </div>

        <div className="res-kpi-card">
          <div className="res-kpi-icon gold">
            <CheckCircle2 size={20} />
          </div>
          <div className="res-kpi-info">
            <span className="res-kpi-label">Confirmed</span>
            <span className="res-kpi-value">{totalConfirmed}</span>
          </div>
        </div>

        <div className="res-kpi-card">
          <div className="res-kpi-icon orange">
            <Clock size={20} />
          </div>
          <div className="res-kpi-info">
            <span className="res-kpi-label">Pending</span>
            <span className="res-kpi-value">{totalPending}</span>
          </div>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <ReservationFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        checkInFrom={checkInFrom}
        setCheckInFrom={setCheckInFrom}
        checkInTo={checkInTo}
        setCheckInTo={setCheckInTo}
        checkOutFrom={checkOutFrom}
        setCheckOutFrom={setCheckOutFrom}
        checkOutTo={checkOutTo}
        setCheckOutTo={setCheckOutTo}
        roomTypeFilter={roomTypeFilter}
        setRoomTypeFilter={setRoomTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onClearFilters={handleClearFilters}
      />

      {/* RESERVATIONS TABLE VIEW */}
      <ReservationTable
        reservations={paginatedReservations}
        onView={handleOpenViewModal}
        onEdit={handleOpenEditModal}
        onCancel={handleOpenCancelConfirm}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* CREATE / EDIT FORM MODAL */}
      <ReservationFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingReservation}
      />

      {/* VIEW DETAILS MODAL */}
      <ReservationDetailsModal
        isOpen={!!viewingReservation}
        onClose={() => setViewingReservation(null)}
        reservation={viewingReservation}
      />

      {/* CANCEL CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={!!cancellingReservation}
        onClose={() => setCancellingReservation(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Reservation"
        message={`Are you sure you want to cancel reservation ${cancellingReservation?.id} for ${cancellingReservation?.guestName}?`}
        confirmText="Cancel Reservation"
        cancelText="Keep Reservation"
        variant="danger"
      />
    </div>
  );
};
