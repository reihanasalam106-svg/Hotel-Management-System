import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useHotel } from '../../context/ReservationContext';
import { AlertCircle } from 'lucide-react';
import './RoomFormModal.css';

export const RoomFormModal = ({
  isOpen,
  onClose,
  initialData = null // if provided, we are in Edit mode
}) => {
  const { addRoom, updateRoom } = useHotel();

  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'Deluxe',
    floor: 'Floor 1',
    pricePerNight: 5000,
    status: 'Vacant',
    housekeepingStatus: 'Ready',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        roomNumber: initialData.number || '',
        roomType: initialData.type || 'Deluxe',
        floor: initialData.floor || 'Floor 1',
        pricePerNight: initialData.ratePerNight || 5000,
        status: initialData.status || 'Vacant',
        housekeepingStatus: initialData.housekeepingStatus || 'Ready',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        roomNumber: '',
        roomType: 'Deluxe',
        floor: 'Floor 1',
        pricePerNight: 5000,
        status: 'Vacant',
        housekeepingStatus: 'Ready',
        description: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors = {};

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required.';
    }

    if (!formData.roomType) {
      newErrors.roomType = 'Room type is required.';
    }

    if (!formData.floor) {
      newErrors.floor = 'Floor selection is required.';
    }

    if (!formData.pricePerNight || Number(formData.pricePerNight) <= 0) {
      newErrors.pricePerNight = 'Price per night must be greater than 0.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (initialData) {
      updateRoom(initialData.id, formData);
      onClose();
    } else {
      const result = addRoom(formData);
      if (!result.success) {
        setErrors({ roomNumber: result.error });
      } else {
        onClose();
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Room ${initialData.number}` : 'Add New Room'}
      maxWidth="620px"
    >
      <form onSubmit={handleSubmit} className="room-form">
        <div className="room-form-grid-2">
          {/* Room Number */}
          <div className="r-form-field">
            <label className="r-form-label required">Room Number</label>
            <input
              type="text"
              className={`r-form-control ${errors.roomNumber ? 'is-invalid' : ''}`}
              placeholder="e.g. 105 or 206"
              disabled={!!initialData}
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            />
            {errors.roomNumber && (
              <span className="r-field-error">
                <AlertCircle size={12} /> {errors.roomNumber}
              </span>
            )}
          </div>

          {/* Room Type */}
          <div className="r-form-field">
            <label className="r-form-label required">Room Type</label>
            <select
              className={`r-form-select ${errors.roomType ? 'is-invalid' : ''}`}
              value={formData.roomType}
              onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
            >
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
        </div>

        <div className="room-form-grid-2">
          {/* Floor */}
          <div className="r-form-field">
            <label className="r-form-label required">Floor</label>
            <select
              className={`r-form-select ${errors.floor ? 'is-invalid' : ''}`}
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
            >
              <option value="Floor 1">Floor 1</option>
              <option value="Floor 2">Floor 2</option>
              <option value="Floor 3">Floor 3</option>
              <option value="Floor 4">Floor 4</option>
              <option value="Floor 5">Floor 5</option>
            </select>
          </div>

          {/* Price Per Night */}
          <div className="r-form-field">
            <label className="r-form-label required">Price Per Night (₹)</label>
            <input
              type="number"
              min="100"
              step="100"
              className={`r-form-control ${errors.pricePerNight ? 'is-invalid' : ''}`}
              value={formData.pricePerNight}
              onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
            />
            {errors.pricePerNight && (
              <span className="r-field-error">
                <AlertCircle size={12} /> {errors.pricePerNight}
              </span>
            )}
          </div>
        </div>

        <div className="room-form-grid-2">
          {/* Status */}
          <div className="r-form-field">
            <label className="r-form-label">Initial Room Status</label>
            <select
              className="r-form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Vacant">Vacant</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>

          {/* Housekeeping Status */}
          <div className="r-form-field">
            <label className="r-form-label">Housekeeping Status</label>
            <select
              className="r-form-select"
              value={formData.housekeepingStatus}
              onChange={(e) => setFormData({ ...formData, housekeepingStatus: e.target.value })}
            >
              <option value="Ready">Ready</option>
              <option value="Cleaning Required">Cleaning Required</option>
              <option value="Cleaning In Progress">Cleaning In Progress</option>
              <option value="Cleaned">Cleaned</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="r-form-field">
          <label className="r-form-label">Room Description</label>
          <textarea
            rows="3"
            className="r-form-control"
            placeholder="Room features, view, bed type..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Action Buttons */}
        <div className="room-form-actions">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {initialData ? 'Save Changes' : 'Add Room'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
