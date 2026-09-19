import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Save, RotateCcw, Building, Upload, Trash2, AlertCircle, RefreshCw } from 'lucide-react';

export const HotelProfileSection = ({ profileData = {}, onSave }) => {
  const fileInputRef = useRef(null);
  const [logoError, setLogoError] = useState('');

  const [formData, setFormData] = useState({
    hotelName: 'HotelPro Grand',
    address: '74 Luxury Palm Avenue, Marine Drive',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400001',
    phone: '+91 22 4988 2000',
    email: 'contact@hotelprogrand.com',
    website: 'www.hotelprogrand.com',
    logoUrl: ''
  });

  useEffect(() => {
    if (profileData && Object.keys(profileData).length > 0) {
      setFormData((prev) => ({ ...prev, ...profileData }));
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadClick = () => {
    setLogoError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input to allow selecting the same file again
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoError('');

    // Allowed file types: PNG, JPG, JPEG, SVG
    const validExtensions = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    const validNameExtensions = /\.(png|jpe?g|svg)$/i;

    if (!validExtensions.includes(file.type) && !validNameExtensions.test(file.name)) {
      setLogoError('Please upload a PNG, JPG, JPEG, or SVG image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Maximum file size: 2MB (2 * 1024 * 1024 bytes)
    const maxSizeBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setLogoError('Logo size must be less than 2 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Read image as Data URL (Base64) for robust preview and localStorage persistence
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result;
        if (resultUrl) {
          setFormData((prev) => ({ ...prev, logoUrl: resultUrl }));
        }
      };
      reader.onerror = () => {
        setLogoError('Failed to read image file. Please try another image.');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setLogoError('Error processing file. Please try again.');
    }
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: '' }));
    setLogoError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleReset = () => {
    setFormData({
      hotelName: 'HotelPro Grand',
      address: '74 Luxury Palm Avenue, Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400001',
      phone: '+91 22 4988 2000',
      email: 'contact@hotelprogrand.com',
      website: 'www.hotelprogrand.com',
      logoUrl: ''
    });
    setLogoError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card title="Hotel Profile & Property Details" subtitle="Official property information, address and contact information">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
          style={{ display: 'none' }}
          aria-label="Upload hotel brand logo file"
        />

        {/* Logo Upload & Preview Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '8px',
              backgroundColor: 'var(--accent-gold-bg)',
              border: '1px solid var(--accent-gold-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold-dark)',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              {formData.logoUrl ? (
                <img
                  src={formData.logoUrl}
                  alt="Hotel Brand Logo Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Building size={32} />
              )}
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Hotel Brand Logo</strong>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>PNG, JPG or SVG up to 2MB (Used on invoices and headers)</span>
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {formData.logoUrl ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      icon={RefreshCw}
                      onClick={handleUploadClick}
                      aria-label="Change hotel brand logo"
                    >
                      Change Logo
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      icon={Trash2}
                      onClick={handleRemoveLogo}
                      style={{ color: 'var(--status-danger-text)', borderColor: 'var(--status-danger-border)' }}
                      aria-label="Remove hotel brand logo"
                    >
                      Remove Logo
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    icon={Upload}
                    onClick={handleUploadClick}
                    aria-label="Upload hotel brand logo"
                  >
                    Upload Logo
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Validation Error Message */}
          {logoError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--status-danger-text)',
              backgroundColor: 'var(--status-danger-bg)',
              border: '1px solid var(--status-danger-border)',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 500
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{logoError}</span>
            </div>
          )}
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="hotelName">Hotel Name *</label>
            <input
              type="text"
              id="hotelName"
              name="hotelName"
              className="form-control"
              value={formData.hotelName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              className="form-control"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="phone">Official Phone Line *</label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Official Contact Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Physical Street Address</label>
          <input
            type="text"
            id="address"
            name="address"
            className="form-control"
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
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pincode">Pincode / Zip Code</label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              className="form-control"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <Button type="button" variant="outline" icon={RotateCcw} onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit" variant="primary" icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};
