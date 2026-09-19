import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const RoomTypeModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaultPrice: 5000,
    maxGuests: 2,
    amenities: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        defaultPrice: initialData.defaultPrice || 5000,
        maxGuests: initialData.maxGuests || 2,
        amenities: initialData.amenities || '',
        status: initialData.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        defaultPrice: 5000,
        maxGuests: 2,
        amenities: 'Wi-Fi, Air Conditioning, Smart TV',
        status: 'Active'
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Room type name is required.';
    }
    if (Number(formData.defaultPrice) <= 0) {
      newErrors.defaultPrice = 'Default price must be greater than 0.';
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
      title={isEdit ? 'Edit Room Type' : 'Add New Room Type'}
      size="md"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-group">
          <label htmlFor="typeName">Room Type Name *</label>
          <input
            type="text"
            id="typeName"
            name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            placeholder="e.g. Presidential Suite"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="invalid-feedback">{errors.name}</span>}
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="defaultPrice">Default Price (₹/night) *</label>
            <input
              type="number"
              id="defaultPrice"
              name="defaultPrice"
              className={`form-control ${errors.defaultPrice ? 'is-invalid' : ''}`}
              value={formData.defaultPrice}
              onChange={handleChange}
            />
            {errors.defaultPrice && <span className="invalid-feedback">{errors.defaultPrice}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="maxGuests">Max Guests Capacity</label>
            <input
              type="number"
              id="maxGuests"
              name="maxGuests"
              min="1"
              max="10"
              className="form-control"
              value={formData.maxGuests}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="2"
            className="form-control"
            placeholder="Short room category description..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amenities">Included Amenities</label>
          <input
            type="text"
            id="amenities"
            name="amenities"
            className="form-control"
            placeholder="e.g. King Bed, Wi-Fi, Jacuzzi, Balcony"
            value={formData.amenities}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEdit ? 'Save Changes' : 'Add Room Type'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
