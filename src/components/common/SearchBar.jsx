import React from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search reservations, rooms, or guests...',
  className = ''
}) => {
  return (
    <div className={`search-bar-container ${className}`}>
      <Search className="search-bar-icon" size={18} />
      <input
        type="text"
        className="search-bar-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};
