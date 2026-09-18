import React from 'react';
import { Layers } from 'lucide-react';
import './FloorSelector.css';

export const FloorSelector = ({ selectedFloor, onSelectFloor }) => {
  const floors = ['All Floors', 'Floor 1', 'Floor 2', 'Floor 3', 'Floor 4', 'Floor 5'];

  return (
    <div className="floor-selector-bar">
      <div className="floor-label-wrapper">
        <Layers size={16} className="floor-label-icon" />
        <span>Floor Overview:</span>
      </div>

      <div className="floor-tabs">
        {floors.map((floor) => (
          <button
            key={floor}
            className={`floor-tab-btn ${selectedFloor === floor ? 'active' : ''}`}
            onClick={() => onSelectFloor(floor)}
          >
            {floor}
          </button>
        ))}
      </div>
    </div>
  );
};
