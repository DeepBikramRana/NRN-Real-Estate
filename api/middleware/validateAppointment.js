import { errorHandler } from '../utils/error.js';

export const validateAppointment = (req, res, next) => {
  console.log('Validating appointment request:', req.body);
  
  const { property, agent, date, time, clientInfo } = req.body;

  // Check required fields (updated to match controller expectations)
  if (!property) {
    return next(errorHandler(400, 'Property ID is required'));
  }

  if (!agent) {
    return next(errorHandler(400, 'Agent ID is required'));
  }

  if (!date) {
    return next(errorHandler(400, 'Appointment date is required'));
  }

  if (!time) {
    return next(errorHandler(400, 'Appointment time is required'));
  }

  if (!clientInfo || !clientInfo.name || !clientInfo.phone || !clientInfo.email) {
    return next(errorHandler(400, 'Client information (name, phone, email) is required'));
  }

  // Validate date format and ensure it's not in the past
  const appointmentDate = new Date(date);
  if (isNaN(appointmentDate.getTime())) {
    return next(errorHandler(400, 'Invalid date format'));
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (appointmentDate < today) {
    return next(errorHandler(400, 'Appointment date cannot be in the past'));
  }

  // Validate time format - accept both HH:MM and HH:MM AM/PM formats
  const time24Regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  const time12Regex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
  
  if (!time24Regex.test(time) && !time12Regex.test(time)) {
    return next(errorHandler(400, 'Invalid time format. Use HH:MM or HH:MM AM/PM format'));
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(clientInfo.email)) {
    return next(errorHandler(400, 'Invalid email format'));
  }

  // Validate phone format (basic validation - allows various formats)
  const cleanPhone = clientInfo.phone.replace(/[\s\-\(\)\.]/g, '');
  const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return next(errorHandler(400, 'Invalid phone number format'));
  }

  console.log('Validation passed ✅');
  next();
};