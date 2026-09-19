import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  roomsApi,
  guestsApi,
  reservationsApi,
  housekeepingApi,
  billingApi,
  staffApi,
  settingsApi,
  dashboardApi
} from '../services/api';
import { useAuth } from './AuthContext';

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const { isAuthenticated, token, user } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [staff, setStaff] = useState([]);
  const [housekeepingTasks, setHousekeepingTasks] = useState([]);
  const [housekeepingStaff, setHousekeepingStaff] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [settings, setSettings] = useState({
    hotelProfile: {
      hotelName: 'HotelPro Grand',
      logo: '',
      logoUrl: '',
      address: '74 Luxury Palm Avenue, Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400001',
      phone: '+91 22 4988 2000',
      email: 'contact@hotelprogrand.com',
      website: 'www.hotelprogrand.com'
    },
    general: {
      currency: 'INR',
      timeZone: 'Asia/Kolkata',
      dateFormat: 'YYYY-MM-DD',
      checkInTime: '14:00',
      checkOutTime: '11:00',
      defaultGuests: 2,
      language: 'English'
    },
    billing: {
      taxEnabled: true,
      taxRate: 18,
      taxName: 'GST',
      serviceChargeEnabled: true,
      serviceChargeRate: 5,
      invoicePrefix: 'INV-'
    },
    invoice: {
      invoicePrefix: 'INV-',
      startingNumber: 1001,
      showLogo: true,
      showGuestAddress: true,
      showPaymentDetails: true,
      showTaxBreakdown: true,
      footerMessage: 'Thank you for staying at HotelPro Grand. Have a safe journey!'
    },
    notifications: {
      newReservation: true,
      reservationCancellation: true,
      guestCheckIn: true,
      guestCheckOut: true,
      paymentReceived: true,
      pendingPayment: true,
      housekeepingTaskAssigned: true,
      maintenanceAlert: true
    },
    appearance: {
      density: 'comfortable',
      theme: 'light',
      sidebarCollapsed: false
    },
    roomTypes: []
  });

  const [roomTypes, setRoomTypes] = useState([]);
  const [seasonalPricing, setSeasonalPricing] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [taxRate, setTaxRate] = useState(18);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  // Format Helper
  const getFormattedDateTime = () => {
    const d = new Date();
    const dateStr = d.toISOString().split('T')[0];
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    return `${dateStr} ${timeStr}`;
  };

  // Adapter to ensure Room items match frontend expected format
  const adaptRoom = (r) => ({
    id: r.id,
    number: String(r.roomNumber || r.room_number || r.id),
    roomNumber: String(r.roomNumber || r.room_number || r.id),
    type: r.roomType || r.type || 'Deluxe Room',
    roomType: r.roomType || r.type || 'Deluxe Room',
    floor: r.floor || '1st Floor',
    ratePerNight: Number(r.pricePerNight ?? r.ratePerNight ?? 5000),
    pricePerNight: Number(r.pricePerNight ?? r.ratePerNight ?? 5000),
    rate: `₹${Number(r.pricePerNight ?? r.ratePerNight ?? 5000).toLocaleString('en-IN')}/night`,
    status: r.status || 'Vacant',
    housekeepingStatus: r.housekeepingStatus || r.housekeeping_status || 'Ready',
    currentGuest: r.currentGuest || r.current_guest || null,
    housekeeper: r.housekeeper || 'Assigned Staff',
    description: r.description || '',
    amenities: Array.isArray(r.amenities) ? r.amenities : (typeof r.amenities === 'string' && r.amenities ? r.amenities.split(',').map(s => s.trim()) : ['Wi-Fi', 'AC', 'TV'])
  });

  // Adapter for Reservations
  const adaptReservation = (res) => {
    const amt = Number(res.numericAmount ?? res.numeric_amount ?? res.amount ?? 0);
    return {
      id: res.id,
      guestId: res.guestId || res.guest_id,
      guestName: res.guestName || res.guest_name || 'Guest',
      email: res.email || res.guest_email || '',
      phone: res.phone || res.guest_phone || '',
      roomId: res.roomId || res.room_id,
      roomNumber: String(res.roomNumber || res.room_number || res.roomId || res.room_id || ''),
      room: `Room ${res.roomNumber || res.room_number || res.roomId || res.room_id || ''}`,
      roomType: res.roomType || res.room_type || 'Deluxe Room',
      checkIn: res.checkIn ? String(res.checkIn).split('T')[0] : '',
      checkOut: res.checkOut ? String(res.checkOut).split('T')[0] : '',
      guests: Number(res.guests || 1),
      status: res.status || 'Confirmed',
      amount: `₹${amt.toLocaleString('en-IN')}`,
      numericAmount: amt,
      paymentStatus: res.paymentStatus || res.payment_status || 'Pending',
      specialRequest: res.specialRequest || res.special_requests || res.specialRequests || 'None',
      createdAt: res.createdAt || res.created_at
    };
  };

  // Adapter for Guests
  const adaptGuest = (g) => ({
    id: g.id,
    guestCode: g.guestCode || g.guest_code || g.id,
    name: g.name || '',
    phone: g.phone || '',
    email: g.email || '',
    address: g.address || '',
    city: g.city || '',
    state: g.state || '',
    pincode: g.pincode || '',
    nationality: g.nationality || 'Indian',
    idType: g.idType || g.id_type || 'Aadhaar',
    idNumber: g.idNumber || g.id_number || '',
    dateOfBirth: g.dateOfBirth || g.date_of_birth || '',
    guestType: g.guestType || g.guest_type || 'New Guest',
    status: g.status || 'Upcoming',
    currentRoom: g.currentRoom || g.current_room || null,
    currentReservationId: g.currentReservationId || g.current_reservation_id || null,
    totalBookings: Number(g.totalBookings ?? g.total_bookings ?? 0),
    lastStay: g.lastStay ? String(g.lastStay).split('T')[0] : null,
    preferences: g.preferences || '',
    specialRequests: g.specialRequests || g.special_requests || ''
  });

  // Adapter for Housekeeping Tasks
  const adaptHousekeepingTask = (t) => ({
    id: t.id,
    taskCode: t.taskCode || t.task_code || t.id,
    roomId: t.roomId || t.room_id,
    roomNumber: String(t.roomNumber || t.room_number || t.roomId || t.room_id || ''),
    taskType: t.taskType || t.task_type || 'Room Cleaning',
    priority: t.priority || 'Medium',
    assignedStaffId: t.assignedStaffId || t.assigned_staff_id || null,
    assignedStaffName: t.assignedStaffName || t.staff_name || null,
    status: t.status || 'Cleaning Required',
    dueTime: t.dueTime || t.due_time || '12:00 PM',
    notes: t.notes || '',
    createdAt: t.createdAt || t.created_at || getFormattedDateTime(),
    updatedAt: t.updatedAt || t.updated_at || getFormattedDateTime()
  });

  // Adapter for Invoices
  const adaptInvoice = (inv) => ({
    id: inv.id,
    invoiceId: inv.invoiceId || inv.invoice_id || inv.id,
    reservationId: inv.reservationId || inv.reservation_id,
    guestId: inv.guestId || inv.guest_id,
    guestName: inv.guestName || inv.guest_name,
    guestEmail: inv.guestEmail || inv.guest_email || '',
    guestPhone: inv.guestPhone || inv.guest_phone || '',
    roomId: inv.roomId || inv.room_id,
    roomNumber: String(inv.roomNumber || inv.room_number || inv.roomId || inv.room_id || ''),
    roomType: inv.roomType || inv.room_type || 'Deluxe Room',
    checkIn: inv.checkIn ? String(inv.checkIn).split('T')[0] : '',
    checkOut: inv.checkOut ? String(inv.checkOut).split('T')[0] : '',
    nights: Number(inv.nights || 1),
    roomRate: Number(inv.roomRate || inv.room_rate || 0),
    roomCharges: Number(inv.roomCharges || inv.room_charges || 0),
    additionalServices: Array.isArray(inv.additionalServices) ? inv.additionalServices : (Array.isArray(inv.items) ? inv.items : []),
    subtotal: Number(inv.subtotal || 0),
    discountType: inv.discountType || inv.discount_type || 'fixed',
    discountValue: Number(inv.discountValue || inv.discount_value || 0),
    discount: Number(inv.discount || 0),
    taxableAmount: Number(inv.taxableAmount || inv.taxable_amount || 0),
    taxRate: Number(inv.taxRate || inv.tax_rate || 18),
    taxAmount: Number(inv.taxAmount || inv.tax_amount || 0),
    totalAmount: Number(inv.totalAmount || inv.total_amount || 0),
    paidAmount: Number(inv.paidAmount || inv.paid_amount || 0),
    balanceAmount: Number(inv.balanceAmount || inv.balance_amount || 0),
    paymentStatus: inv.paymentStatus || inv.payment_status || 'Pending',
    paymentMethod: inv.paymentMethod || inv.payment_method || 'Cash',
    payments: Array.isArray(inv.payments) ? inv.payments : [],
    invoiceStatus: inv.invoiceStatus || inv.invoice_status || 'Draft',
    createdAt: inv.createdAt ? String(inv.createdAt).split('T')[0] : new Date().toISOString().split('T')[0],
    dueDate: inv.dueDate || inv.due_date || (inv.checkOut ? String(inv.checkOut).split('T')[0] : ''),
    notes: inv.notes || ''
  });

  // Adapter for Staff
  const adaptStaff = (s) => ({
    id: s.id,
    staffCode: s.staffCode || s.staff_code || s.id,
    name: s.name || '',
    phone: s.phone || '',
    email: s.email || '',
    role: s.role || 'Staff',
    department: s.department || 'Operations',
    shift: s.shift || 'Morning',
    status: s.status || 'Active',
    joinedDate: s.joinedDate ? String(s.joinedDate).split('T')[0] : (s.createdAt ? String(s.createdAt).split('T')[0] : ''),
    assignedTasks: Number(s.assignedTasks || s.active_tasks || 0),
    address: s.address || '',
    emergencyContact: s.emergencyContact || s.emergency_contact || '',
    notes: s.notes || ''
  });

  // Fetch all data from REST API backend
  const refreshAllData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);

    try {
      const [
        roomsRes,
        reservationsRes,
        guestsRes,
        hkRes,
        billingRes,
        settingsRes,
        dashRes
      ] = await Promise.allSettled([
        roomsApi.getAll(),
        reservationsApi.getAll(),
        guestsApi.getAll(),
        housekeepingApi.getAll(),
        billingApi.getAll(),
        settingsApi.getSettings(),
        dashboardApi.getSummary()
      ]);

      if (roomsRes.status === 'fulfilled' && roomsRes.value.success) {
        setRooms((roomsRes.value.data || []).map(adaptRoom));
      }

      if (reservationsRes.status === 'fulfilled' && reservationsRes.value.success) {
        setReservations((reservationsRes.value.data || []).map(adaptReservation));
      }

      if (guestsRes.status === 'fulfilled' && guestsRes.value.success) {
        setGuests((guestsRes.value.data || []).map(adaptGuest));
      }

      if (hkRes.status === 'fulfilled' && hkRes.value.success) {
        const tasks = (hkRes.value.data || []).map(adaptHousekeepingTask);
        setHousekeepingTasks(tasks);
      }

      if (billingRes.status === 'fulfilled' && billingRes.value.success) {
        setInvoices((billingRes.value.data || []).map(adaptInvoice));
      }

      if (settingsRes.status === 'fulfilled' && settingsRes.value.success) {
        const st = settingsRes.value.data;
        if (st) {
          setSettings(st);
          if (st.roomTypes) setRoomTypes(st.roomTypes);
          if (st.billing?.taxRate !== undefined) setTaxRate(Number(st.billing.taxRate));
        }
      }

      if (dashRes.status === 'fulfilled' && dashRes.value.success) {
        setDashboardSummary(dashRes.value.data);
      }

      // Fetch staff only if authorized (Admin / Manager)
      const userRole = user?.role?.toLowerCase();
      if (userRole === 'admin' || userRole === 'manager') {
        const staffRes = await staffApi.getAll().catch(() => null);
        if (staffRes?.success) {
          const staffList = (staffRes.data || []).map(adaptStaff);
          setStaff(staffList);
          setHousekeepingStaff(staffList.filter(s => s.department === 'Housekeeping' || s.role === 'Housekeeping'));
        }
      }
    } catch (err) {
      console.error('Error fetching hotel data:', err);
      setError(err.message || 'Failed to fetch data from backend');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  // Initial load when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      refreshAllData();
    }
  }, [isAuthenticated, token, refreshAllData]);

  // ==========================================
  // RESERVATION ACTIONS
  // ==========================================
  const addReservation = async (formData) => {
    try {
      const response = await reservationsApi.create({
        guestId: formData.guestId,
        guestName: formData.guestName,
        email: formData.email,
        phone: formData.phone,
        roomNumber: formData.roomNumber,
        roomId: formData.roomId || formData.roomNumber,
        roomType: formData.roomType,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: Number(formData.guests) || 1,
        status: formData.status || 'Confirmed',
        numericAmount: Number(formData.numericAmount || formData.amount || 0),
        paymentStatus: formData.paymentStatus || 'Pending',
        specialRequests: formData.specialRequest || formData.specialRequests || ''
      });

      if (response.success && response.data) {
        const newRes = adaptReservation(response.data);
        setReservations(prev => [newRes, ...prev]);
        showToast(`Reservation ${newRes.id} created successfully!`, 'success');
        refreshAllData();
        return newRes;
      }
      throw new Error(response.message || 'Failed to create reservation');
    } catch (err) {
      const isConflict = err.status === 409 || err.isConflict;
      const msg = isConflict
        ? `Room Booking Conflict: ${err.message || 'The selected room is already booked for these dates.'}`
        : `Error creating reservation: ${err.message}`;
      showToast(msg, 'error');
      throw err;
    }
  };

  const updateReservation = async (id, updatedData) => {
    try {
      const response = await reservationsApi.update(id, {
        guestName: updatedData.guestName,
        email: updatedData.email,
        phone: updatedData.phone,
        roomNumber: updatedData.roomNumber,
        roomId: updatedData.roomId || updatedData.roomNumber,
        roomType: updatedData.roomType,
        checkIn: updatedData.checkIn,
        checkOut: updatedData.checkOut,
        guests: Number(updatedData.guests),
        paymentStatus: updatedData.paymentStatus,
        specialRequests: updatedData.specialRequest || updatedData.specialRequests
      });

      if (response.success && response.data) {
        const updated = adaptReservation(response.data);
        setReservations(prev => prev.map(r => (r.id === id ? updated : r)));
        showToast(`Reservation ${id} updated successfully.`, 'success');
        refreshAllData();
        return updated;
      }
      throw new Error(response.message || 'Failed to update reservation');
    } catch (err) {
      showToast(`Update error: ${err.message}`, 'error');
      throw err;
    }
  };

  const cancelReservation = async (id) => {
    try {
      const response = await reservationsApi.cancel(id);
      if (response.success) {
        showToast(`Reservation ${id} has been cancelled.`, 'info');
        refreshAllData();
      }
    } catch (err) {
      showToast(`Cancellation error: ${err.message}`, 'error');
      throw err;
    }
  };

  const checkoutGuest = async (reservationId) => {
    try {
      const response = await reservationsApi.checkOut(reservationId);
      if (response.success) {
        showToast(`Guest checked out successfully. Room queued for cleaning.`, 'success');
        refreshAllData();
      }
    } catch (err) {
      showToast(`Checkout error: ${err.message}`, 'error');
      throw err;
    }
  };

  // ==========================================
  // ROOM ACTIONS
  // ==========================================
  const addRoom = async (roomData) => {
    try {
      const priceNum = Number(roomData.pricePerNight || roomData.ratePerNight) || 5000;
      const response = await roomsApi.create({
        roomNumber: String(roomData.roomNumber).trim(),
        type: roomData.roomType || roomData.type || 'Deluxe Room',
        floor: roomData.floor || '1st Floor',
        pricePerNight: priceNum,
        status: roomData.status || 'Vacant',
        housekeepingStatus: roomData.housekeepingStatus || 'Ready',
        description: roomData.description || '',
        amenities: roomData.amenities || ['Wi-Fi', 'AC', 'TV']
      });

      if (response.success && response.data) {
        const newRoom = adaptRoom(response.data);
        setRooms(prev => [...prev, newRoom]);
        showToast(`Room ${newRoom.number} added successfully!`, 'success');
        refreshAllData();
        return { success: true, room: newRoom };
      }
      throw new Error(response.message || 'Failed to add room');
    } catch (err) {
      const msg = err.status === 409
        ? 'Room number already exists. Please choose a unique room number.'
        : `Failed to add room: ${err.message}`;
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const updateRoom = async (roomId, roomData) => {
    try {
      const priceNum = Number(roomData.pricePerNight || roomData.ratePerNight) || 5000;
      const response = await roomsApi.update(roomId, {
        type: roomData.roomType || roomData.type,
        floor: roomData.floor,
        pricePerNight: priceNum,
        status: roomData.status,
        housekeepingStatus: roomData.housekeepingStatus,
        description: roomData.description,
        amenities: roomData.amenities
      });

      if (response.success && response.data) {
        const updated = adaptRoom(response.data);
        setRooms(prev => prev.map(r => (r.id === roomId || r.number === roomId ? updated : r)));
        showToast(`Room ${roomId} updated successfully.`, 'success');
        refreshAllData();
        return updated;
      }
    } catch (err) {
      showToast(`Error updating room: ${err.message}`, 'error');
      throw err;
    }
  };

  const changeRoomStatus = async (roomId, newStatus) => {
    try {
      const response = await roomsApi.updateStatus(roomId, { status: newStatus });
      if (response.success && response.data) {
        const updated = adaptRoom(response.data);
        setRooms(prev => prev.map(r => (r.id === roomId || r.number === roomId ? updated : r)));
        showToast(`Room ${roomId} status changed to ${newStatus}.`, 'info');
        refreshAllData();
      }
    } catch (err) {
      showToast(`Status update failed: ${err.message}`, 'error');
    }
  };

  const changeHousekeepingStatus = async (roomId, newHousekeepingStatus) => {
    try {
      const response = await roomsApi.updateStatus(roomId, { housekeepingStatus: newHousekeepingStatus });
      if (response.success && response.data) {
        const updated = adaptRoom(response.data);
        setRooms(prev => prev.map(r => (r.id === roomId || r.number === roomId ? updated : r)));
        showToast(`Room ${roomId} housekeeping status set to ${newHousekeepingStatus}.`, 'info');
        refreshAllData();
      }
    } catch (err) {
      showToast(`Status update failed: ${err.message}`, 'error');
    }
  };

  // ==========================================
  // HOUSEKEEPING ACTIONS
  // ==========================================
  const addHousekeepingTask = async (formData) => {
    try {
      const response = await housekeepingApi.create({
        roomId: formData.roomId || formData.roomNumber,
        roomNumber: formData.roomNumber,
        taskType: formData.taskType || 'Room Cleaning',
        priority: formData.priority || 'Medium',
        assignedStaffId: formData.assignedStaffId || null,
        status: formData.status || 'Cleaning Required',
        dueTime: formData.dueTime || '12:00 PM',
        notes: formData.notes || ''
      });

      if (response.success && response.data) {
        const newTask = adaptHousekeepingTask(response.data);
        setHousekeepingTasks(prev => [newTask, ...prev]);
        showToast('Housekeeping task created successfully.', 'success');
        refreshAllData();
        return newTask;
      }
    } catch (err) {
      showToast(`Failed to create task: ${err.message}`, 'error');
      throw err;
    }
  };

  const updateHousekeepingTask = async (taskId, updatedData) => {
    try {
      const response = await housekeepingApi.update(taskId, updatedData);
      if (response.success && response.data) {
        const updated = adaptHousekeepingTask(response.data);
        setHousekeepingTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
        showToast('Housekeeping task updated successfully.', 'success');
        refreshAllData();
        return updated;
      }
    } catch (err) {
      showToast(`Failed to update task: ${err.message}`, 'error');
      throw err;
    }
  };

  const updateHousekeepingTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await housekeepingApi.updateStatus(taskId, newStatus);
      if (response.success && response.data) {
        const updated = adaptHousekeepingTask(response.data);
        setHousekeepingTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
        showToast(`Housekeeping status set to ${newStatus}.`, 'success');
        refreshAllData();
      }
    } catch (err) {
      showToast(`Status update error: ${err.message}`, 'error');
    }
  };

  const reassignTaskStaff = async (taskId, newStaffId) => {
    try {
      const response = await housekeepingApi.assignStaff(taskId, newStaffId);
      if (response.success && response.data) {
        const updated = adaptHousekeepingTask(response.data);
        setHousekeepingTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
        showToast('Staff reassigned successfully.', 'success');
        refreshAllData();
      }
    } catch (err) {
      showToast(`Reassign error: ${err.message}`, 'error');
    }
  };

  const deleteHousekeepingTask = async (taskId) => {
    try {
      await housekeepingApi.delete(taskId);
      setHousekeepingTasks(prev => prev.filter(t => t.id !== taskId));
      showToast('Housekeeping task deleted.', 'info');
      refreshAllData();
    } catch (err) {
      showToast(`Delete error: ${err.message}`, 'error');
    }
  };

  // ==========================================
  // BILLING ACTIONS
  // ==========================================
  const addInvoice = async (formData) => {
    try {
      const response = await billingApi.create({
        guestId: formData.guestId,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        roomId: formData.roomId || formData.roomNumber,
        roomNumber: formData.roomNumber,
        roomType: formData.roomType,
        reservationId: formData.reservationId,
        nights: Number(formData.nights) || 1,
        roomRate: Number(formData.roomRate) || 5000,
        roomCharges: Number(formData.roomCharges) || (Number(formData.nights || 1) * Number(formData.roomRate || 5000)),
        additionalServices: formData.additionalServices || [],
        discountType: formData.discountType || 'fixed',
        discountValue: Number(formData.discountValue || 0),
        taxRate: formData.taxRate !== undefined ? Number(formData.taxRate) : undefined,
        paymentMethod: formData.paymentMethod || 'Cash',
        notes: formData.notes || ''
      });

      if (response.success && response.data) {
        const newInv = adaptInvoice(response.data);
        setInvoices(prev => [newInv, ...prev]);
        showToast(`Invoice ${newInv.invoiceId} created successfully.`, 'success');
        refreshAllData();
        return newInv;
      }
    } catch (err) {
      showToast(`Invoice error: ${err.message}`, 'error');
      throw err;
    }
  };

  const updateInvoice = async (invoiceId, updatedData) => {
    try {
      const response = await billingApi.update(invoiceId, updatedData);
      if (response.success && response.data) {
        const updated = adaptInvoice(response.data);
        setInvoices(prev => prev.map(inv => (inv.id === invoiceId || inv.invoiceId === invoiceId ? updated : inv)));
        showToast(`Invoice ${invoiceId} updated successfully.`, 'success');
        refreshAllData();
        return updated;
      }
    } catch (err) {
      showToast(`Invoice update error: ${err.message}`, 'error');
      throw err;
    }
  };

  const recordPayment = async (invoiceId, paymentData) => {
    try {
      const response = await billingApi.addPayment(invoiceId, {
        amount: Number(paymentData.amount) || 0,
        paymentMethod: paymentData.method || paymentData.paymentMethod || 'Cash',
        reference: paymentData.reference || `PAY-${Date.now().toString().slice(-5)}`
      });

      if (response.success && response.data) {
        const updated = adaptInvoice(response.data);
        setInvoices(prev => prev.map(inv => (inv.id === invoiceId || inv.invoiceId === invoiceId ? updated : inv)));
        showToast('Payment recorded successfully.', 'success');
        refreshAllData();
        return updated;
      }
    } catch (err) {
      showToast(`Payment error: ${err.message}`, 'error');
      throw err;
    }
  };

  const issueInvoice = async (invoiceId) => {
    try {
      const response = await billingApi.updateStatus(invoiceId, 'Issued');
      if (response.success) {
        showToast(`Invoice ${invoiceId} issued successfully.`, 'success');
        refreshAllData();
      }
    } catch (err) {
      showToast(`Issue error: ${err.message}`, 'error');
    }
  };

  const cancelInvoice = async (invoiceId) => {
    try {
      const response = await billingApi.cancel(invoiceId);
      if (response.success) {
        showToast(`Invoice ${invoiceId} cancelled.`, 'info');
        refreshAllData();
      }
    } catch (err) {
      showToast(`Cancel error: ${err.message}`, 'error');
    }
  };

  // ==========================================
  // GUEST ACTIONS
  // ==========================================
  const addGuest = async (formData) => {
    try {
      const response = await guestsApi.create({
        name: formData.name || formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        pincode: formData.pincode || '',
        nationality: formData.nationality || 'Indian',
        idType: formData.idType || 'Aadhaar',
        idNumber: formData.idNumber || '',
        dateOfBirth: formData.dateOfBirth || null,
        guestType: formData.guestType || 'New Guest',
        status: formData.status || 'Upcoming',
        preferences: formData.preferences || '',
        specialRequests: formData.specialRequests || ''
      });

      if (response.success && response.data) {
        const newGuest = adaptGuest(response.data);
        setGuests(prev => [newGuest, ...prev]);
        showToast('Guest added successfully.', 'success');
        refreshAllData();
        return newGuest;
      }
    } catch (err) {
      showToast(`Failed to add guest: ${err.message}`, 'error');
      throw err;
    }
  };

  const updateGuest = async (id, updatedData) => {
    try {
      const response = await guestsApi.update(id, updatedData);
      if (response.success && response.data) {
        const updated = adaptGuest(response.data);
        setGuests(prev => prev.map(g => (g.id === id ? updated : g)));
        showToast('Guest details updated successfully.', 'success');
        refreshAllData();
        return updated;
      }
    } catch (err) {
      showToast(`Failed to update guest: ${err.message}`, 'error');
      throw err;
    }
  };

  const changeGuestStatus = async (id, newStatus) => {
    try {
      const response = await guestsApi.updateStatus(id, newStatus);
      if (response.success && response.data) {
        const updated = adaptGuest(response.data);
        setGuests(prev => prev.map(g => (g.id === id ? updated : g)));
        showToast(`Guest status updated to ${newStatus}.`, 'success');
        refreshAllData();
      }
    } catch (err) {
      showToast(`Status update failed: ${err.message}`, 'error');
    }
  };

  const markGuestInactive = (id) => changeGuestStatus(id, 'Inactive');

  // ==========================================
  // STAFF ACTIONS
  // ==========================================
  const addStaff = async (formData) => {
    try {
      const response = await staffApi.create({
        name: formData.name || formData.fullName,
        email: formData.email,
        phone: formData.phone || '',
        role: formData.role || 'Staff',
        department: formData.department || 'Front Office',
        shift: formData.shift || 'Morning',
        status: formData.status || 'Active'
      });

      if (response.success && response.data) {
        const newStaff = adaptStaff(response.data);
        setStaff(prev => [newStaff, ...prev]);
        showToast(`Staff member ${newStaff.name} added successfully.`, 'success');
        refreshAllData();
        return newStaff;
      }
    } catch (err) {
      showToast(`Failed to create staff: ${err.message}`, 'error');
      throw err;
    }
  };

  const updateStaff = async (id, updatedData) => {
    try {
      const response = await staffApi.update(id, updatedData);
      if (response.success && response.data) {
        const updated = adaptStaff(response.data);
        setStaff(prev => prev.map(s => (s.id === id ? updated : s)));
        showToast('Staff details updated successfully.', 'success');
        refreshAllData();
        return updated;
      }
    } catch (err) {
      showToast(`Failed to update staff: ${err.message}`, 'error');
      throw err;
    }
  };

  const changeStaffStatus = async (id, newStatus) => {
    try {
      const response = await staffApi.updateStatus(id, newStatus);
      if (response.success && response.data) {
        const updated = adaptStaff(response.data);
        setStaff(prev => prev.map(s => (s.id === id ? updated : s)));
        showToast(`Staff status changed to ${newStatus}.`, 'success');
        refreshAllData();
      }
    } catch (err) {
      showToast(`Status update failed: ${err.message}`, 'error');
    }
  };

  const deactivateStaff = (id) => changeStaffStatus(id, 'Inactive');

  // ==========================================
  // SETTINGS ACTIONS
  // ==========================================
  const updateHotelProfile = async (profileData) => {
    try {
      const response = await settingsApi.updateSettings({ hotelProfile: profileData });
      if (response.success && response.data) {
        setSettings(response.data);
        showToast('Hotel Profile updated successfully.', 'success');
        refreshAllData();
      }
    } catch (err) {
      showToast(`Settings update failed: ${err.message}`, 'error');
    }
  };

  const updateGeneralSettings = async (generalData) => {
    try {
      const response = await settingsApi.updateSettings({ general: generalData });
      if (response.success && response.data) {
        setSettings(response.data);
        showToast('General Settings updated successfully.', 'success');
        refreshAllData();
      }
    } catch (err) {
      showToast(`Settings update failed: ${err.message}`, 'error');
    }
  };

  const updateBillingSettings = async (billingData) => {
    try {
      const response = await settingsApi.updateSettings({ billing: billingData });
      if (response.success && response.data) {
        setSettings(response.data);
        if (billingData.taxRate !== undefined) setTaxRate(Number(billingData.taxRate));
        showToast('Billing & Tax Settings updated successfully.', 'success');
        refreshAllData();
      }
    } catch (err) {
      showToast(`Settings update failed: ${err.message}`, 'error');
    }
  };

  const updateInvoiceSettings = async (invoiceData) => {
    try {
      const response = await settingsApi.updateSettings({ invoice: invoiceData });
      if (response.success && response.data) {
        setSettings(response.data);
        showToast('Invoice Settings updated successfully.', 'success');
        refreshAllData();
      }
    } catch (err) {
      showToast(`Settings update failed: ${err.message}`, 'error');
    }
  };

  const updateNotificationSettings = (notificationData) => {
    setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, ...notificationData } }));
    showToast('Notification preferences saved.', 'success');
  };

  const updateAppearanceSettings = (appearanceData) => {
    setSettings(prev => ({ ...prev, appearance: { ...prev.appearance, ...appearanceData } }));
    showToast('Appearance settings saved.', 'success');
  };

  // Seasonal Pricing Rules (Local UI utility)
  const addSeasonalPricing = (ruleData) => {
    const newId = `SP-0${seasonalPricing.length + 1}`;
    const newRule = {
      id: newId,
      name: ruleData.name,
      startDate: ruleData.startDate,
      endDate: ruleData.endDate,
      adjustmentPercent: Number(ruleData.adjustmentPercent) || 10,
      isActive: true
    };
    setSeasonalPricing(prev => [...prev, newRule]);
    showToast(`Seasonal pricing '${ruleData.name}' created!`, 'success');
  };

  const toggleSeasonalPricing = (id) => {
    setSeasonalPricing(prev => prev.map(sp => (sp.id === id ? { ...sp, isActive: !sp.isActive } : sp)));
  };

  const addRoomType = (typeData) => {
    const nextId = `RT-${100 + roomTypes.length + 1}`;
    const newType = {
      id: nextId,
      name: typeData.name,
      description: typeData.description || '',
      defaultPrice: Number(typeData.defaultPrice) || 5000,
      maxGuests: Number(typeData.maxGuests) || 2,
      amenities: typeData.amenities || '',
      status: typeData.status || 'Active'
    };
    setRoomTypes(prev => [...prev, newType]);
    showToast(`Room Type '${typeData.name}' created successfully.`, 'success');
    return newType;
  };

  const updateRoomType = (id, updatedData) => {
    setRoomTypes(prev => prev.map(rt => (rt.id === id ? { ...rt, ...updatedData } : rt)));
    showToast('Room Type updated successfully.', 'success');
  };

  const toggleRoomTypeStatus = (id) => {
    setRoomTypes(prev =>
      prev.map(rt => {
        if (rt.id === id) {
          const nextStatus = rt.status === 'Active' ? 'Inactive' : 'Active';
          showToast(`Room Type '${rt.name}' set to ${nextStatus}.`, 'success');
          return { ...rt, status: nextStatus };
        }
        return rt;
      })
    );
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        rooms,
        guests,
        staff,
        settings,
        roomTypes,
        seasonalPricing,
        housekeepingTasks,
        housekeepingStaff,
        invoices,
        dashboardSummary,
        taxRate,
        setTaxRate,
        isLoading,
        error,
        refreshAllData,
        toast,
        showToast,
        hideToast,
        addReservation,
        updateReservation,
        cancelReservation,
        checkoutGuest,
        addRoom,
        updateRoom,
        changeRoomStatus,
        changeHousekeepingStatus,
        addHousekeepingTask,
        updateHousekeepingTask,
        updateHousekeepingTaskStatus,
        reassignTaskStaff,
        deleteHousekeepingTask,
        addInvoice,
        updateInvoice,
        recordPayment,
        issueInvoice,
        cancelInvoice,
        addSeasonalPricing,
        toggleSeasonalPricing,
        addGuest,
        updateGuest,
        changeGuestStatus,
        markGuestInactive,
        addStaff,
        updateStaff,
        changeStaffStatus,
        deactivateStaff,
        updateHotelProfile,
        updateGeneralSettings,
        updateBillingSettings,
        updateInvoiceSettings,
        updateNotificationSettings,
        updateAppearanceSettings,
        addRoomType,
        updateRoomType,
        toggleRoomTypeStatus
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
};

export const useHotel = useReservations;

export default ReservationContext;
