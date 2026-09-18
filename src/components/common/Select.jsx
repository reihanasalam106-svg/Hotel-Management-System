import React from 'react';
import './Select.css';

export const Select = ({
  label,
  options = [],
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  name,
  className = '',
  placeholder = 'Select option...'
}) => {
  return (
    <div className={`select-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label className="select-label">
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="select-field"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      {error && <span className="select-error-msg">{error}</span>}
    </div>
  );
};
