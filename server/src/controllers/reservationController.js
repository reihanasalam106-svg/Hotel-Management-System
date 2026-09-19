import { reservationService } from '../services/reservationService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const reservationController = {
  async getAllReservations(req, res, next) {
    try {
      const reservations = await reservationService.getAllReservations(req.query);
      return sendSuccess(res, 'Reservations retrieved successfully', reservations);
    } catch (err) {
      next(err);
    }
  },

  async getReservationById(req, res, next) {
    try {
      const reservation = await reservationService.getReservationById(req.params.id);
      return sendSuccess(res, 'Reservation retrieved successfully', reservation);
    } catch (err) {
      next(err);
    }
  },

  async createReservation(req, res, next) {
    try {
      const reservation = await reservationService.createReservation(req.body);
      return sendSuccess(res, 'Reservation created successfully', reservation, 201);
    } catch (err) {
      next(err);
    }
  },

  async updateReservation(req, res, next) {
    try {
      const reservation = await reservationService.updateReservation(req.params.id, req.body);
      return sendSuccess(res, 'Reservation updated successfully', reservation);
    } catch (err) {
      next(err);
    }
  },

  async updateReservationStatus(req, res, next) {
    try {
      const { status } = req.body;
      const reservation = await reservationService.updateReservationStatus(req.params.id, status);
      return sendSuccess(res, 'Reservation status updated successfully', reservation);
    } catch (err) {
      next(err);
    }
  },

  async checkIn(req, res, next) {
    try {
      const reservation = await reservationService.updateReservationStatus(req.params.id, 'Checked In');
      return sendSuccess(res, 'Guest checked in successfully', reservation);
    } catch (err) {
      next(err);
    }
  },

  async checkOut(req, res, next) {
    try {
      const reservation = await reservationService.updateReservationStatus(req.params.id, 'Checked Out');
      return sendSuccess(res, 'Guest checked out successfully', reservation);
    } catch (err) {
      next(err);
    }
  },

  async cancelReservation(req, res, next) {
    try {
      const reservation = await reservationService.updateReservationStatus(req.params.id, 'Cancelled');
      return sendSuccess(res, 'Reservation cancelled successfully', reservation);
    } catch (err) {
      next(err);
    }
  },

  async deleteReservation(req, res, next) {
    try {
      await reservationService.deleteReservation(req.params.id);
      return sendSuccess(res, 'Reservation deleted successfully', { id: req.params.id });
    } catch (err) {
      next(err);
    }
  }
};
