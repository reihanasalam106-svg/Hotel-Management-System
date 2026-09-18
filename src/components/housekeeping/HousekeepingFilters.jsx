import React from 'react';
import { SearchBar } from '../common/SearchBar';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Search, RotateCcw, LayoutGrid, Table as TableIcon } from 'lucide-react';
import './Housekeeping.css';

export const HousekeepingFilters = ({
  searchQuery,
  onSearchChange,
  selectedFloor,
  onFloorChange,
  selectedRoomType,
  onRoomTypeChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  onClearFilters,
  onApplySearch,
  viewMode,
  onViewModeChange
}) => {
  const floorOptions = [
    { value: 'ALL', label: 'All Floors' },
    { value: 'Floor 1', label: 'Floor 1' },
    { value: 'Floor 2', label: 'Floor 2' },
    { value: 'Floor 3', label: 'Floor 3' },
    { value: 'Floor 4', label: 'Floor 4' },
    { value: 'Floor 5', label: 'Floor 5' }
  ];

  const roomTypeOptions = [
    { value: 'ALL', label: 'All Room Types' },
    { value: 'Standard', label: 'Standard' },
    { value: 'Deluxe', label: 'Deluxe' },
    { value: 'Suite', label: 'Suite' },
    { value: 'Premium', label: 'Premium' }
  ];

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'Ready', label: 'Ready' },
    { value: 'Cleaning Required', label: 'Cleaning Required' },
    { value: 'Cleaning In Progress', label: 'Cleaning In Progress' },
    { value: 'Cleaned', label: 'Cleaned' },
    { value: 'Maintenance', label: 'Maintenance' }
  ];

  const priorityOptions = [
    { value: 'ALL', label: 'All Priorities' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Urgent', label: 'Urgent' }
  ];

  return (
    <div className="hk-filter-toolbar">
      <div className="hk-toolbar-header">
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
          Filter Housekeeping Operations
        </div>
        <div className="view-toggle-btns">
          <button
            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => onViewModeChange('table')}
          >
            <TableIcon size={14} />
            Table View
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
          >
            <LayoutGrid size={14} />
            Room Grid
          </button>
        </div>
      </div>

      <div className="hk-filter-row">
        <div className="hk-search-item">
          <SearchBar
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search room number, guest name, staff name, or task ID..."
          />
        </div>

        <div className="hk-filter-item">
          <Select
            value={selectedFloor}
            onChange={(e) => onFloorChange(e.target.value)}
            options={floorOptions}
          />
        </div>

        <div className="hk-filter-item">
          <Select
            value={selectedRoomType}
            onChange={(e) => onRoomTypeChange(e.target.value)}
            options={roomTypeOptions}
          />
        </div>

        <div className="hk-filter-item">
          <Select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            options={statusOptions}
          />
        </div>

        <div className="hk-filter-item">
          <Select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            options={priorityOptions}
          />
        </div>

        <div className="hk-filter-actions">
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
