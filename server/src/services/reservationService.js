import { reservationRepository } from '../repositories/reservationRepository.js';
import { roomRepository } from '../repositories/roomRepository.js';
import { guestRepository } from '../repositories/guestRepository.js';
import { housekeepingRepository } from '../repositories/housekeepingRepository.js';
import { auditLogRepository } from '../repositories/auditLogRepository.js';
import { withTransaction } from '../config/database.js';
import { ApiError } from '../utils/apiError.js';

export const reservationService = {
  async getAllReservations(filters) {
    return reservationRepository.findAll(filters);
  },

  async getReservationById(id) {
    const reservation = await reservationRepository.findById(id);
    if (!reservation) {
      throw ApiError.notFound(`Reservation with ID '${id}' not found`);
    }
    return reservation;
  },

  async createReservation(data) {
    const { guestId, roomId, checkIn, checkOut } = data;

    if (!checkIn || !checkOut) {
      throw ApiError.badRequest('Check-in and Check-out dates are required');
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      throw ApiError.badRequest('Invalid date format provided for check-in or check-out');
    }

    if (checkOutDate <= checkInDate) {
      throw ApiError.badRequest('Check-out date must be strictly after check-in date');
    }

    // Check Room Availability & date overlap (Section 25)
    if (roomId) {
      const availability = await reservationRepository.checkRoomAvailability(roomId, checkIn, checkOut);
      if (!availability.available) {
        throw ApiError.conflict(`Room is already reserved for overlapping dates (${availability.conflicts[0].check_in} to ${availability.conflicts[0].check_out})`);
      }
    }

    let calculatedAmount = Number(data.numericAmount || data.amount || 0);

    if (roomId && !calculatedAmount) {
      const room = await roomRepository.findById(roomId);
      if (room && room.pricePerNight) {
        const nights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));
        calculatedAmount = room.pricePerNight * nights;
      }
    }

    if (calculatedAmount < 0) {
      throw ApiError.badRequest('Reservation amount cannot be negative');
    }

    // Atomic Database Transaction for Reservation Creation + Room Status + Audit Log (Section 23)
    return await withTransaction(async (client) => {
      const newReservation = await reservationRepository.create({
        ...data,
        numericAmount: calculatedAmount
      }, client);

      // If status is Checked In, sync room and guest status atomically
      if (data.status === 'Checked In' && roomId) {
        await roomRepository.updateStatus(roomId, 'Occupied', null, client);
        if (guestId) {
          await guestRepository.updateStatus(guestId, 'In House', client);
        }
      }

      // Record Audit Log
      await auditLogRepository.log(
        'RESERVATION_CREATED',
        'reservations',
        newReservation.id,
        `Created reservation ${newReservation.id} for guest ${guestId || newReservation.guestName} in room ${roomId || 'Unassigned'}`,
        null,
        client
      );

      return newReservation;
    });
  },

  async updateReservation(id, data) {
    const existing = await reservationRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Reservation with ID '${id}' not found`);
    }

    const checkIn = data.checkIn || existing.checkIn;
    const checkOut = data.checkOut || existing.checkOut;
    const roomId = data.roomId !== undefined ? data.roomId : existing.roomId;

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (checkOutDate <= checkInDate) {
        throw ApiError.badRequest('Check-out date must be strictly after check-in date');
      }

      // Check overlap if dates or room changed (Section 25)
      if (roomId && (data.checkIn || data.checkOut || data.roomId)) {
        const availability = await reservationRepository.checkRoomAvailability(roomId, checkIn, checkOut, existing.id);
        if (!availability.available) {
          throw ApiError.conflict(`Room is already reserved for overlapping dates`);
        }
      }
    }

    if (data.numericAmount !== undefined && Number(data.numericAmount) < 0) {
      throw ApiError.badRequest('Reservation amount cannot be negative');
    }

    return reservationRepository.update(id, data);
  },

  async updateReservationStatus(id, status) {
    const existing = await reservationRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Reservation with ID '${id}' not found`);
    }

    const validStatuses = ['Confirmed', 'Checked In', 'Checked Out', 'Cancelled', 'Pending'];
    if (status && !validStatuses.includes(status)) {
      throw ApiError.badRequest(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    // Atomic Checkout / Checkin Transition (Section 23)
    return await withTransaction(async (client) => {
      const updated = await reservationRepository.updateStatus(id, status, client);

      if (existing.roomId) {
        if (status === 'Checked In') {
          await roomRepository.updateStatus(existing.roomId, 'Occupied', null, client);
          if (existing.guestId) {
            await guestRepository.updateStatus(existing.guestId, 'In House', client);
          }
        } else if (status === 'Checked Out') {
          // Checkout: Room -> Vacant + Cleaning Required, Guest -> Checked Out, Housekeeping Task auto-created
          await roomRepository.updateStatus(existing.roomId, 'Vacant', 'Cleaning Required', client);
          if (existing.guestId) {
            await guestRepository.updateStatus(existing.guestId, 'Checked Out', client);
          }

          // Automatically generate Housekeeping Checkout Task
          await housekeepingRepository.create({
            roomId: existing.roomId,
            taskType: 'Checkout Cleaning',
            priority: 'High',
            status: 'Cleaning Required',
            notes: `Auto-generated on guest checkout from reservation ${id}`
          }, client);
        } else if (status === 'Cancelled') {
          // If room was blocked, release it
          const room = await roomRepository.findById(existing.roomId);
          if (room && room.status === 'Occupied') {
            await roomRepository.updateStatus(existing.roomId, 'Vacant', 'Ready', client);
          }
        }
      }

      await auditLogRepository.log(
        'RESERVATION_STATUS_CHANGED',
        'reservations',
        id,
        `Reservation ${id} status updated from ${existing.status} to ${status}`,
        null,
        client
      );

      return updated;
    });
  },

  async deleteReservation(id) {
    const existing = await reservationRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Reservation with ID '${id}' not found`);
    }

    return reservationRepository.delete(id);
  }
};
