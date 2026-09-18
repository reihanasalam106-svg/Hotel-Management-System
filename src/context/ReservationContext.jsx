import React, { createContext, useContext, useState } from 'react';
import {
  recentReservations,
  sampleRooms,
  sampleSeasonalPricing,
  sampleHousekeepingStaff,
  sampleHousekeepingTasks,
  sampleInvoices
} from '../data/mockData';

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState(recentReservations);
  const [rooms, setRooms] = useState(sampleRooms);
  const [seasonalPricing, setSeasonalPricing] = useState(sampleSeasonalPricing);
  const [housekeepingTasks, setHousekeepingTasks] = useState(sampleHousekeepingTasks);
  const [housekeepingStaff, setHousekeepingStaff] = useState(sampleHousekeepingStaff);
  const [invoices, setInvoices] = useState(sampleInvoices);
  const [taxRate, setTaxRate] = useState(18);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const hideToast = () => setToast(null);

  // Helper to format timestamps
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

  // Add a new reservation
  const addReservation = (formData) => {
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
    
    const selectedRoomObj = rooms.find((r) => r.number === formData.roomNumber);
    const ratePerNight = selectedRoomObj ? selectedRoomObj.ratePerNight : 5000;
    const totalAmountNum = nights * ratePerNight;
    const formattedAmount = `₹${totalAmountNum.toLocaleString('en-IN')}`;

    const nextIdNum = reservations.reduce((max, r) => {
      const num = parseInt(r.id.replace('RES-', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 1000) + 1;
    const newId = `RES-${nextIdNum}`;

    const newReservation = {
      id: newId,
      guestName: formData.guestName,
      email: formData.email || '',
      phone: formData.phone,
      roomNumber: formData.roomNumber,
      room: `Room ${formData.roomNumber}`,
      roomType: formData.roomType,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: Number(formData.guests) || 1,
      status: 'Confirmed',
      amount: formattedAmount,
      numericAmount: totalAmountNum,
      paymentStatus: formData.paymentStatus || 'Pending',
      specialRequest: formData.specialRequest || 'None'
    };

    setReservations((prev) => [newReservation, ...prev]);

    if (newReservation.status === 'Checked In') {
      setRooms((prevRooms) =>
        prevRooms.map((r) =>
          r.number === formData.roomNumber ? { ...r, status: 'Occupied', currentGuest: formData.guestName } : r
        )
      );
    }

    showToast(`Reservation ${newId} created successfully!`, 'success');
    return newReservation;
  };

  // Update an existing reservation
  const updateReservation = (id, updatedData) => {
    const checkInDate = new Date(updatedData.checkIn);
    const checkOutDate = new Date(updatedData.checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

    const selectedRoomObj = rooms.find((r) => r.number === updatedData.roomNumber);
    const ratePerNight = selectedRoomObj ? selectedRoomObj.ratePerNight : 5000;
    const totalAmountNum = nights * ratePerNight;
    const formattedAmount = `₹${totalAmountNum.toLocaleString('en-IN')}`;

    setReservations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            guestName: updatedData.guestName,
            email: updatedData.email,
            phone: updatedData.phone,
            roomNumber: updatedData.roomNumber,
            room: `Room ${updatedData.roomNumber}`,
            roomType: updatedData.roomType,
            checkIn: updatedData.checkIn,
            checkOut: updatedData.checkOut,
            guests: Number(updatedData.guests),
            paymentStatus: updatedData.paymentStatus,
            specialRequest: updatedData.specialRequest,
            amount: formattedAmount,
            numericAmount: totalAmountNum
          };
        }
        return item;
      })
    );

    showToast(`Reservation ${id} updated successfully.`, 'success');
  };

  // Cancel reservation
  const cancelReservation = (id) => {
    let targetRoomNumber = null;
    setReservations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          targetRoomNumber = item.roomNumber;
          return {
            ...item,
            status: 'Cancelled',
            amount: '₹0',
            numericAmount: 0,
            paymentStatus: 'Refunded'
          };
        }
        return item;
      })
    );

    if (targetRoomNumber) {
      setRooms((prevRooms) =>
        prevRooms.map((r) =>
          r.number === targetRoomNumber ? { ...r, status: 'Vacant', currentGuest: null } : r
        )
      );
    }

    showToast(`Reservation ${id} has been cancelled.`, 'info');
  };

  // --- ROOM MANAGEMENT METHODS ---

  // Add Room
  const addRoom = (roomData) => {
    const exists = rooms.some((r) => r.number.toLowerCase() === roomData.roomNumber.trim().toLowerCase());
    if (exists) {
      return { success: false, error: 'Room number already exists. Please choose a unique room number.' };
    }

    const priceNum = Number(roomData.pricePerNight) || 5000;
    const newRoom = {
      id: roomData.roomNumber.trim(),
      number: roomData.roomNumber.trim(),
      type: roomData.roomType,
      floor: roomData.floor,
      ratePerNight: priceNum,
      rate: `₹${priceNum.toLocaleString('en-IN')}/night`,
      status: roomData.status || 'Vacant',
      housekeepingStatus: roomData.housekeepingStatus || 'Ready',
      currentGuest: roomData.status === 'Occupied' ? roomData.currentGuest || 'Guest' : null,
      housekeeper: 'Assigned Staff',
      description: roomData.description || 'Standard hotel room.'
    };

    setRooms((prev) => [...prev, newRoom]);
    showToast(`Room ${newRoom.number} added successfully!`, 'success');
    return { success: true, room: newRoom };
  };

  // Update Room
  const updateRoom = (roomId, roomData) => {
    const priceNum = Number(roomData.pricePerNight) || 5000;
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          return {
            ...r,
            type: roomData.roomType,
            floor: roomData.floor,
            ratePerNight: priceNum,
            rate: `₹${priceNum.toLocaleString('en-IN')}/night`,
            status: roomData.status,
            housekeepingStatus: roomData.housekeepingStatus,
            description: roomData.description,
            currentGuest: roomData.status === 'Occupied' ? (roomData.currentGuest || r.currentGuest || 'Guest') : null
          };
        }
        return r;
      })
    );
    showToast(`Room ${roomId} updated successfully.`, 'success');
  };

  // Quick Change Room Status
  const changeRoomStatus = (roomId, newStatus) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              status: newStatus,
              currentGuest: newStatus === 'Vacant' || newStatus === 'Out of Service' || newStatus === 'Maintenance' ? null : r.currentGuest
            }
          : r
      )
    );
    showToast(`Room ${roomId} status changed to ${newStatus}.`, 'info');
  };

  // Quick Change Housekeeping Status
  const changeHousekeepingStatus = (roomId, newHousekeepingStatus) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, housekeepingStatus: newHousekeepingStatus } : r))
    );
    setHousekeepingTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.roomNumber === String(roomId) ? { ...t, status: newHousekeepingStatus, updatedAt: getFormattedDateTime() } : t
      )
    );
    showToast(`Room ${roomId} housekeeping status set to ${newHousekeepingStatus}.`, 'info');
  };

  // --- HOUSEKEEPING MANAGEMENT METHODS ---

  const addHousekeepingTask = (formData) => {
    const nextIdNum = housekeepingTasks.reduce((max, t) => {
      const num = parseInt(t.id.replace('HK-', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 1000) + 1;
    const newId = `HK-${nextIdNum}`;
    const nowStr = getFormattedDateTime();

    const newTask = {
      id: newId,
      roomNumber: String(formData.roomNumber),
      taskType: formData.taskType,
      priority: formData.priority,
      assignedStaffId: formData.assignedStaffId,
      status: formData.status || 'Cleaning Required',
      dueTime: formData.dueTime || '12:00 PM',
      notes: formData.notes || '',
      createdAt: nowStr,
      updatedAt: nowStr
    };

    setHousekeepingTasks((prev) => [newTask, ...prev]);

    setRooms((prevRooms) =>
      prevRooms.map((r) =>
        r.number === String(formData.roomNumber)
          ? { ...r, housekeepingStatus: newTask.status }
          : r
      )
    );

    if (formData.assignedStaffId) {
      setHousekeepingStaff((prevStaff) =>
        prevStaff.map((s) =>
          s.id === formData.assignedStaffId
            ? { ...s, assignedTasks: s.assignedTasks + 1 }
            : s
        )
      );
    }

    showToast('Housekeeping task created successfully.', 'success');
    return newTask;
  };

  const updateHousekeepingTask = (taskId, updatedData) => {
    const nowStr = getFormattedDateTime();
    let targetRoomNumber = null;
    let targetStatus = null;

    setHousekeepingTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          targetRoomNumber = updatedData.roomNumber || t.roomNumber;
          targetStatus = updatedData.status || t.status;
          return {
            ...t,
            roomNumber: String(updatedData.roomNumber || t.roomNumber),
            taskType: updatedData.taskType || t.taskType,
            priority: updatedData.priority || t.priority,
            assignedStaffId: updatedData.assignedStaffId || t.assignedStaffId,
            dueTime: updatedData.dueTime || t.dueTime,
            notes: updatedData.notes !== undefined ? updatedData.notes : t.notes,
            status: updatedData.status || t.status,
            updatedAt: nowStr
          };
        }
        return t;
      })
    );

    if (targetRoomNumber && targetStatus) {
      setRooms((prevRooms) =>
        prevRooms.map((r) =>
          r.number === String(targetRoomNumber)
            ? { ...r, housekeepingStatus: targetStatus }
            : r
        )
      );
    }

    showToast('Housekeeping task updated successfully.', 'success');
  };

  const updateHousekeepingTaskStatus = (taskId, newStatus) => {
    const nowStr = getFormattedDateTime();
    let targetRoomNumber = null;

    setHousekeepingTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          targetRoomNumber = t.roomNumber;
          return {
            ...t,
            status: newStatus,
            updatedAt: nowStr
          };
        }
        return t;
      })
    );

    if (targetRoomNumber) {
      setRooms((prevRooms) =>
        prevRooms.map((r) =>
          r.number === String(targetRoomNumber)
            ? { ...r, housekeepingStatus: newStatus }
            : r
        )
      );
    }

    showToast(`Housekeeping status set to ${newStatus}.`, 'success');
  };

  const reassignTaskStaff = (taskId, newStaffId) => {
    const nowStr = getFormattedDateTime();
    let oldStaffId = null;

    setHousekeepingTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          oldStaffId = t.assignedStaffId;
          return {
            ...t,
            assignedStaffId: newStaffId,
            updatedAt: nowStr
          };
        }
        return t;
      })
    );

    setHousekeepingStaff((prevStaff) =>
      prevStaff.map((s) => {
        if (s.id === oldStaffId && s.assignedTasks > 0) {
          return { ...s, assignedTasks: s.assignedTasks - 1 };
        }
        if (s.id === newStaffId) {
          return { ...s, assignedTasks: s.assignedTasks + 1 };
        }
        return s;
      })
    );

    showToast('Staff reassigned successfully.', 'success');
  };

  const deleteHousekeepingTask = (taskId) => {
    let assignedStaffId = null;
    setHousekeepingTasks((prev) => {
      const target = prev.find((t) => t.id === taskId);
      if (target) assignedStaffId = target.assignedStaffId;
      return prev.filter((t) => t.id !== taskId);
    });

    if (assignedStaffId) {
      setHousekeepingStaff((prevStaff) =>
        prevStaff.map((s) =>
          s.id === assignedStaffId && s.assignedTasks > 0
            ? { ...s, assignedTasks: s.assignedTasks - 1 }
            : s
        )
      );
    }

    showToast('Housekeeping task deleted.', 'info');
  };

  const checkoutGuest = (reservationId) => {
    let targetRoomNumber = null;
    let targetGuestName = null;

    setReservations((prev) =>
      prev.map((res) => {
        if (res.id === reservationId) {
          targetRoomNumber = res.roomNumber;
          targetGuestName = res.guestName;
          return { ...res, status: 'Checked Out' };
        }
        return res;
      })
    );

    if (targetRoomNumber) {
      setRooms((prevRooms) =>
        prevRooms.map((r) =>
          r.number === String(targetRoomNumber)
            ? { ...r, status: 'Vacant', currentGuest: null, housekeepingStatus: 'Cleaning Required' }
            : r
        )
      );

      const existingTask = housekeepingTasks.find((t) => t.roomNumber === String(targetRoomNumber) && t.status !== 'Ready');
      if (existingTask) {
        updateHousekeepingTaskStatus(existingTask.id, 'Cleaning Required');
      } else {
        addHousekeepingTask({
          roomNumber: targetRoomNumber,
          taskType: 'Checkout Cleaning',
          priority: 'High',
          assignedStaffId: 'HKST-001',
          status: 'Cleaning Required',
          dueTime: '12:00 PM',
          notes: `Guest ${targetGuestName || ''} checked out. Room needs full checkout cleaning.`
        });
      }
    }

    showToast(`Guest checked out. Room ${targetRoomNumber} set to Cleaning Required.`, 'success');
  };

  // --- BILLING & INVOICING METHODS ---

  const addInvoice = (formData) => {
    const nextIdNum = invoices.reduce((max, inv) => {
      const num = parseInt(inv.invoiceId.replace('INV-', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 1000) + 1;

    const invoiceId = `INV-${nextIdNum}`;
    const billId = `BILL-${nextIdNum}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const nights = Number(formData.nights) || 1;
    const roomRate = Number(formData.roomRate) || 5000;
    const roomCharges = nights * roomRate;

    const additionalServices = (formData.additionalServices || []).map((s, idx) => ({
      id: s.id || `SVC-00${idx + 1}`,
      name: s.name,
      quantity: Number(s.quantity) || 1,
      unitPrice: Number(s.unitPrice) || 0,
      total: (Number(s.quantity) || 1) * (Number(s.unitPrice) || 0)
    }));

    const servicesTotal = additionalServices.reduce((acc, curr) => acc + curr.total, 0);
    const subtotal = roomCharges + servicesTotal;

    let discount = 0;
    if (formData.discountType === 'percent') {
      discount = (subtotal * (Number(formData.discountValue) || 0)) / 100;
    } else {
      discount = Number(formData.discountValue) || 0;
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const currentTaxRate = formData.taxRate !== undefined ? Number(formData.taxRate) : taxRate;
    const taxAmount = Math.round((taxableAmount * currentTaxRate) / 100);
    const totalAmount = taxableAmount + taxAmount;
    const paidAmount = Number(formData.paidAmount) || 0;
    const balanceAmount = Math.max(0, totalAmount - paidAmount);

    let paymentStatus = 'Pending';
    if (paidAmount >= totalAmount && totalAmount > 0) paymentStatus = 'Paid';
    else if (paidAmount > 0) paymentStatus = 'Partial';

    const newInvoice = {
      id: billId,
      invoiceId,
      reservationId: formData.reservationId,
      guestId: formData.guestId || 'G-1001',
      guestName: formData.guestName,
      guestEmail: formData.guestEmail || '',
      guestPhone: formData.guestPhone || '',
      roomId: formData.roomId || formData.roomNumber,
      roomNumber: formData.roomNumber,
      roomType: formData.roomType,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      nights,
      roomRate,
      roomCharges,
      additionalServices,
      subtotal,
      discountType: formData.discountType || 'fixed',
      discountValue: Number(formData.discountValue) || 0,
      discount,
      taxableAmount,
      taxRate: currentTaxRate,
      taxAmount,
      totalAmount,
      paidAmount,
      balanceAmount,
      paymentStatus,
      paymentMethod: formData.paymentMethod || 'Cash',
      payments: formData.initialPayment ? [formData.initialPayment] : [],
      invoiceStatus: formData.invoiceStatus || 'Draft',
      createdAt: todayStr,
      dueDate: formData.checkOut || todayStr,
      notes: formData.notes || ''
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    showToast(`Invoice ${invoiceId} created successfully.`, 'success');
    return newInvoice;
  };

  const updateInvoice = (invoiceId, updatedData) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.invoiceId === invoiceId || inv.id === invoiceId) {
          const roomCharges = (updatedData.nights || inv.nights) * (updatedData.roomRate || inv.roomRate);
          const additionalServices = (updatedData.additionalServices || inv.additionalServices || []).map((s, idx) => ({
            id: s.id || `SVC-00${idx + 1}`,
            name: s.name,
            quantity: Number(s.quantity) || 1,
            unitPrice: Number(s.unitPrice) || 0,
            total: (Number(s.quantity) || 1) * (Number(s.unitPrice) || 0)
          }));
          const servicesTotal = additionalServices.reduce((acc, curr) => acc + curr.total, 0);
          const subtotal = roomCharges + servicesTotal;

          const discType = updatedData.discountType || inv.discountType || 'fixed';
          const discVal = updatedData.discountValue !== undefined ? Number(updatedData.discountValue) : inv.discountValue;
          let discount = 0;
          if (discType === 'percent') {
            discount = (subtotal * discVal) / 100;
          } else {
            discount = discVal;
          }

          const taxableAmount = Math.max(0, subtotal - discount);
          const curTaxRate = updatedData.taxRate !== undefined ? Number(updatedData.taxRate) : inv.taxRate;
          const taxAmount = Math.round((taxableAmount * curTaxRate) / 100);
          const totalAmount = taxableAmount + taxAmount;
          const paidAmount = inv.paidAmount;
          const balanceAmount = Math.max(0, totalAmount - paidAmount);

          let paymentStatus = 'Pending';
          if (paidAmount >= totalAmount && totalAmount > 0) paymentStatus = 'Paid';
          else if (paidAmount > 0) paymentStatus = 'Partial';

          return {
            ...inv,
            roomCharges,
            additionalServices,
            subtotal,
            discountType: discType,
            discountValue: discVal,
            discount,
            taxableAmount,
            taxRate: curTaxRate,
            taxAmount,
            totalAmount,
            balanceAmount,
            paymentStatus,
            notes: updatedData.notes !== undefined ? updatedData.notes : inv.notes
          };
        }
        return inv;
      })
    );
    showToast(`Invoice ${invoiceId} updated successfully.`, 'success');
  };

  const recordPayment = (invoiceId, paymentData) => {
    const todayStr = new Date().toISOString().split('T')[0];

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.invoiceId === invoiceId || inv.id === invoiceId) {
          const payAmt = Number(paymentData.amount) || 0;
          const nextPayId = `PAY-${inv.payments.length + 101}`;
          const newPaymentObj = {
            id: nextPayId,
            date: paymentData.date || todayStr,
            method: paymentData.method || 'Cash',
            amount: payAmt,
            reference: paymentData.reference || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
            recordedBy: paymentData.recordedBy || 'Priya Rao',
            status: 'Completed'
          };

          const updatedPayments = [...inv.payments, newPaymentObj];
          const calculatedPaid = updatedPayments.reduce((acc, p) => acc + (p.status === 'Completed' ? p.amount : 0), 0);
          const calculatedBalance = Math.max(0, inv.totalAmount - calculatedPaid);

          let calculatedStatus = 'Pending';
          if (calculatedPaid >= inv.totalAmount && inv.totalAmount > 0) calculatedStatus = 'Paid';
          else if (calculatedPaid > 0) calculatedStatus = 'Partial';

          return {
            ...inv,
            payments: updatedPayments,
            paidAmount: calculatedPaid,
            balanceAmount: calculatedBalance,
            paymentStatus: calculatedStatus,
            paymentMethod: paymentData.method || inv.paymentMethod
          };
        }
        return inv;
      })
    );

    showToast(`Payment recorded successfully.`, 'success');
  };

  const issueInvoice = (invoiceId) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.invoiceId === invoiceId || inv.id === invoiceId ? { ...inv, invoiceStatus: 'Issued' } : inv))
    );
    showToast(`Invoice ${invoiceId} issued successfully.`, 'success');
  };

  const cancelInvoice = (invoiceId) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.invoiceId === invoiceId || inv.id === invoiceId
          ? { ...inv, invoiceStatus: 'Cancelled', paymentStatus: inv.paidAmount > 0 ? 'Refunded' : 'Pending' }
          : inv
      )
    );
    showToast(`Invoice ${invoiceId} cancelled.`, 'info');
  };

  // Add Seasonal Pricing Rule
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
    setSeasonalPricing((prev) => [...prev, newRule]);
    showToast(`Seasonal pricing '${ruleData.name}' created!`, 'success');
  };

  const toggleSeasonalPricing = (id) => {
    setSeasonalPricing((prev) =>
      prev.map((sp) => (sp.id === id ? { ...sp, isActive: !sp.isActive } : sp))
    );
  };

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        rooms,
        seasonalPricing,
        housekeepingTasks,
        housekeepingStaff,
        invoices,
        taxRate,
        setTaxRate,
        toast,
        showToast,
        hideToast,
        addReservation,
        updateReservation,
        cancelReservation,
        addRoom,
        updateRoom,
        changeRoomStatus,
        changeHousekeepingStatus,
        addHousekeepingTask,
        updateHousekeepingTask,
        updateHousekeepingTaskStatus,
        reassignTaskStaff,
        deleteHousekeepingTask,
        checkoutGuest,
        addInvoice,
        updateInvoice,
        recordPayment,
        issueInvoice,
        cancelInvoice,
        addSeasonalPricing,
        toggleSeasonalPricing
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

// Also export alias useHotel for room management semantics
export const useHotel = useReservations;

