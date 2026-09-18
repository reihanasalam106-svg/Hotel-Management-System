import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { UserPlus, Mail, Phone, Award } from 'lucide-react';
import { sampleGuests } from '../../data/mockData';

export const Guests = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuests = sampleGuests.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.phone.includes(searchTerm)
  );

  const columns = [
    { header: 'Guest ID', accessor: 'id', render: (r) => <span style={{ fontWeight: 700 }}>{r.id}</span> },
    {
      header: 'Full Name',
      accessor: 'name',
      render: (r) => (
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>{r.name}</strong>
        </div>
      )
    },
    {
      header: 'Contact Info',
      accessor: 'email',
      render: (r) => (
        <div style={{ fontSize: '0.825rem' }}>
          <div>{r.email}</div>
          <div style={{ color: 'var(--text-secondary)' }}>{r.phone}</div>
        </div>
      )
    },
    { header: 'Total Stays', accessor: 'visits', render: (r) => <span>{r.visits} stays</span> },
    { header: 'Loyalty Tier', accessor: 'status', render: (r) => <Badge status={r.status} /> },
    { header: 'Last Stay', accessor: 'lastStay' },
    {
      header: 'Action',
      accessor: 'action',
      render: (r) => (
        <Button variant="outline" size="sm" onClick={() => alert(`Viewing guest profile: ${r.name}`)}>
          View Folio
        </Button>
      )
    }
  ];

  return (
    <div className="module-page">
      <PageHeader
        title="Guest Directory"
        description="Comprehensive guest profiles, contact history, and loyalty records"
        action={
          <Button variant="primary" icon={UserPlus} onClick={() => alert('Add Guest dialog in Phase 2')}>
            Register New Guest
          </Button>
        }
      />

      <div style={{ marginBottom: '1.25rem' }}>
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by guest name, email, or phone number..."
        />
      </div>

      <Table columns={columns} data={filteredGuests} keyField="id" />
    </div>
  );
};
