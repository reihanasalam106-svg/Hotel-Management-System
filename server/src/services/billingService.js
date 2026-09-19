import { billingRepository } from '../repositories/billingRepository.js';
import { settingsRepository } from '../repositories/settingsRepository.js';
import { auditLogRepository } from '../repositories/auditLogRepository.js';
import { withTransaction } from '../config/database.js';
import { ApiError } from '../utils/apiError.js';

export const billingService = {
  async getAllInvoices(filters) {
    return billingRepository.findAll(filters);
  },

  async getInvoiceById(id) {
    const invoice = await billingRepository.findById(id);
    if (!invoice) {
      throw ApiError.notFound(`Invoice with ID '${id}' not found`);
    }
    return invoice;
  },

  /**
   * Calculate billing details with dynamic tax rate from hotel settings (Section 24)
   */
  async calculateInvoice(data) {
    const nights = Math.max(1, Number(data.nights || 1));
    const roomRate = Math.max(0, Number(data.roomRate || 0));
    const roomCharges = data.roomCharges !== undefined ? Number(data.roomCharges) : roomRate * nights;

    const services = Array.isArray(data.additionalServices) ? data.additionalServices : [];
    const servicesTotal = services.reduce((acc, svc) => {
      const q = Number(svc.quantity || 1);
      const price = Number(svc.unitPrice || svc.price || 0);
      return acc + (q * price);
    }, 0);

    const subtotal = roomCharges + servicesTotal;

    let discount = 0;
    const discountValue = Number(data.discountValue || data.discount || 0);
    if (data.discountType === 'percent') {
      discount = (subtotal * discountValue) / 100;
    } else {
      discount = discountValue;
    }
    discount = Math.min(subtotal, Math.max(0, discount));

    const taxableAmount = Math.max(0, subtotal - discount);

    // Retrieve tax rate dynamically from PostgreSQL settings (Section 24)
    let taxRate = data.taxRate;
    if (taxRate === undefined || taxRate === null) {
      taxRate = await settingsRepository.getBillingTaxRate();
    }
    taxRate = Number(taxRate || 0);

    const taxAmount = Math.round(((taxableAmount * taxRate) / 100) * 100) / 100;
    const totalAmount = Math.round((taxableAmount + taxAmount) * 100) / 100;

    const payments = Array.isArray(data.payments) ? data.payments : [];
    const paidAmount = payments.reduce((acc, p) => acc + (p.status === 'Completed' ? Number(p.amount || 0) : 0), 0);
    const balanceAmount = Math.max(0, totalAmount - paidAmount);

    let paymentStatus = 'Pending';
    if (paidAmount >= totalAmount && totalAmount > 0) {
      paymentStatus = 'Paid';
    } else if (paidAmount > 0) {
      paymentStatus = 'Partial';
    }

    return {
      nights,
      roomRate,
      roomCharges,
      additionalServices: services,
      subtotal,
      discountType: data.discountType || 'fixed',
      discountValue,
      discount,
      taxableAmount,
      taxRate,
      taxAmount,
      totalAmount,
      paidAmount,
      balanceAmount,
      paymentStatus: data.paymentStatus || paymentStatus
    };
  },

  async createInvoice(data) {
    if (!data.guestName && !data.guestId) {
      throw ApiError.badRequest('Guest information is required to generate an invoice');
    }

    const calculated = await this.calculateInvoice(data);

    if (calculated.totalAmount < 0) {
      throw ApiError.badRequest('Invoice total cannot be negative');
    }

    return await withTransaction(async (client) => {
      const invoice = await billingRepository.create({
        ...data,
        ...calculated
      }, client);

      await auditLogRepository.log(
        'INVOICE_CREATED',
        'invoices',
        invoice.id,
        `Generated invoice ${invoice.invoiceId} for total amount ₹${invoice.totalAmount}`,
        null,
        client
      );

      return invoice;
    });
  },

  async updateInvoice(id, data) {
    const existing = await billingRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Invoice with ID '${id}' not found`);
    }

    const merged = { ...existing, ...data };
    const calculated = await this.calculateInvoice(merged);

    return billingRepository.update(id, {
      ...merged,
      ...calculated
    });
  },

  async addPayment(id, paymentData) {
    const existing = await billingRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Invoice with ID '${id}' not found`);
    }

    const amount = Number(paymentData.amount || 0);
    if (isNaN(amount) || amount <= 0) {
      throw ApiError.badRequest('Payment amount must be a positive number');
    }

    if (existing.balanceAmount !== undefined && amount > Number(existing.balanceAmount)) {
      throw ApiError.badRequest(`Payment amount (₹${amount}) cannot exceed the outstanding balance of ₹${existing.balanceAmount}`);
    }

    // Atomic transaction for Payment creation + invoice balance update + audit logging (Section 23)
    return await withTransaction(async (client) => {
      const updatedInvoice = await billingRepository.addPayment(id, paymentData, client);

      await auditLogRepository.log(
        'PAYMENT_RECORDED',
        'payments',
        updatedInvoice.id,
        `Recorded ₹${amount} payment via ${paymentData.method || paymentData.paymentMethod || 'UPI'} for Invoice ${updatedInvoice.invoiceId}`,
        null,
        client
      );

      return updatedInvoice;
    });
  },

  async updateInvoiceStatus(id, invoiceStatus) {
    const existing = await billingRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Invoice with ID '${id}' not found`);
    }

    const validStatuses = ['Draft', 'Issued', 'Cancelled'];
    if (!validStatuses.includes(invoiceStatus)) {
      throw ApiError.badRequest(`Invoice status must be one of: ${validStatuses.join(', ')}`);
    }

    return billingRepository.updateStatus(id, invoiceStatus);
  },

  async cancelInvoice(id) {
    const existing = await billingRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Invoice with ID '${id}' not found`);
    }

    return await withTransaction(async (client) => {
      const cancelled = await billingRepository.cancelInvoice(id);

      await auditLogRepository.log(
        'INVOICE_CANCELLED',
        'invoices',
        id,
        `Cancelled invoice ${existing.invoiceId} and updated status to Refunded`,
        null,
        client
      );

      return cancelled;
    });
  },

  async deleteInvoice(id) {
    const existing = await billingRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Invoice with ID '${id}' not found`);
    }

    return billingRepository.delete(id);
  }
};
