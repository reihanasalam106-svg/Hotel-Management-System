import { billingService } from '../services/billingService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const billingController = {
  async getAllInvoices(req, res, next) {
    try {
      const invoices = await billingService.getAllInvoices(req.query);
      return sendSuccess(res, 'Invoices retrieved successfully', invoices);
    } catch (err) {
      next(err);
    }
  },

  async getInvoiceById(req, res, next) {
    try {
      const invoice = await billingService.getInvoiceById(req.params.id);
      return sendSuccess(res, 'Invoice retrieved successfully', invoice);
    } catch (err) {
      next(err);
    }
  },

  async createInvoice(req, res, next) {
    try {
      const invoice = await billingService.createInvoice(req.body);
      return sendSuccess(res, 'Invoice created successfully', invoice, 201);
    } catch (err) {
      next(err);
    }
  },

  async updateInvoice(req, res, next) {
    try {
      const invoice = await billingService.updateInvoice(req.params.id, req.body);
      return sendSuccess(res, 'Invoice updated successfully', invoice);
    } catch (err) {
      next(err);
    }
  },

  async addPayment(req, res, next) {
    try {
      const invoice = await billingService.addPayment(req.params.id, req.body);
      return sendSuccess(res, 'Payment recorded successfully', invoice, 201);
    } catch (err) {
      next(err);
    }
  },

  async updateInvoiceStatus(req, res, next) {
    try {
      const { status, invoiceStatus } = req.body;
      const invoice = await billingService.updateInvoiceStatus(req.params.id, status || invoiceStatus);
      return sendSuccess(res, 'Invoice status updated successfully', invoice);
    } catch (err) {
      next(err);
    }
  },

  async cancelInvoice(req, res, next) {
    try {
      const invoice = await billingService.cancelInvoice(req.params.id);
      return sendSuccess(res, 'Invoice cancelled successfully', invoice);
    } catch (err) {
      next(err);
    }
  },

  async deleteInvoice(req, res, next) {
    try {
      await billingService.deleteInvoice(req.params.id);
      return sendSuccess(res, 'Invoice deleted successfully', { id: req.params.id });
    } catch (err) {
      next(err);
    }
  }
};
