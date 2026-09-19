import { roomRepository } from '../repositories/roomRepository.js';
import { ApiError } from '../utils/apiError.js';

export const roomService = {
  async getAllRooms(filters) {
    return roomRepository.findAll(filters);
  },

  async getRoomById(id) {
    const room = await roomRepository.findById(id);
    if (!room) {
      throw ApiError.notFound(`Room with ID '${id}' not found`);
    }
    return room;
  },

  async createRoom(data) {
    if (!data.roomNumber) {
      throw ApiError.badRequest('Room number is required');
    }

    const existing = await roomRepository.findByRoomNumber(data.roomNumber);
    if (existing) {
      throw ApiError.conflict(`Room number '${data.roomNumber}' already exists`);
    }

    const price = Number(data.pricePerNight ?? data.ratePerNight ?? 0);
    if (isNaN(price) || price < 0) {
      throw ApiError.badRequest('Price per night must be a positive number');
    }

    return roomRepository.create({
      ...data,
      pricePerNight: price
    });
  },

  async updateRoom(id, data) {
    const existing = await roomRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Room with ID '${id}' not found`);
    }

    if (data.roomNumber && String(data.roomNumber) !== String(existing.roomNumber)) {
      const duplicate = await roomRepository.findByRoomNumber(data.roomNumber);
      if (duplicate && String(duplicate.id) !== String(id)) {
        throw ApiError.conflict(`Room number '${data.roomNumber}' already exists`);
      }
    }

    if (data.pricePerNight !== undefined) {
      const price = Number(data.pricePerNight);
      if (isNaN(price) || price < 0) {
        throw ApiError.badRequest('Price per night must be a positive number');
      }
    }

    return roomRepository.update(id, data);
  },

  async updateRoomStatus(id, { status, housekeepingStatus }) {
    const existing = await roomRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Room with ID '${id}' not found`);
    }

    const validStatuses = ['Vacant', 'Occupied', 'Maintenance', 'Out of Service'];
    if (status && !validStatuses.includes(status)) {
      throw ApiError.badRequest(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    const validHousekeeping = ['Ready', 'Cleaning Required', 'Cleaning In Progress', 'Cleaned', 'Maintenance'];
    if (housekeepingStatus && !validHousekeeping.includes(housekeepingStatus)) {
      throw ApiError.badRequest(`Housekeeping status must be one of: ${validHousekeeping.join(', ')}`);
    }

    return roomRepository.updateStatus(id, status, housekeepingStatus);
  },

  async deleteRoom(id) {
    const existing = await roomRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Room with ID '${id}' not found`);
    }

    if (existing.status === 'Occupied') {
      throw ApiError.badRequest('Cannot delete an occupied room');
    }

    return roomRepository.delete(id);
  }
};
