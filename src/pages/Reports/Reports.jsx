import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingState } from '../../components/common/LoadingState';
import { Download, Printer, BarChart3, RotateCcw, ShieldAlert, RefreshCw } from 'lucide-react';
import { useReservations } from '../../context/ReservationContext';
import { useAuth } from '../../context/AuthContext';

// Import Calculation Utilities
import {
  calculateKPIMetrics,
  calculateRevenueTrend,
  calculateOccupancyBreakdown,
  calculateBookingsByStatus,
  calculateBookingsByRoomType,
  calculateRevenueByPaymentMethod,
  calculateRevenueByBookingSource,
  calculateRoomPerformance,
  calculateRoomTypePerformance,
  calculateGuestAnalytics,
  calculatePaymentAnalytics,
  calculateOutstandingPayments,
  calculateHousekeepingAnalytics,
  calculateArrivalsDepartures,
  generateStaffActivityLogs,
  calculateRevenueComparison,
  calculateOccupancyTrend
} from '../../utils/reportCalculations';

// Import Report Components
import { ReportFilters } from '../../components/reports/ReportFilters';
import { ReportSummaryCards } from '../../components/reports/ReportSummaryCards';
import { RevenueOverviewChart } from '../../components/reports/RevenueOverviewChart';
import { OccupancyAnalyticsCard } from '../../components/reports/OccupancyAnalyticsCard';
import { BookingsOverviewChart } from '../../components/reports/BookingsOverviewChart';
import { RoomTypeChart } from '../../components/reports/RoomTypeChart';
import { PaymentMethodChart } from '../../components/reports/PaymentMethodChart';
import { BookingSourceChart } from '../../components/reports/BookingSourceChart';
import { RoomPerformanceTable } from '../../components/reports/RoomPerformanceTable';
import { GuestAnalyticsSection } from '../../components/reports/GuestAnalyticsSection';
import { PaymentAnalyticsSection } from '../../components/reports/PaymentAnalyticsSection';
import { OutstandingPaymentsTable } from '../../components/reports/OutstandingPaymentsTable';
import { ArrivalsDeparturesOverview } from '../../components/reports/ArrivalsDeparturesOverview';
import { HousekeepingAnalyticsSection } from '../../components/reports/HousekeepingAnalyticsSection';
import { StaffActivitySection } from '../../components/reports/StaffActivitySection';
import { RevenueComparisonCard } from '../../components/reports/RevenueComparisonCard';
import { OccupancyTrendChart } from '../../components/reports/OccupancyTrendChart';
import { ExportReportModal } from '../../components/reports/ExportReportModal';
import '../../components/reports/PrintReport.css';

export const Reports = () => {
  const { hasRole } = useAuth();
  const isAuthorized = hasRole('Admin', 'Manager');

  const {
    reservations = [],
    rooms = [],
    guests = [],
    invoices = [],
    housekeepingTasks = [],
    isLoading,
    error,
    refreshAllData
  } = useReservations();

  // Filter State
  const [filters, setFilters] = useState({
    dateRange: 'This Month',
    roomType: 'All',
    bookingSource: 'All',
    paymentMethod: 'All'
  });

  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: 'This Month',
    roomType: 'All',
    bookingSource: 'All',
    paymentMethod: 'All'
  });

  // Revenue Chart View Type (Daily / Weekly / Monthly)
  const [revenueViewType, setRevenueViewType] = useState('Daily');

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Apply Filter Handler
  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  // Reset Filter Handler
  const handleResetFilters = () => {
    const defaultF = {
      dateRange: 'This Month',
      roomType: 'All',
      bookingSource: 'All',
      paymentMethod: 'All'
    };
    setFilters(defaultF);
    setAppliedFilters(defaultF);
  };

  // Perform Calculations Memoized against Applied Filters
  const kpiMetrics = useMemo(
    () => calculateKPIMetrics(reservations, rooms, guests, invoices, appliedFilters),
    [reservations, rooms, guests, invoices, appliedFilters]
  );

  const revenueTrendData = useMemo(
    () => calculateRevenueTrend(reservations, invoices, revenueViewType),
    [reservations, invoices, revenueViewType]
  );

  const occupancyBreakdown = useMemo(
    () => calculateOccupancyBreakdown(rooms),
    [rooms]
  );

  const bookingsByStatusData = useMemo(
    () => calculateBookingsByStatus(reservations),
    [reservations]
  );

  const roomTypeBookingsData = useMemo(
    () => calculateBookingsByRoomType(reservations, rooms),
    [reservations, rooms]
  );

  const paymentMethodData = useMemo(
    () => calculateRevenueByPaymentMethod(invoices),
    [invoices]
  );

  const bookingSourceData = useMemo(
    () => calculateRevenueByBookingSource(reservations),
    [reservations]
  );

  const roomPerformanceData = useMemo(
    () => calculateRoomPerformance(rooms, reservations, invoices),
    [rooms, reservations, invoices]
  );

  const guestAnalyticsData = useMemo(
    () => calculateGuestAnalytics(guests, reservations),
    [guests, reservations]
  );

  const paymentAnalyticsData = useMemo(
    () => calculatePaymentAnalytics(invoices),
    [invoices]
  );

  const outstandingPaymentsData = useMemo(
    () => calculateOutstandingPayments(invoices),
    [invoices]
  );

  const housekeepingAnalyticsData = useMemo(
    () => calculateHousekeepingAnalytics(rooms, housekeepingTasks),
    [rooms, housekeepingTasks]
  );

  const arrivalsDeparturesData = useMemo(
    () => calculateArrivalsDepartures(reservations),
    [reservations]
  );

  const staffActivityLogs = useMemo(
    () => generateStaffActivityLogs(),
    []
  );

  const revenueComparisonData = useMemo(
    () => calculateRevenueComparison(reservations, invoices),
    [reservations, invoices]
  );

  const occupancyTrendData = useMemo(
    () => calculateOccupancyTrend(rooms, reservations),
    [rooms, reservations]
  );

  // CSV Export Handler
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Hotel Management System - Reports & Analytics Export\n";
    csvContent += `Generated Date,${new Date().toLocaleDateString()}\n`;
    csvContent += `Date Range,${appliedFilters.dateRange}\n`;
    csvContent += `Room Type Filter,${appliedFilters.roomType}\n`;
    csvContent += `Booking Source Filter,${appliedFilters.bookingSource}\n`;
    csvContent += `Payment Method Filter,${appliedFilters.paymentMethod}\n\n`;

    csvContent += "Metric,Value\n";
    csvContent += `Total Revenue,₹${kpiMetrics.totalRevenue}\n`;
    csvContent += `Total Bookings,${kpiMetrics.totalBookings}\n`;
    csvContent += `Occupancy Rate,${kpiMetrics.occupancyRate}%\n`;
    csvContent += `New Guests,${kpiMetrics.newGuestsCount}\n`;
    csvContent += `Average Booking Value,₹${kpiMetrics.avgBookingValue}\n\n`;

    csvContent += "Room Performance\n";
    csvContent += "Room Number,Room Type,Bookings,Occupied Nights,Revenue,Occupancy %\n";
    roomPerformanceData.forEach((r) => {
      csvContent += `${r.roomNumber},${r.roomType},${r.bookings},${r.occupiedNights},₹${r.revenue},${r.occupancyPercent}%\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hotel_analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportModalOpen(false);
  };

  // Browser Print Handler
  const handlePrintReport = () => {
    setIsExportModalOpen(false);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  if (!isAuthorized) {
    return (
      <div className="module-page" style={{ padding: '3rem', textAlign: 'center' }}>
        <ShieldAlert size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Access Denied</h2>
        <p style={{ color: '#94a3b8' }}>Only Administrators and Managers have permission to view analytics and financial reports.</p>
      </div>
    );
  }

  if (isLoading && reservations.length === 0 && rooms.length === 0) {
    return (
      <div className="module-page">
        <LoadingState label="Computing analytics from PostgreSQL database..." />
      </div>
    );
  }

  if (error && reservations.length === 0) {
    return (
      <div className="module-page" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
        <Button onClick={refreshAllData} variant="primary" icon={RefreshCw}>
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="module-page">
      {/* Print-Only Header */}
      <div className="print-only-header">
        <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Hotel Management System</h1>
        <h2 style={{ fontSize: '1.2rem', color: '#666', margin: '0.25rem 0' }}>Reports & Analytics Summary</h2>
        <div style={{ fontSize: '0.85rem', color: '#888' }}>
          Date Range: <strong>{appliedFilters.dateRange}</strong> | Generated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Page Header */}
      <PageHeader
        title="Reports & Analytics"
        description="Analyze hotel occupancy, revenue, bookings and operational performance."
        action={
          <Button variant="primary" icon={Download} onClick={() => setIsExportModalOpen(true)}>
            Export Report
          </Button>
        }
      />

      {/* Report Filter Bar */}
      <ReportFilters
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {/* KPI Summary Cards */}
      <ReportSummaryCards metrics={kpiMetrics} />

      {/* Revenue Trend Comparison Card */}
      <div style={{ marginBottom: '1.5rem' }}>
        <RevenueComparisonCard data={revenueComparisonData} />
      </div>

      {/* Main Grid 1: Revenue Overview & Occupancy Analytics */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <RevenueOverviewChart
          data={revenueTrendData}
          viewType={revenueViewType}
          onViewTypeChange={setRevenueViewType}
        />
        <OccupancyAnalyticsCard occupancyData={occupancyBreakdown} />
      </div>

      {/* Main Grid 2: Bookings Overview & Occupancy Trend */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <BookingsOverviewChart data={bookingsByStatusData} />
        <OccupancyTrendChart data={occupancyTrendData} />
      </div>

      {/* Distribution Grid 3: Room Type, Payment Method & Booking Source */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <RoomTypeChart data={roomTypeBookingsData} />
        <PaymentMethodChart data={paymentMethodData} />
        <BookingSourceChart data={bookingSourceData} />
      </div>

      {/* Room Performance Table */}
      <div style={{ marginBottom: '1.5rem' }}>
        <RoomPerformanceTable data={roomPerformanceData} />
      </div>

      {/* Section Grid: Guest Analytics & Payment Settlement */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <GuestAnalyticsSection guestData={guestAnalyticsData} />
        <PaymentAnalyticsSection paymentData={paymentAnalyticsData} />
      </div>

      {/* Outstanding Payments Table */}
      <div style={{ marginBottom: '1.5rem' }}>
        <OutstandingPaymentsTable data={outstandingPaymentsData} />
      </div>

      {/* Operations Grid: Housekeeping & Arrivals/Departures */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <HousekeepingAnalyticsSection data={housekeepingAnalyticsData} />
        <ArrivalsDeparturesOverview data={arrivalsDeparturesData} />
      </div>

      {/* Staff Activity / System Audit Logs */}
      <div style={{ marginBottom: '1.5rem' }}>
        <StaffActivitySection logs={staffActivityLogs} />
      </div>

      {/* Export & Print Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportCSV={handleExportCSV}
        onPrint={handlePrintReport}
      />
    </div>
  );
};

export default Reports;
