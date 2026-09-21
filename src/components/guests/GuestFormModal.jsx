import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { User, MapPin, CreditCard, Info } from 'lucide-react';
import './GuestFormModal.css';

export const GuestFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    nationality: 'Indian',
    address: '',
    city: '',
    state: '',
    pincode: '',
    idType: 'Aadhaar',
    idNumber: '',
    guestType: 'New Guest',
    preferences: '',
    specialRequests: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || initialData.fullName || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        dateOfBirth: initialData.dateOfBirth || '',
        nationality: initialData.nationality || 'Indian',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        pincode: initialData.pincode || '',
        idType: initialData.idType || 'Aadhaar',
        idNumber: initialData.idNumber || '',
        guestType: initialData.guestType || 'New Guest',
        preferences: initialData.preferences || '',
        specialRequests: initialData.specialRequests || ''
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        dateOfBirth: '',
        nationality: 'Indian',
        address: '',
        city: '',
        state: '',
        pincode: '',
        idType: 'Aadhaar',
        idNumber: '',
        guestType: 'New Guest',
        preferences: '',
        specialRequests: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address format.';
      }
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'ID number is required.';
    }

    if (formData.pincode.trim() && !/^\d{4,8}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Pincode must be 4 to 8 numeric digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Guest Details' : 'Add New Guest'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="guest-form">
        {/* Section 1: Personal Information */}
        <div className="form-section">
          <div className="form-section-header">
            <User size={18} className="form-section-icon" />
            <span className="form-section-title">Personal Information</span>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="name">Full Name <span className="req">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="e.g. Arun Kumar"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="invalid-feedback">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number <span className="req">*</span></label>
              <input
                type="text"
                id="phone"
                name="phone"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                placeholder="e.g. +91 90000 00001"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="invalid-feedback">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label htmlFor="email">Email Address <span className="req">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="e.g. guest@email.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="invalid-feedback">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                className="form-control"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="nationality">Nationality</label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                className="form-control"
                placeholder="e.g. Indian"
                value={formData.nationality}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Address */}
        <div className="form-section">
          <div className="form-section-header">
            <MapPin size={18} className="form-section-icon" />
            <span className="form-section-title">Address</span>
          </div>

          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-control"
              placeholder="e.g. 12 MG Road"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                className="form-control"
                placeholder="e.g. Chennai"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                className="form-control"
                placeholder="e.g. Tamil Nadu"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="pincode">Pincode</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
                placeholder="e.g. 600001"
                value={formData.pincode}
                onChange={handleChange}
              />
              {errors.pincode && <span className="invalid-feedback">{errors.pincode}</span>}
            </div>
          </div>
        </div>

        {/* Section 3: Identification */}
        <div className="form-section">
          <div className="form-section-header">
            <CreditCard size={18} className="form-section-icon" />
            <span className="form-section-title">Identification</span>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="idType">ID Type <span className="req">*</span></label>
              <select
                id="idType"
                name="idType"
                className="form-control"
                value={formData.idType}
                onChange={handleChange}
              >
                <option value="Aadhaar">Aadhaar</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="idNumber">ID Number <span className="req">*</span></label>
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                className={`form-control ${errors.idNumber ? 'is-invalid' : ''}`}
                placeholder="e.g. XXXX-XXXX-1001"
                value={formData.idNumber}
                onChange={handleChange}
              />
              {errors.idNumber && <span className="invalid-feedback">{errors.idNumber}</span>}
            </div>
          </div>
        </div>

        {/* Section 4: Guest Information */}
        <div className="form-section">
          <div className="form-section-header">
            <Info size={18} className="form-section-icon" />
            <span className="form-section-title">Guest Information</span>
          </div>

          <div className="form-group">
            <label htmlFor="guestType">Guest Type</label>
            <select
              id="guestType"
              name="guestType"
              className="form-control"
              value={formData.guestType}
              onChange={handleChange}
            >
              <option value="New Guest">New Guest</option>
              <option value="Returning Guest">Returning Guest</option>
            </select>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="preferences">Preferences</label>
              <textarea
                id="preferences"
                name="preferences"
                rows="2"
                className="form-control"
                placeholder="e.g. Non-smoking room, High floor"
                value={formData.preferences}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialRequests">Special Requests</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                rows="2"
                className="form-control"
                placeholder="e.g. Late check-in, Extra pillows"
                value={formData.specialRequests}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="guest-form-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEdit ? 'Save Changes' : 'Add Guest'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
