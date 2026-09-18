import React from 'react';
import { DoorOpen, LogIn, LogOut, IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';
import './KPICard.css';

const ICON_MAP = {
  DoorOpen,
  LogIn,
  LogOut,
  IndianRupee
};

export const KPICard = ({ title, value, change, isPositive, iconName, color, bgColor }) => {
  const IconComponent = ICON_MAP[iconName] || DoorOpen;

  return (
    <div className="kpi-card">
      <div className="kpi-card-top">
        <div className="kpi-icon-wrapper" style={{ backgroundColor: bgColor, color: color }}>
          <IconComponent size={22} />
        </div>
        <div className={`kpi-trend-pill ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{change}</span>
        </div>
      </div>
      <div className="kpi-card-bottom">
        <span className="kpi-title">{title}</span>
        <h3 className="kpi-value">{value}</h3>
      </div>
    </div>
  );
};
