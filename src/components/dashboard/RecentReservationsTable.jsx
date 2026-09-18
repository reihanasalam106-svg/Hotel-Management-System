import React from 'react';
import { Card } from '../common/Card';
import { Table } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Eye, ArrowRight } from 'lucide-react';

export const RecentReservationsTable = ({ reservations, onViewAll }) => {
  const columns = [
    {
      header: 'Guest Name',
      accessor: 'guestName',
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.guestName}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{row.email}</span>
        </div>
      )
    },
    {
      header: 'Room',
      accessor: 'room',
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 600 }}>{row.room}</span>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{row.roomType}</span>
        </div>
      )
    },
    { header: 'Check-in', accessor: 'checkIn' },
    { header: 'Check-out', accessor: 'checkOut' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status} />
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.amount}</span>
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row) => (
        <Button variant="ghost" size="sm" icon={Eye} onClick={() => alert(`Viewing reservation details for ${row.guestName}`)}>
          View
        </Button>
      )
    }
  ];

  return (
    <Card
      title="Recent Reservations"
      subtitle="Latest guest bookings and check-in statuses"
      headerAction={
        <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right" onClick={onViewAll}>
          View All
        </Button>
      }
    >
      <Table columns={columns} data={reservations} keyField="id" />
    </Card>
  );
};
