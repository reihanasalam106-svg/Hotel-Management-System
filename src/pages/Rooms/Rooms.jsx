import React, { useState, useMemo } from 'react';
import { useHotel } from '../../context/ReservationContext';
import { RoomSummaryCards } from '../../components/rooms/RoomSummaryCards';
import { FloorSelector } from '../../components/rooms/FloorSelector';
import { RoomFilters } from '../../components/rooms/RoomFilters';
import { RoomGrid } from '../../components/rooms/RoomGrid';
import { RoomFormModal } from '../../components/rooms/RoomFormModal';
import { RoomDetailsModal } from '../../components/rooms/RoomDetailsModal';
import { SeasonalPricingModal } from '../../components/rooms/SeasonalPricingModal';
import { LoadingState } from '../../components/common/LoadingState';
import { Plus, Tag, RefreshCw } from 'lucide-react';
import './Rooms.css';

export const Rooms = () => {
  const { rooms, changeRoomStatus, isLoading, error, refreshAllData } = useHotel();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('All');
  const [selectedFloor, setSelectedFloor] = useState('All Floors'); // From FloorSelector tab
  const [floorFilter, setFloorFilter] = useState('All');             // From filter dropdown
  const [statusFilter, setStatusFilter] = useState('All');
  const [priceRangeFilter, setPriceRangeFilter] = useState('All');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [viewingRoom, setViewingRoom] = useState(null);
  const [isSeasonalOpen, setIsSeasonalOpen] = useState(false);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setRoomTypeFilter('All');
    setSelectedFloor('All Floors');
    setFloorFilter('All');
    setStatusFilter('All');
    setPriceRangeFilter('All');
  };

  // Sync tab selection with dropdown if needed
  const handleSelectFloorTab = (floor) => {
    setSelectedFloor(floor);
    if (floor === 'All Floors') {
      setFloorFilter('All');
    } else {
      setFloorFilter(floor);
    }
  };

  // Filter Logic
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // 1. Search (number or type)
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        room.number.toLowerCase().includes(query) ||
        room.type.toLowerCase().includes(query);

      // 2. Room Type
      const matchesType =
        roomTypeFilter === 'All' ||
        room.type.toLowerCase() === roomTypeFilter.toLowerCase();

      // 3. Floor (combine tab or dropdown)
      const activeFloor = floorFilter !== 'All' ? floorFilter : selectedFloor !== 'All Floors' ? selectedFloor : 'All';
      const matchesFloor =
        activeFloor === 'All' ||
        room.floor.toLowerCase().includes(activeFloor.toLowerCase());

      // 4. Status
      const matchesStatus =
        statusFilter === 'All' ||
        room.status.toLowerCase() === statusFilter.toLowerCase();

      // 5. Price Range
      let matchesPrice = true;
      if (priceRangeFilter === 'under5k') {
        matchesPrice = room.ratePerNight < 5000;
      } else if (priceRangeFilter === '5kTo8k') {
        matchesPrice = room.ratePerNight >= 5000 && room.ratePerNight <= 8000;
      } else if (priceRangeFilter === 'above8k') {
        matchesPrice = room.ratePerNight > 8000;
      }

      return matchesSearch && matchesType && matchesFloor && matchesStatus && matchesPrice;
    });
  }, [rooms, searchTerm, roomTypeFilter, floorFilter, selectedFloor, statusFilter, priceRangeFilter]);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingRoom(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (room) => {
    setEditingRoom(room);
    setIsFormOpen(true);
  };

  const handleOpenViewModal = (room) => {
    setViewingRoom(room);
  };

  if (isLoading && rooms.length === 0) {
    return (
      <div className="rooms-management-page">
        <LoadingState label="Loading room inventory from database..." />
      </div>
    );
  }

  if (error && rooms.length === 0) {
    return (
      <div className="rooms-management-page" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
        <button onClick={refreshAllData} className="add-room-btn" style={{ margin: '0 auto' }}>
          <RefreshCw size={16} />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rooms-management-page">
      {/* PAGE HEADER SECTION */}
      <div className="rooms-page-header">
        <div className="rooms-header-titles">
          <h1 className="rooms-main-title">Room Management</h1>
          <p className="rooms-sub-title">Manage rooms, availability, pricing and maintenance status</p>
        </div>

        <div className="header-actions-group">
          <button className="seasonal-btn" onClick={() => setIsSeasonalOpen(true)}>
            <Tag size={16} />
            <span>Seasonal Pricing</span>
          </button>

          <button className="add-room-btn" onClick={handleOpenAddModal}>
            <Plus size={18} />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {/* TOP DYNAMIC SUMMARY CARDS */}
      <RoomSummaryCards rooms={rooms} />

      {/* FLOOR SELECTOR TABS */}
      <FloorSelector
        selectedFloor={selectedFloor}
        onSelectFloor={handleSelectFloorTab}
      />

      {/* FILTER & SEARCH TOOLBAR */}
      <RoomFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roomTypeFilter={roomTypeFilter}
        setRoomTypeFilter={setRoomTypeFilter}
        floorFilter={floorFilter}
        setFloorFilter={setFloorFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priceRangeFilter={priceRangeFilter}
        setPriceRangeFilter={setPriceRangeFilter}
        onClearFilters={handleClearFilters}
      />

      {/* ROOMS INVENTORY GRID */}
      <RoomGrid
        rooms={filteredRooms}
        onViewRoom={handleOpenViewModal}
        onEditRoom={handleOpenEditModal}
        onChangeStatus={changeRoomStatus}
        onClearFilters={handleClearFilters}
      />

      {/* ADD / EDIT ROOM FORM MODAL */}
      <RoomFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingRoom}
      />

      {/* VIEW ROOM DETAILS MODAL */}
      <RoomDetailsModal
        isOpen={!!viewingRoom}
        onClose={() => setViewingRoom(null)}
        room={viewingRoom}
      />

      {/* SEASONAL PRICING MODAL */}
      <SeasonalPricingModal
        isOpen={isSeasonalOpen}
        onClose={() => setIsSeasonalOpen(false)}
      />
    </div>
  );
};
