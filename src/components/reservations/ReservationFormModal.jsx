import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useReservations } from '../../context/ReservationContext';
import { Calculator, AlertCircle } from 'lucide-react';
import './ReservationFormModal.css';

export const ReservationFormModal = ({
  isOpen,
  onClose,
  initialData = null // if provided, we are in Edit mode
}) => {
  const { rooms, addReservation, updateReservation } = useReservations();

  const [formData, setFormData] = useState({
    guestName: '',
    phone: '',
    email: '',
    roomType: 'Deluxe',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    paymentStatus: 'Pending',
    specialRequest: ''
  });

  const [errors, setErrors] = useState({});

  // Initialize form state on open / edit
  useEffect(() => {
    if (initialData) {
      setFormData({
        guestName: initialData.guestName || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        roomType: initialData.roomType || 'Deluxe',
        roomNumber: initialData.roomNumber || '',
        checkIn: initialData.checkIn || '',
        checkOut: initialData.checkOut || '',
        guests: initialData.guests || 2,
        paymentStatus: initialData.paymentStatus || 'Pending',
        specialRequest: initialData.specialRequest || ''
      });
    } else {
      // Default dates: today and 2 days later
      const today = new Date().toISOString().split('T')[0];
      const dayAfter = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      // Default room number from available Deluxe rooms
      const defaultRoom = rooms.find((r) => r.type === 'Deluxe') || rooms[0];

      setFormData({
        guestName: '',
        phone: '',
        email: '',
        roomType: 'Deluxe',
        roomNumber: defaultRoom ? defaultRoom.number : '',
        checkIn: today,
        checkOut: dayAfter,
        guests: 2,
        paymentStatus: 'Pending',
        specialRequest: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen, rooms]);

  // Available rooms based on roomType
  const availableRoomsForType = rooms.filter(
    (r) =>
      r.type === formData.roomType &&
      (r.status === 'Vacant' || (initialData && initialData.roomNumber === r.number))
  );

  // If selected roomType changes, auto-select first available room for that type
  const handleRoomTypeChange = (e) => {
    const newType = e.target.value;
    const roomsOfType = rooms.filter(
      (r) =>
        r.type === newType &&
        (r.status === 'Vacant' || (initialData && initialData.roomNumber === r.number))
    );
    setFormData((prev) => ({
      ...prev,
      roomType: newType,
      roomNumber: roomsOfType.length > 0 ? roomsOfType[0].number : ''
    }));
  };

  // Calculate Nights & Total Amount
  const calculateCalculationDetails = () => {
    if (!formData.checkIn || !formData.checkOut) {
      return { nights: 0, pricePerNight: 0, totalAmount: 0 };
    }
    const cIn = new Date(formData.checkIn);
    const cOut = new Date(formData.checkOut);
    const timeDiff = cOut.getTime() - cIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const roomObj = rooms.find((r) => r.number === formData.roomNumber);
    const pricePerNight = roomObj ? roomObj.ratePerNight : 5000;
    const totalAmount = nights > 0 ? nights * pricePerNight : 0;

    return { nights: Math.max(0, nights), pricePerNight, totalAmount };
  };

  const calcDetails = calculateCalculationDetails();

  // Validate form inputs
  const validate = () => {
    const newErrors = {};

    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Guest name is required.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    }

    if (!formData.roomType) {
      newErrors.roomType = 'Please select a room type.';
    }

    if (!formData.roomNumber) {
      newErrors.roomNumber = 'Please select an available room.';
    }

    if (!formData.checkIn) {
      newErrors.checkIn = 'Check-in date is required.';
    }

    if (!formData.checkOut) {
      newErrors.checkOut = 'Check-out date is required.';
    }

    if (formData.checkIn && formData.checkOut) {
      const cIn = new Date(formData.checkIn);
      const cOut = new Date(formData.checkOut);
      if (cOut <= cIn) {
        newErrors.checkOut = 'Check-out date must be after check-in date.';
      }
    }

    if (Number(formData.guests) < 1) {
      newErrors.guests = 'Number of guests must be at least 1.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (initialData) {
      updateReservation(initialData.id, formData);
    } else {
      addReservation(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Reservation — ${initialData.id}` : 'Create New Reservation'}
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit} className="reservation-form">
        {/* SECTION 1: GUEST INFORMATION */}
        <div className="form-section">
          <h4 className="form-section-title">Guest Information</h4>
          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label required">Guest Full Name</label>
              <input
                type="text"
                className={`form-control ${errors.guestName ? 'is-invalid' : ''}`}
                placeholder="e.g. Aarav Sharma"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
              />
              {errors.guestName && (
                <span className="field-error-msg">
                  <AlertCircle size={12} /> {errors.guestName}
                </span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label required">Phone Number</label>
              <input
                type="text"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {errors.phone && (
                <span className="field-error-msg">
                  <AlertCircle size={12} /> {errors.phone}
                </span>
              )}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Email Address (Optional)</label>
            <input
              type="email"
              className="form-control"
              placeholder="guest@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {/* SECTION 2: STAY INFORMATION */}
        <div className="form-section">
          <h4 className="form-section-title">Stay & Room Details</h4>
          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label required">Room Type</label>
              <select
                className="form-select"
                value={formData.roomType}
                onChange={handleRoomTypeChange}
              >
                <option value="Deluxe">Deluxe (₹4,000 - ₹6,000/night)</option>
                <option value="Suite">Suite (₹8,000 - ₹12,000/night)</option>
                <option value="Premium">Premium (₹7,000 - ₹7,500/night)</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label required">Select Room</label>
              <select
                className={`form-select ${errors.roomNumber ? 'is-invalid' : ''}`}
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              >
                {availableRoomsForType.length === 0 ? (
                  <option value="">No vacant rooms available</option>
                ) : (
                  availableRoomsForType.map((r) => (
                    <option key={r.id} value={r.number}>
                      Room {r.number} ({r.floor}) — ₹{r.ratePerNight.toLocaleString()}/night
                    </option>
                  ))
                )}
              </select>
              {errors.roomNumber && (
                <span className="field-error-msg">
                  <AlertCircle size={12} /> {errors.roomNumber}
                </span>
              )}
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-field">
              <label className="form-label required">Check-in Date</label>
              <input
                type="date"
                className={`form-control ${errors.checkIn ? 'is-invalid' : ''}`}
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
              />
              {errors.checkIn && (
                <span className="field-error-msg">
                  <AlertCircle size={12} /> {errors.checkIn}
                </span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label required">Check-out Date</label>
              <input
                type="date"
                className={`form-control ${errors.checkOut ? 'is-invalid' : ''}`}
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
              />
              {errors.checkOut && (
                <span className="field-error-msg">
                  <AlertCircle size={12} /> {errors.checkOut}
                </span>
              )}
            </div>

            <div className="form-field">
              <label className="form-label required">Number of Guests</label>
              <input
                type="number"
                min="1"
                max="10"
                className={`form-control ${errors.guests ? 'is-invalid' : ''}`}
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              />
              {errors.guests && (
                <span className="field-error-msg">
                  <AlertCircle size={12} /> {errors.guests}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: AUTOMATIC AMOUNT CALCULATION BOX */}
        <div className="amount-calc-box">
          <div className="calc-header">
            <Calculator size={18} className="calc-icon" />
            <span>Estimated Billing Summary</span>
          </div>
          <div className="calc-grid">
            <div className="calc-item">
              <span className="calc-label">Room Rate / Night</span>
              <span className="calc-value">₹{calcDetails.pricePerNight.toLocaleString('en-IN')}</span>
            </div>
            <div className="calc-item">
              <span className="calc-label">Duration</span>
              <span className="calc-value">{calcDetails.nights} Night(s)</span>
            </div>
            <div className="calc-item highlight">
              <span className="calc-label">Total Estimated Amount</span>
              <span className="calc-total">₹{calcDetails.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: BOOKING DETAILS */}
        <div className="form-section">
          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label">Payment Status</label>
              <select
                className="form-select"
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Special Requests</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Airport pick-up, High floor"
                value={formData.specialRequest}
                onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* FORM BUTTONS */}
        <div className="form-actions">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {initialData ? 'Save Changes' : 'Confirm Reservation'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
