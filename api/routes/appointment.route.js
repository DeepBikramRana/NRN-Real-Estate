import express from 'express';
import {
  createAppointment,
  getAgentAppointments,
  getClientAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAppointmentById,
  getAllAppointments
} from '../controllers/appointment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { validateAppointment } from '../middleware/validateAppointment.js';

const router = express.Router();

// Create new appointment
router.post('/create', verifyToken, validateAppointment, createAppointment);

// Get appointments for the current agent
router.get('/agent', verifyToken, getAgentAppointments);

// Get appointments for the current client
router.get('/client', verifyToken, getClientAppointments);

// Get all appointments (admin only)
router.get('/all', verifyToken, getAllAppointments);

// Get specific appointment details
router.get('/:id', verifyToken, getAppointmentById);

// Update appointment status (agent/admin only)
router.put('/:id/status', verifyToken, updateAppointmentStatus);

// Cancel appointment
router.put('/:id/cancel', verifyToken, cancelAppointment);

// Delete appointment (admin only)
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Admin access required'));
    }

    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return next(errorHandler(404, 'Appointment not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;