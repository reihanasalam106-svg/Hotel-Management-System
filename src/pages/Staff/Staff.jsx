import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingState } from '../../components/common/LoadingState';
import { UserPlus, Users, RotateCcw, Activity, ShieldAlert, RefreshCw } from 'lucide-react';
import { useReservations } from '../../context/ReservationContext';
import { useAuth } from '../../context/AuthContext';

import { StaffSummaryCards } from '../../components/staff/StaffSummaryCards';
import { StaffFilters } from '../../components/staff/StaffFilters';
import { StaffTable } from '../../components/staff/StaffTable';
import { StaffFormModal } from '../../components/staff/StaffFormModal';
import { StaffDetailsModal } from '../../components/staff/StaffDetailsModal';
import { StaffActivitySection } from '../../components/reports/StaffActivitySection';

export const Staff = () => {
  const { hasRole } = useAuth();
  const isAuthorized = hasRole('Admin', 'Manager');

  const {
    staff = [],
    housekeepingTasks = [],
    addStaff,
    updateStaff,
    changeStaffStatus,
    deactivateStaff,
    isLoading,
    error,
    refreshAllData
  } = useReservations();

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [shiftFilter, setShiftFilter] = useState('All');

  // Sorting State
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [viewingStaff, setViewingStaff] = useState(null);

  // Apply filters handler
  const handleApplyFilters = () => {
    setActiveSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  // Clear filters handler
  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveSearchTerm('');
    setRoleFilter('All');
    setDeptFilter('All');
    setStatusFilter('All');
    setShiftFilter('All');
    setCurrentPage(1);
  };

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Calculate dynamic assigned task counts for staff
  const staffWithTasks = useMemo(() => {
    return staff.map((s) => {
      const assignedCount = housekeepingTasks.filter(
        (t) =>
          (t.staffId && t.staffId === s.id) ||
          (t.staff && t.staff.toLowerCase().includes(s.name.split(' ')[0].toLowerCase()))
      ).length;
      return {
        ...s,
        assignedTasks: assignedCount || s.assignedTasks || 0
      };
    });
  }, [staff, housekeepingTasks]);

  // Filter & Sort Pipeline
  const filteredAndSortedStaff = useMemo(() => {
    return staffWithTasks
      .filter((member) => {
        // Search Term Filter (Name, Phone, Email)
        const term = (activeSearchTerm || searchTerm).toLowerCase().trim();
        if (term) {
          const matchName = (member.name || '').toLowerCase().includes(term);
          const matchPhone = (member.phone || '').includes(term);
          const matchEmail = (member.email || '').toLowerCase().includes(term);
          const matchId = (member.id || '').toLowerCase().includes(term);
          if (!matchName && !matchPhone && !matchEmail && !matchId) return false;
        }

        // Role Filter
        if (roleFilter !== 'All' && member.role !== roleFilter) return false;

        // Department Filter
        if (deptFilter !== 'All' && member.department !== deptFilter) return false;

        // Status Filter
        if (statusFilter !== 'All' && member.status !== statusFilter) return false;

        // Shift Filter
        if (shiftFilter !== 'All' && member.shift !== shiftFilter) return false;

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [staffWithTasks, searchTerm, activeSearchTerm, roleFilter, deptFilter, statusFilter, shiftFilter, sortField, sortOrder]);

  // Pagination Slice
  const totalItems = filteredAndSortedStaff.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const displayedStaff = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedStaff.slice(start, start + pageSize);
  }, [filteredAndSortedStaff, currentPage, pageSize]);

  // Form Submissions
  const handleAddStaffSubmit = (formData) => {
    addStaff(formData);
    setIsAddModalOpen(false);
  };

  const handleEditStaffSubmit = (formData) => {
    if (editingStaff) {
      updateStaff(editingStaff.id, formData);
      setEditingStaff(null);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="module-page" style={{ padding: '3rem', textAlign: 'center' }}>
        <ShieldAlert size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Access Denied</h2>
        <p style={{ color: '#94a3b8' }}>Only Administrators and Managers have permission to view or manage staff records.</p>
      </div>
    );
  }

  if (isLoading && staff.length === 0) {
    return (
      <div className="module-page">
        <LoadingState label="Loading staff directory from database..." />
      </div>
    );
  }

  if (error && staff.length === 0) {
    return (
      <div className="module-page" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
        <Button onClick={refreshAllData} variant="primary" icon={RefreshCw}>
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="module-page">
      {/* 1. Page Header */}
      <PageHeader
        title="Staff Management"
        description="Manage hotel staff, roles, shifts and operational activity."
        action={
          <Button variant="primary" icon={UserPlus} onClick={() => setIsAddModalOpen(true)}>
            + Add Staff
          </Button>
        }
      />

      {/* 2. Staff Summary Cards */}
      <StaffSummaryCards staff={staffWithTasks} />

      {/* 3. Search and Filters Toolbar */}
      <StaffFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        deptFilter={deptFilter}
        setDeptFilter={setDeptFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        shiftFilter={shiftFilter}
        setShiftFilter={setShiftFilter}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* 4. Staff Table / Empty State */}
      {displayedStaff.length > 0 ? (
        <>
          <StaffTable
            staffList={displayedStaff}
            onViewStaff={(s) => setViewingStaff(s)}
            onEditStaff={(s) => setEditingStaff(s)}
            onChangeStatus={(id, status) => changeStaffStatus(id, status)}
            onDeactivateStaff={(id) => deactivateStaff(id)}
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
          title="No staff members found"
          description="Try changing your search keywords or filter options."
          action={
            <Button variant="outline" icon={RotateCcw} onClick={handleClearFilters}>
              Clear Filters
            </Button>
          }
        />
      )}

      {/* 5. Recent Staff Activity Section */}
      <div style={{ marginTop: '2rem' }}>
        <StaffActivitySection />
      </div>

      {/* Add Staff Modal */}
      <StaffFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddStaffSubmit}
      />

      {/* Edit Staff Modal */}
      {editingStaff && (
        <StaffFormModal
          isOpen={Boolean(editingStaff)}
          onClose={() => setEditingStaff(null)}
          onSubmit={handleEditStaffSubmit}
          initialData={editingStaff}
        />
      )}

      {/* View Staff Profile Drawer/Modal */}
      {viewingStaff && (
        <StaffDetailsModal
          isOpen={Boolean(viewingStaff)}
          onClose={() => setViewingStaff(null)}
          staffMember={viewingStaff}
          housekeepingTasks={housekeepingTasks}
          onChangeStatus={(id, status) => changeStaffStatus(id, status)}
          onDeactivate={(id) => deactivateStaff(id)}
        />
      )}
    </div>
  );
};

export default Staff;
