import Appointment from '../models/appointment.model.js';
import { errorHandler } from '../utils/error.js';
import nodemailer from 'nodemailer';

// Verify QR payment (for agents)
export const verifyQRPayment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { verified, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate('client', 'username email')
      .populate('agent', 'username email')
      .populate('property', 'name address');

    if (!appointment) {
      return next(errorHandler(404, 'Appointment not found'));
    }

    // Check if user is the assigned agent or admin
    if (appointment.agent._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(errorHandler(403, 'Only the assigned agent or admin can verify payments'));
    }

    if (appointment.payment.method !== 'qr') {
      return next(errorHandler(400, 'This appointment does not use QR payment'));
    }

    if (appointment.payment.status === 'verified') {
      return next(errorHandler(400, 'Payment already verified'));
    }

    if (verified) {
      // Payment verified - update status and create receipt
      appointment.payment.status = 'verified';
      appointment.payment.verifiedBy = req.user.id;
      appointment.payment.verifiedAt = new Date();
      appointment.payment.verificationNotes = notes || '';
      appointment.status = 'confirmed';
      appointment.receipt = {
        receiptNumber: `REC${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        generatedDate: new Date(),
        downloadable: true,
        generatedBy: req.user.id
      };

      await appointment.save();

      // Send receipt email to customer
      if (appointment.payment.qrDetails?.customerEmail) {
        await sendReceiptEmail(appointment, appointment.payment.qrDetails.customerEmail);
      }

      res.json({
        success: true,
        message: 'Payment verified successfully and receipt generated',
        appointment
      });
    } else {
      // Payment rejected
      appointment.payment.status = 'rejected';
      appointment.payment.rejectedBy = req.user.id;
      appointment.payment.rejectedAt = new Date();
      appointment.payment.rejectionReason = notes || 'Payment verification failed';
      appointment.status = 'cancelled';
      await appointment.save();

      // Send rejection email to customer
      if (appointment.payment.qrDetails?.customerEmail) {
        await sendRejectionEmail(appointment, appointment.payment.qrDetails.customerEmail);
      }

      res.json({
        success: true,
        message: 'Payment rejected and appointment cancelled',
        appointment
      });
    }

  } catch (error) {
    console.error('Verify payment error:', error);
    next(errorHandler(500, 'Internal server error'));
  }
};

// Get payment details
export const getPaymentDetails = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate('client', 'username email')
      .populate('agent', 'username email')
      .populate('property', 'name address')
      .populate('payment.verifiedBy', 'username')
      .populate('payment.rejectedBy', 'username');

    if (!appointment) {
      return next(errorHandler(404, 'Appointment not found'));
    }

    // Check access permissions
    const hasAccess = appointment.client._id.toString() === req.user.id || 
                      appointment.agent._id.toString() === req.user.id ||
                      req.user.role === 'admin';

    if (!hasAccess) {
      return next(errorHandler(403, 'Access denied'));
    }

    res.json({
      success: true,
      payment: appointment.payment,
      appointment: {
        _id: appointment._id,
        status: appointment.status,
        date: appointment.date,
        time: appointment.time
      }
    });

  } catch (error) {
    console.error('Get payment details error:', error);
    next(errorHandler(500, 'Internal server error'));
  }
};

// Get pending payments (for agents/admins)
export const getPendingPayments = async (req, res, next) => {
  try {
    let query = {
      'payment.method': 'qr',
      'payment.status': 'pending'
    };

    // If user is agent, only show their appointments
    if (req.user.role === 'agent') {
      query.agent = req.user.id;
    }

    const appointments = await Appointment.find(query)
      .populate('client', 'username email')
      .populate('agent', 'username email')
      .populate('property', 'name address')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      pendingPayments: appointments,
      count: appointments.length
    });

  } catch (error) {
    console.error('Get pending payments error:', error);
    next(errorHandler(500, 'Internal server error'));
  }
};

// Get payment statistics (for admins)
export const getPaymentStats = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(errorHandler(403, 'Admin access required'));
    }

    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: '$payment.method',
          count: { $sum: 1 },
          totalAmount: { $sum: '$payment.amount' },
          verified: {
            $sum: {
              $cond: [{ $eq: ['$payment.status', 'verified'] }, 1, 0]
            }
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$payment.status', 'pending'] }, 1, 0]
            }
          },
          rejected: {
            $sum: {
              $cond: [{ $eq: ['$payment.status', 'rejected'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const totalStats = await Appointment.aggregate([
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
          totalRevenue: { $sum: '$payment.amount' },
          averageAmount: { $avg: '$payment.amount' }
        }
      }
    ]);

    res.json({
      success: true,
      paymentMethodStats: stats,
      overallStats: totalStats[0] || {
        totalAppointments: 0,
        totalRevenue: 0,
        averageAmount: 0
      }
    });

  } catch (error) {
    console.error('Get payment stats error:', error);
    next(errorHandler(500, 'Internal server error'));
  }
};

// Update payment amount (for admins)
export const updatePaymentAmount = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(errorHandler(403, 'Admin access required'));
    }

    const { appointmentId } = req.params;
    const { amount, reason } = req.body;

    if (!amount || amount <= 0) {
      return next(errorHandler(400, 'Valid amount is required'));
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return next(errorHandler(404, 'Appointment not found'));
    }

    if (appointment.payment.status === 'verified') {
      return next(errorHandler(400, 'Cannot modify verified payment'));
    }

    const oldAmount = appointment.payment.amount;
    appointment.payment.amount = amount;
    appointment.payment.amountHistory = appointment.payment.amountHistory || [];
    appointment.payment.amountHistory.push({
      oldAmount,
      newAmount: amount,
      changedBy: req.user.id,
      changedAt: new Date(),
      reason: reason || 'Amount updated by admin'
    });

    await appointment.save();

    res.json({
      success: true,
      message: 'Payment amount updated successfully',
      appointment
    });

  } catch (error) {
    console.error('Update payment amount error:', error);
    next(errorHandler(500, 'Internal server error'));
  }
};

// Helper function to send receipt email
const sendReceiptEmail = async (appointment, customerEmail) => {
  try {
    // Skip if no email configuration
    if (!process.env.SMTP_HOST) {
      console.log('Email configuration not found, skipping receipt email');
      return;
    }

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Payment Receipt</h2>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Receipt Number:</strong> ${appointment.receipt.receiptNumber}</p>
          <p><strong>Date Generated:</strong> ${appointment.receipt.generatedDate.toLocaleDateString()}</p>
          <p style="color: #059669;"><strong>Status:</strong> Payment Verified ✓</p>
        </div>
        
        <h3 style="color: #374151;">Appointment Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Property:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${appointment.property.name}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Address:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${appointment.property.address}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Date:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${appointment.date.toLocaleDateString()}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Time:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${appointment.time}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Agent:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${appointment.agent.username}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Amount Paid:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #059669; font-weight: bold;">$${appointment.payment.amount}</td></tr>
          <tr><td style="padding: 8px;"><strong>Payment Method:</strong></td><td style="padding: 8px;">${appointment.payment.method.toUpperCase()}</td></tr>
        </table>
        
        <div style="margin-top: 30px; padding: 20px; background: #ecfdf5; border-radius: 8px;">
          <p style="margin: 0; color: #065f46;">Thank you for your appointment! Please keep this receipt for your records.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@company.com',
      to: customerEmail,
      subject: `Payment Receipt - ${appointment.receipt.receiptNumber}`,
      html: emailContent
    });

    console.log('Receipt email sent successfully to:', customerEmail);

  } catch (error) {
    console.error('Email sending error:', error);
  }
};

// Helper function to send rejection email
const sendRejectionEmail = async (appointment, customerEmail) => {
  try {
    if (!process.env.SMTP_HOST) {
      console.log('Email configuration not found, skipping rejection email');
      return;
    }

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Payment Verification Failed</h2>
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <p><strong>Appointment ID:</strong> ${appointment._id}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p style="color: #dc2626;"><strong>Status:</strong> Payment Rejected</p>
        </div>
        
        <h3 style="color: #374151;">Appointment Details:</h3>
        <p><strong>Property:</strong> ${appointment.property.name}</p>
        <p><strong>Scheduled Date:</strong> ${appointment.date.toLocaleDateString()}</p>
        <p><strong>Scheduled Time:</strong> ${appointment.time}</p>
        <p><strong>Amount:</strong> $${appointment.payment.amount}</p>
        
        <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px;">
          <p style="margin: 0; color: #92400e;">
            <strong>What to do next:</strong><br>
            Your appointment has been cancelled due to payment verification failure. 
            Please contact us if you believe this is an error or if you'd like to reschedule.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@company.com',
      to: customerEmail,
      subject: `Payment Verification Failed - Appointment Cancelled`,
      html: emailContent
    });

  } catch (error) {
    console.error('Rejection email sending error:', error);
  }
};