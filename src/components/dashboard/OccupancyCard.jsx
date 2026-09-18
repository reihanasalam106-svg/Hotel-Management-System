import React from 'react';
import { Card } from '../common/Card';
import './OccupancyCard.css';

export const OccupancyCard = ({ occupancyData }) => {
  const percentage = occupancyData.percentage || 75;
  const strokeDashoffset = 283 - (283 * percentage) / 100;

  return (
    <Card title="Occupancy Rate" subtitle="Current live hotel capacity fill">
      <div className="occupancy-widget-container">
        <div className="donut-chart-wrapper">
          <svg className="donut-chart" viewBox="0 0 100 100">
            <circle
              className="donut-bg"
              cx="50"
              cy="50"
              r="45"
            />
            <circle
              className="donut-progress"
              cx="50"
              cy="50"
              r="45"
              style={{ strokeDashoffset }}
            />
          </svg>
          <div className="donut-center-label">
            <span className="occupancy-percentage">{percentage}%</span>
            <span className="occupancy-subtext">Occupied</span>
          </div>
        </div>

        <div className="occupancy-stats-summary">
          <div className="occ-stat-item">
            <span className="stat-dot dot-occupied" />
            <div className="stat-text-group">
              <span className="stat-label">Occupied Rooms</span>
              <span className="stat-val">{occupancyData.occupied}</span>
            </div>
          </div>
          <div className="occ-stat-item">
            <span className="stat-dot dot-vacant" />
            <div className="stat-text-group">
              <span className="stat-label">Available / Vacant</span>
              <span className="stat-val">{occupancyData.vacant}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
