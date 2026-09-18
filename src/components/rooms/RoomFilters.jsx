import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import './RoomFilters.css';

export const RoomFilters = ({
  searchTerm,
  setSearchTerm,
  roomTypeFilter,
  setRoomTypeFilter,
  floorFilter,
  setFloorFilter,
  statusFilter,
  setStatusFilter,
  priceRangeFilter,
  setPriceRangeFilter,
  onClearFilters
}) => {
  return (
    <div className="room-filters-card">
      <div className="room-filters-header">
        <div className="room-filters-title">
          <Filter size={18} className="filter-icon-gold" />
          <span>Filter & Search Inventory</span>
        </div>
        <button className="clear-filters-btn" onClick={onClearFilters}>
          <RotateCcw size={14} />
          <span>Clear Filters</span>
        </button>
      </div>

      <div className="room-filters-grid">
        {/* Search input */}
        <div className="r-filter-group search-col">
          <label className="r-filter-label">Search Room</label>
          <div className="r-search-wrapper">
            <Search size={16} className="r-search-icon" />
            <input
              type="text"
              className="r-filter-input search-input"
              placeholder="Room # or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Room Type */}
        <div className="r-filter-group">
          <label className="r-filter-label">Room Type</label>
          <select
            className="r-filter-select"
            value={roomTypeFilter}
            onChange={(e) => setRoomTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        {/* Floor */}
        <div className="r-filter-group">
          <label className="r-filter-label">Floor</label>
          <select
            className="r-filter-select"
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
          >
            <option value="All">All Floors</option>
            <option value="Floor 1">Floor 1</option>
            <option value="Floor 2">Floor 2</option>
            <option value="Floor 3">Floor 3</option>
            <option value="Floor 4">Floor 4</option>
            <option value="Floor 5">Floor 5</option>
          </select>
        </div>

        {/* Status */}
        <div className="r-filter-group">
          <label className="r-filter-label">Room Status</label>
          <select
            className="r-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Vacant">Vacant</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Out of Service">Out of Service</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="r-filter-group">
          <label className="r-filter-label">Price Range</label>
          <select
            className="r-filter-select"
            value={priceRangeFilter}
            onChange={(e) => setPriceRangeFilter(e.target.value)}
          >
            <option value="All">All Prices</option>
            <option value="under5k">Under ₹5,000</option>
            <option value="5kTo8k">₹5,000 - ₹8,000</option>
            <option value="above8k">Above ₹8,000</option>
          </select>
        </div>
      </div>
    </div>
  );
};
