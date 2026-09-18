import React, { useState, useMemo } from 'react';
import { useHotel } from '../../context/ReservationContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, ClipboardList } from 'lucide-react';

import { HousekeepingSummaryCards } from '../../components/housekeeping/HousekeepingSummaryCards';
import { HousekeepingDashboardView } from '../../components/housekeeping/HousekeepingDashboardView';
import { HousekeepingFilters } from '../../components/housekeeping/HousekeepingFilters';
import { HousekeepingTable } from '../../components/housekeeping/HousekeepingTable';
import { RoomHousekeepingCard } from '../../components/housekeeping/RoomHousekeepingCard';
import { HousekeepingTaskForm } from '../../components/housekeeping/HousekeepingTaskForm';
import { TaskDetailsModal } from '../../components/housekeeping/TaskDetailsModal';
import { StaffWorkloadDrawer } from '../../components/housekeeping/StaffWorkloadDrawer';
import { ReassignStaffModal } from '../../components/housekeeping/ReassignStaffModal';
import '../../components/housekeeping/Housekeeping.css';

export const Housekeeping = () => {
  const {
    rooms,
    housekeepingTasks,
    housekeepingStaff,
    addHousekeepingTask,
    updateHousekeepingTask,
    updateHousekeepingTaskStatus,
    reassignTaskStaff,
    deleteHousekeepingTask
  } = useHotel();

  // View state
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('ALL');
  const [selectedRoomType, setSelectedRoomType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  // Sorting state
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // Modal & Drawer states
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [selectedDetailTask, setSelectedDetailTask] = useState(null);
  const [selectedStaffForDrawer, setSelectedStaffForDrawer] = useState(null);
  const [reassignModalTask, setReassignModalTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  // Filter handlers
  const handleApplySearch = () => {
    setActiveSearch(searchQuery.trim().toLowerCase());
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveSearch('');
    setSelectedFloor('ALL');
    setSelectedRoomType('ALL');
    setSelectedStatus('ALL');
    setSelectedPriority('ALL');
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

  // Filter tasks logic
  const filteredTasks = useMemo(() => {
    return housekeepingTasks.filter((task) => {
      const roomObj = rooms.find((r) => r.number === String(task.roomNumber));
      const staffObj = housekeepingStaff.find((s) => s.id === task.assignedStaffId);
      const staffName = staffObj ? staffObj.name.toLowerCase() : '';
      const guestName = roomObj && roomObj.currentGuest ? roomObj.currentGuest.toLowerCase() : '';
      const roomType = roomObj ? roomObj.type : '';
      const floor = roomObj ? roomObj.floor : '';

      // Combined Search term check (room number, guest name, staff name, task ID)
      if (activeSearch) {
        const matchesRoom = String(task.roomNumber).toLowerCase().includes(activeSearch);
        const matchesGuest = guestName.includes(activeSearch);
        const matchesStaff = staffName.includes(activeSearch);
        const matchesId = task.id.toLowerCase().includes(activeSearch);
        if (!matchesRoom && !matchesGuest && !matchesStaff && !matchesId) {
          return false;
        }
      }

      // Floor Filter
      if (selectedFloor !== 'ALL' && floor !== selectedFloor) {
        return false;
      }

      // Room Type Filter
      if (selectedRoomType !== 'ALL' && roomType !== selectedRoomType) {
        return false;
      }

      // Housekeeping Status Filter
      if (selectedStatus !== 'ALL' && task.status !== selectedStatus) {
        return false;
      }

      // Priority Filter
      if (selectedPriority !== 'ALL' && task.priority !== selectedPriority) {
        return false;
      }

      return true;
    });
  }, [
    housekeepingTasks,
    rooms,
    housekeepingStaff,
    activeSearch,
    selectedFloor,
    selectedRoomType,
    selectedStatus,
    selectedPriority
  ]);

  // Sorting logic
  const sortedTasks = useMemo(() => {
    const priorityWeight = { Urgent: 4, High: 3, Medium: 2, Low: 1 };

    return [...filteredTasks].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'roomNumber') {
        valA = Number(a.roomNumber) || 0;
        valB = Number(b.roomNumber) || 0;
      } else if (sortField === 'priority') {
        valA = priorityWeight[a.priority] || 0;
        valB = priorityWeight[b.priority] || 0;
      } else if (sortField === 'staff') {
        const staffA = housekeepingStaff.find((s) => s.id === a.assignedStaffId)?.name || '';
        const staffB = housekeepingStaff.find((s) => s.id === b.assignedStaffId)?.name || '';
        valA = staffA;
        valB = staffB;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTasks, sortField, sortOrder, housekeepingStaff]);

  // Pagination logic
  const totalPages = Math.ceil(sortedTasks.length / pageSize) || 1;
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTasks.slice(start, start + pageSize);
  }, [sortedTasks, currentPage, pageSize]);

  // Filtered rooms for grid view
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      if (selectedFloor !== 'ALL' && r.floor !== selectedFloor) return false;
      if (selectedRoomType !== 'ALL' && r.type !== selectedRoomType) return false;
      if (selectedStatus !== 'ALL' && r.housekeepingStatus !== selectedStatus) return false;
      if (activeSearch) {
        const matchesRoom = String(r.number).includes(activeSearch);
        const matchesGuest = r.currentGuest && r.currentGuest.toLowerCase().includes(activeSearch);
        if (!matchesRoom && !matchesGuest) return false;
      }
      return true;
    });
  }, [rooms, selectedFloor, selectedRoomType, selectedStatus, activeSearch]);

  // Form Submit Handler
  const handleTaskFormSubmit = (taskData) => {
    if (editingTask) {
      updateHousekeepingTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      addHousekeepingTask(taskData);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingTask) {
      deleteHousekeepingTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  return (
    <div className="module-page housekeeping-container">
      {/* 1. Page Header */}
      <PageHeader
        title="Housekeeping"
        description="Monitor room cleaning, housekeeping tasks and room readiness."
        action={
          <Button variant="primary" icon={Plus} onClick={handleOpenCreateModal}>
            Create Task
          </Button>
        }
      />

      {/* 2. Summary Cards */}
      <HousekeepingSummaryCards rooms={rooms} />

      {/* 3. Housekeeping Operational Dashboard View */}
      <HousekeepingDashboardView
        rooms={rooms}
        tasks={housekeepingTasks}
        staff={housekeepingStaff}
        onSelectStaff={(staffMember) => setSelectedStaffForDrawer(staffMember)}
      />

      {/* 4. Filter Toolbar & View Switcher */}
      <HousekeepingFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFloor={selectedFloor}
        onFloorChange={setSelectedFloor}
        selectedRoomType={selectedRoomType}
        onRoomTypeChange={setSelectedRoomType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        onClearFilters={handleClearFilters}
        onApplySearch={handleApplySearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 5. Main Content (Table View OR Room Grid View) */}
      {viewMode === 'table' ? (
        paginatedTasks.length > 0 ? (
          <>
            <HousekeepingTable
              tasks={paginatedTasks}
              rooms={rooms}
              staff={housekeepingStaff}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              onViewTask={(task) => setSelectedDetailTask(task)}
              onEditTask={handleOpenEditModal}
              onChangeStatus={(taskId, newStatus) => updateHousekeepingTaskStatus(taskId, newStatus)}
              onReassignStaff={(task) => setReassignModalTask(task)}
              onDeleteTask={(task) => setDeletingTask(task)}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={sortedTasks.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="No housekeeping tasks found"
            description="Try changing your filters or create a new housekeeping task."
            actionLabel="Create Task"
            onAction={handleOpenCreateModal}
          />
        )
      ) : (
        /* Room Grid View Option */
        filteredRooms.length > 0 ? (
          <div className="hk-grid-view">
            {filteredRooms.map((room) => (
              <RoomHousekeepingCard
                key={room.id}
                room={room}
                tasks={housekeepingTasks}
                staff={housekeepingStaff}
                onClick={(r, task) => {
                  if (task) {
                    setSelectedDetailTask(task);
                  } else {
                    handleOpenCreateModal();
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="No housekeeping tasks found"
            description="Try changing your filters or create a new housekeeping task."
            actionLabel="Create Task"
            onAction={handleOpenCreateModal}
          />
        )
      )}

      {/* MODALS AND DRAWERS */}

      {/* Create / Edit Form Modal */}
      <HousekeepingTaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleTaskFormSubmit}
        initialData={editingTask}
        rooms={rooms}
        staff={housekeepingStaff}
      />

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={!!selectedDetailTask}
        onClose={() => setSelectedDetailTask(null)}
        task={selectedDetailTask}
        rooms={rooms}
        staff={housekeepingStaff}
        onChangeStatus={(taskId, newStatus) => updateHousekeepingTaskStatus(taskId, newStatus)}
        onEditTask={handleOpenEditModal}
        onDeleteTask={(task) => setDeletingTask(task)}
      />

      {/* Staff Workload Drawer */}
      <StaffWorkloadDrawer
        isOpen={!!selectedStaffForDrawer}
        onClose={() => setSelectedStaffForDrawer(null)}
        staffMember={selectedStaffForDrawer}
        tasks={housekeepingTasks}
        rooms={rooms}
        onViewTask={(task) => setSelectedDetailTask(task)}
      />

      {/* Reassign Staff Modal */}
      <ReassignStaffModal
        isOpen={!!reassignModalTask}
        onClose={() => setReassignModalTask(null)}
        task={reassignModalTask}
        staff={housekeepingStaff}
        onReassign={(taskId, newStaffId) => reassignTaskStaff(taskId, newStaffId)}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Housekeeping Task"
        message="Are you sure you want to delete this housekeeping task?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default Housekeeping;
