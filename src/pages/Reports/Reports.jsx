import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { BarChart3, TrendingUp, Download, PieChart, Users, Calendar } from 'lucide-react';
import { RevenueChart } from '../../components/dashboard/RevenueChart';
import { ReservationsChart } from '../../components/dashboard/ReservationsChart';
import { revenueTrendData, bookingChannelDistribution } from '../../data/mockData';

export const Reports = () => {
  return (
    <div className="module-page">
      <PageHeader
        title="Analytics & Reports"
        description="Comprehensive hotel performance metrics, revenue trajectories, and channel analytics"
        action={
          <Button variant="primary" icon={Download} onClick={() => alert('Downloading full PDF analytics summary')}>
            Download Comprehensive Report
          </Button>
        }
      />

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <Card title="Average Daily Rate (ADR)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹5,240</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--status-success-text)', fontWeight: 600 }}>+6.4% vs last month</span>
          </div>
        </Card>
        <Card title="RevPAR (Revenue Per Available Room)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹3,930</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--status-success-text)', fontWeight: 600 }}>+11.2% vs last month</span>
          </div>
        </Card>
        <Card title="Average Stay Duration">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>2.8 Nights</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Stable trajectory</span>
          </div>
        </Card>
      </div>

      <div className="grid-2">
        <RevenueChart data={revenueTrendData} />
        <ReservationsChart data={bookingChannelDistribution} />
      </div>
    </div>
  );
};
