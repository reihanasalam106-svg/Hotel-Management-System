import { roomService } from '../services/roomService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const roomController = {
  async getAllRooms(req, res, next) {
    try {
      const rooms = await roomService.getAllRooms(req.query);
      return sendSuccess(res, 'Rooms retrieved successfully', rooms);
    } catch (err) {
      next(err);
    }
  },

  async getRoomById(req, res, next) {
    try {
      const room = await roomService.getRoomById(req.params.id);
      return sendSuccess(res, 'Room retrieved successfully', room);
    } catch (err) {
      next(err);
    }
  },

  async createRoom(req, res, next) {
    try {
      const room = await roomService.createRoom(req.body);
      return sendSuccess(res, 'Room created successfully', room, 201);
    } catch (err) {
      next(err);
    }
  },

  async updateRoom(req, res, next) {
    try {
      const room = await roomService.updateRoom(req.params.id, req.body);
      return sendSuccess(res, 'Room updated successfully', room);
    } catch (err) {
      next(err);
    }
  },

  async updateRoomStatus(req, res, next) {
    try {
      const { status, housekeepingStatus } = req.body;
      const room = await roomService.updateRoomStatus(req.params.id, { status, housekeepingStatus });
      return sendSuccess(res, 'Room status updated successfully', room);
    } catch (err) {
      next(err);
    }
  },

  async deleteRoom(req, res, next) {
    try {
      await roomService.deleteRoom(req.params.id);
      return sendSuccess(res, 'Room deleted successfully', { id: req.params.id });
    } catch (err) {
      next(err);
    }
  }
};
