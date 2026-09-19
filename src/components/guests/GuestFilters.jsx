import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import { Button } from '../common/Button';
import './GuestFilters.css';

export const GuestFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  guestTypeFilter,
  setGuestTypeFilter,
  bookingFilter,
  setBookingFilter,
  onSearch,
  onClearFilters
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className="guest-filters-toolbar">
      <div className="guest-filters-left">
        {/* Search Box */}
        <div className="guest-search-box">
          <Search size={18} className="guest-search-icon" />
          <input
            type="text"
            className="guest-search-input"
            placeholder="Search guest name, phone, email, room, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Status Filter */}
        <div className="guest-filter-group">
          <label className="guest-filter-label" htmlFor="statusFilter">Status</label>
          <select
            id="statusFilter"
            className="guest-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="In House">In House</option>
            <option value="Checked Out">Checked Out</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Guest Type Filter */}
        <div className="guest-filter-group">
          <label className="guest-filter-label" htmlFor="typeFilter">Type</label>
          <select
            id="typeFilter"
            className="guest-filter-select"
            value={guestTypeFilter}
            onChange={(e) => setGuestTypeFilter(e.target.value)}
          >
            <option value="All">All Guest Types</option>
            <option value="New Guest">New Guest</option>
            <option value="Returning Guest">Returning Guest</option>
          </select>
        </div>

        {/* Booking Filter */}
        <div className="guest-filter-group">
          <label className="guest-filter-label" htmlFor="bookingFilter">Booking</label>
          <select
            id="bookingFilter"
            className="guest-filter-select"
            value={bookingFilter}
            onChange={(e) => setBookingFilter(e.target.value)}
          >
            <option value="All">All Bookings</option>
            <option value="Has Booking">Has Booking</option>
            <option value="No Booking">No Booking</option>
          </select>
        </div>
      </div>

      <div className="guest-filters-right">
        <Button variant="primary" size="md" icon={Filter} onClick={onSearch}>
          Search
        </Button>
        <Button variant="outline" size="md" icon={RotateCcw} onClick={onClearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
