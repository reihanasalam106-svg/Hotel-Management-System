import React from 'react';
import { Users, UserCheck, Clock, UserX } from 'lucide-react';
import './StaffSummaryCards.css';

export const StaffSummaryCards = ({ staff = [] }) => {
  const totalStaff = staff.length;
  const activeStaff = staff.filter((s) => s.status === 'Active' || s.status === 'On Duty').length;
  const onDutyStaff = staff.filter((s) => s.status === 'On Duty').length;
  const offDutyStaff = staff.filter((s) => s.status === 'Off Duty' || s.status === 'On Leave' || s.status === 'Inactive').length;

  const cardsData = [
    {
      id: 'total-staff',
      title: 'Total Staff',
      value: totalStaff,
      subtitle: `${staff.filter((s) => s.status !== 'Inactive').length} Registered Personnel`,
      icon: Users,
      color: '#0369a1',
      bgColor: '#e0f2fe'
    },
    {
      id: 'active-staff',
      title: 'Active Staff',
      value: activeStaff,
      subtitle: 'Available Personnel',
      icon: UserCheck,
      color: '#15803d',
      bgColor: '#dcfce7'
    },
    {
      id: 'on-duty',
      title: 'On Duty',
      value: onDutyStaff,
      subtitle: 'Currently Shift Working',
      icon: Clock,
      color: '#c5a059',
      bgColor: 'rgba(197, 160, 89, 0.15)'
    },
    {
      id: 'off-duty',
      title: 'Off Duty / Leave',
      value: offDutyStaff,
      subtitle: 'Off Shift or On Leave',
      icon: UserX,
      color: '#6b21a8',
      bgColor: '#f3e8ff'
    }
  ];

  return (
    <div className="staff-summary-grid">
      {cardsData.map((card) => {
        const IconComponent = card.icon;
        return (
          <div className="staff-summary-card" key={card.id}>
            <div className="staff-summary-info">
              <span className="staff-summary-title">{card.title}</span>
              <div className="staff-summary-value">{card.value}</div>
              <span className="staff-summary-subtitle">{card.subtitle}</span>
            </div>
            <div
              className="staff-summary-icon-box"
              style={{ backgroundColor: card.bgColor, color: card.color }}
            >
              <IconComponent size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
