import React from 'react';
import { Filter, RotateCcw, Calendar } from 'lucide-react';
import { Button } from '../common/Button';
import './ReportFilters.css';

export const ReportFilters = ({
  filters,
  setFilters,
  onApplyFilters,
  onResetFilters
}) => {
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="report-filters-bar no-print">
      <div className="report-filters-group-left">
        {/* Date Range */}
        <div className="report-filter-item">
          <label htmlFor="dateRange">
            <Calendar size={13} /> Date Range
          </label>
          <select
            id="dateRange"
            name="dateRange"
            className="report-filter-select"
            value={filters.dateRange}
            onChange={handleSelectChange}
          >
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="This Year">This Year</option>
            <option value="Custom Range">Custom Range</option>
          </select>
        </div>

        {/* Room Type */}
        <div className="report-filter-item">
          <label htmlFor="roomType">Room Type</label>
          <select
            id="roomType"
            name="roomType"
            className="report-filter-select"
            value={filters.roomType}
            onChange={handleSelectChange}
          >
            <option value="All">All Room Types</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        {/* Booking Source */}
        <div className="report-filter-item">
          <label htmlFor="bookingSource">Booking Source</label>
          <select
            id="bookingSource"
            name="bookingSource"
            className="report-filter-select"
            value={filters.bookingSource}
            onChange={handleSelectChange}
          >
            <option value="All">All Sources</option>
            <option value="Direct">Direct</option>
            <option value="OTA">OTA</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Corporate">Corporate</option>
          </select>
        </div>

        {/* Payment Method */}
        <div className="report-filter-item">
          <label htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            className="report-filter-select"
            value={filters.paymentMethod}
            onChange={handleSelectChange}
          >
            <option value="All">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
      </div>

      <div className="report-filters-group-right">
        <Button variant="primary" size="md" icon={Filter} onClick={onApplyFilters}>
          Apply Filters
        </Button>
        <Button variant="outline" size="md" icon={RotateCcw} onClick={onResetFilters}>
          Reset
        </Button>
      </div>
    </div>
  );
};
