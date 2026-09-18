import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { UserCheck, UserPlus, Shield } from 'lucide-react';
import { sampleStaff } from '../../data/mockData';

export const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = sampleStaff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Employee ID', accessor: 'id', render: (r) => <span style={{ fontWeight: 700 }}>{r.id}</span> },
    { header: 'Staff Member Name', accessor: 'name', render: (r) => <strong style={{ color: 'var(--text-primary)' }}>{r.name}</strong> },
    { header: 'Job Title / Role', accessor: 'role' },
    { header: 'Department', accessor: 'department' },
    { header: 'Working Shift', accessor: 'shift' },
    { header: 'Status', accessor: 'status', render: (r) => <Badge status={r.status} /> },
    {
      header: 'Actions',
      accessor: 'action',
      render: (r) => (
        <Button variant="outline" size="sm" icon={Shield} onClick={() => alert(`Managing permissions for ${r.name}`)}>
          Roles & Access
        </Button>
      )
    }
  ];

  return (
    <div className="module-page">
      <PageHeader
        title="Staff Directory & Roster"
        description="Manage hotel personnel, shifts, departments, and operational roles"
        action={
          <Button variant="primary" icon={UserPlus} onClick={() => alert('Add Staff member in Phase 2')}>
            Add New Staff
          </Button>
        }
      />

      <div style={{ marginBottom: '1.25rem' }}>
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by staff name, role, or department..."
        />
      </div>

      <Table columns={columns} data={filteredStaff} keyField="id" />
    </div>
  );
};
