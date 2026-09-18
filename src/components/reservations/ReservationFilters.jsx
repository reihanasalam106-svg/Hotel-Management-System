import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import './ReservationFilters.css';

export const ReservationFilters = ({
  searchTerm,
  setSearchTerm,
  checkInFrom,
  setCheckInFrom,
  checkInTo,
  setCheckInTo,
  checkOutFrom,
  setCheckOutFrom,
  checkOutTo,
  setCheckOutTo,
  roomTypeFilter,
  setRoomTypeFilter,
  statusFilter,
  setStatusFilter,
  onClearFilters
}) => {
  return (
    <div className="reservation-filters-card">
      <div className="filters-header">
        <div className="filters-title">
          <Filter size={18} className="filter-title-icon" />
          <span>Filter & Search Reservations</span>
        </div>
        <button className="clear-filters-btn" onClick={onClearFilters}>
          <RotateCcw size={14} />
          <span>Clear Filters</span>
        </button>
      </div>

      <div className="filters-grid">
        {/* Search Input */}
        <div className="filter-group search-group">
          <label className="filter-label">Search Keyword</label>
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="filter-input search-input"
              placeholder="Guest name, room #, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Room Type Dropdown */}
        <div className="filter-group">
          <label className="filter-label">Room Type</label>
          <select
            className="filter-select"
            value={roomTypeFilter}
            onChange={(e) => setRoomTypeFilter(e.target.value)}
          >
            <option value="All">All Room Types</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="filter-group">
          <label className="filter-label">Reservation Status</label>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked In">Checked In</option>
            <option value="Checked Out">Checked Out</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Check-In Date From */}
        <div className="filter-group">
          <label className="filter-label">Check-in From</label>
          <input
            type="date"
            className="filter-input"
            value={checkInFrom}
            onChange={(e) => setCheckInFrom(e.target.value)}
          />
        </div>

        {/* Check-In Date To */}
        <div className="filter-group">
          <label className="filter-label">Check-in To</label>
          <input
            type="date"
            className="filter-input"
            value={checkInTo}
            onChange={(e) => setCheckInTo(e.target.value)}
          />
        </div>

        {/* Check-Out Date From */}
        <div className="filter-group">
          <label className="filter-label">Check-out From</label>
          <input
            type="date"
            className="filter-input"
            value={checkOutFrom}
            onChange={(e) => setCheckOutFrom(e.target.value)}
          />
        </div>

        {/* Check-Out Date To */}
        <div className="filter-group">
          <label className="filter-label">Check-out To</label>
          <input
            type="date"
            className="filter-input"
            value={checkOutTo}
            onChange={(e) => setCheckOutTo(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
