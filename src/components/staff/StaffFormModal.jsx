import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { User, Briefcase, PhoneCall, FileText } from 'lucide-react';

export const StaffFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    role: 'Receptionist',
    department: 'Front Office',
    shift: 'Morning',
    status: 'Active',
    joinedDate: new Date().toISOString().split('T')[0],
    emergencyContact: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || initialData.fullName || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        address: initialData.address || '',
        role: initialData.role || 'Receptionist',
        department: initialData.department || 'Front Office',
        shift: initialData.shift || 'Morning',
        status: initialData.status || 'Active',
        joinedDate: initialData.joinedDate || new Date().toISOString().split('T')[0],
        emergencyContact: initialData.emergencyContact || '',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        role: 'Receptionist',
        department: 'Front Office',
        shift: 'Morning',
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        emergencyContact: '',
        notes: ''
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
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!formData.role) {
      newErrors.role = 'Role is required.';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required.';
    }

    if (!formData.shift) {
      newErrors.shift = 'Shift is required.';
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
      title={isEdit ? 'Edit Staff Member' : 'Add New Staff Member'}
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
                placeholder="e.g. Priya Rao"
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
                placeholder="e.g. +91 98765 00102"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="invalid-feedback">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="email">Email Address <span className="req">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="e.g. priya.r@hotelpro.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="invalid-feedback">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-control"
                placeholder="e.g. 45 Bandra West, Mumbai"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Employment Information */}
        <div className="form-section">
          <div className="form-section-header">
            <Briefcase size={18} className="form-section-icon" />
            <span className="form-section-title">Employment Information</span>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label htmlFor="role">Role <span className="req">*</span></label>
              <select
                id="role"
                name="role"
                className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Accountant">Accountant</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Security">Security</option>
              </select>
              {errors.role && <span className="invalid-feedback">{errors.role}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="department">Department <span className="req">*</span></label>
              <select
                id="department"
                name="department"
                className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                value={formData.department}
                onChange={handleChange}
              >
                <option value="Management">Management</option>
                <option value="Front Office">Front Office</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Finance">Finance</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Security">Security</option>
              </select>
              {errors.department && <span className="invalid-feedback">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="shift">Shift <span className="req">*</span></label>
              <select
                id="shift"
                name="shift"
                className={`form-control ${errors.shift ? 'is-invalid' : ''}`}
                value={formData.shift}
                onChange={handleChange}
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
                <option value="General">General</option>
              </select>
              {errors.shift && <span className="invalid-feedback">{errors.shift}</span>}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="On Duty">On Duty</option>
                <option value="Off Duty">Off Duty</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="joinedDate">Joined Date</label>
              <input
                type="date"
                id="joinedDate"
                name="joinedDate"
                className="form-control"
                value={formData.joinedDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Additional Details */}
        <div className="form-section">
          <div className="form-section-header">
            <PhoneCall size={18} className="form-section-icon" />
            <span className="form-section-title">Additional Information</span>
          </div>

          <div className="form-group">
            <label htmlFor="emergencyContact">Emergency Contact</label>
            <input
              type="text"
              id="emergencyContact"
              name="emergencyContact"
              className="form-control"
              placeholder="e.g. +91 98765 99902 (Spouse)"
              value={formData.emergencyContact}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes / Qualifications</label>
            <textarea
              id="notes"
              name="notes"
              rows="2"
              className="form-control"
              placeholder="Operational notes, skills, or certifications"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="guest-form-actions">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEdit ? 'Save Changes' : 'Add Staff'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
