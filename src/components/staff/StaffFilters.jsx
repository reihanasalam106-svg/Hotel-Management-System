import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import { Button } from '../common/Button';
import './StaffFilters.css';

export const StaffFilters = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  deptFilter,
  setDeptFilter,
  statusFilter,
  setStatusFilter,
  shiftFilter,
  setShiftFilter,
  onApplyFilters,
  onClearFilters
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onApplyFilters) {
      onApplyFilters();
    }
  };

  return (
    <div className="staff-filters-toolbar">
      <div className="staff-filters-left">
        {/* Search Input */}
        <div className="staff-search-box">
          <Search size={18} className="staff-search-icon" />
          <input
            type="text"
            className="staff-search-input"
            placeholder="Search staff by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Role Filter */}
        <div className="staff-filter-group">
          <label htmlFor="roleFilter">Role</label>
          <select
            id="roleFilter"
            className="staff-filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Accountant">Accountant</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Security">Security</option>
          </select>
        </div>

        {/* Department Filter */}
        <div className="staff-filter-group">
          <label htmlFor="deptFilter">Department</label>
          <select
            id="deptFilter"
            className="staff-filter-select"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Management">Management</option>
            <option value="Front Office">Front Office</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Finance">Finance</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Security">Security</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="staff-filter-group">
          <label htmlFor="statusFilter">Status</label>
          <select
            id="statusFilter"
            className="staff-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Duty">On Duty</option>
            <option value="Off Duty">Off Duty</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Shift Filter */}
        <div className="staff-filter-group">
          <label htmlFor="shiftFilter">Shift</label>
          <select
            id="shiftFilter"
            className="staff-filter-select"
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
          >
            <option value="All">All Shifts</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Night">Night</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      <div className="staff-filters-right">
        <Button variant="primary" size="md" icon={Filter} onClick={onApplyFilters}>
          Apply
        </Button>
        <Button variant="outline" size="md" icon={RotateCcw} onClick={onClearFilters}>
          Clear
        </Button>
      </div>
    </div>
  );
};
