import Appointment from '../models/appointment.model.js';
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

// Create new appointment
export const createAppointment = async (req, res, next) => {
  try {
    const { property, agent, date, time, message, clientInfo, propertyAddress } = req.body;

    // Validate required fields
    if (!property || !agent || !date || !time || !clientInfo) {
      return next(errorHandler(400, 'Missing required fields'));
    }

    // Verify the agent exists and is actually an agent
    const agentUser = await User.findById(agent);
    if (!agentUser || !agentUser.isAgent) {
      return next(errorHandler(400, 'Invalid agent selected'));
    }

    // Verify the property exists
    const propertyExists = await Listing.findById(property);
    if (!propertyExists) {
      return next(errorHandler(400, 'Property not found'));
    }

    // Check for conflicting appointments (same agent, same date, same time)
    const conflictingAppointment = await Appointment.findOne({
      agent,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingAppointment) {
      return next(errorHandler(400, 'Agent is not available at this time'));
    }

    const appointment = new Appointment({
      property,
      agent,
      client: req.user.id,
      date: new Date(date),
      time,
      message: message || '',
      clientInfo,
      propertyAddress: propertyAddress || propertyExists.address,
      status: 'pending'
    });

    await appointment.save();
    
    // Populate references before sending response
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('property', 'name regularPrice address imageUrls type')
      .populate('client', 'username email avatar')
      .populate('agent', 'username email avatar');

    res.status(201).json({
      success: true,
      message: 'Appointment requested successfully',
      appointment: populatedAppointment
    });

  } catch (error) {
    next(error);
  }
};

// Get appointments for an agent
export const getAgentAppointments = async (req, res, next) => {
  try {
    if (!req.user.isAgent && !req.user.isAdmin) {
      return next(errorHandler(403, 'Access denied. Agent privileges required.'));
    }

    const { status, date, page = 1, limit = 10 } = req.query;
    let query = { agent: req.user.id };

    // Add status filter if provided
    if (status && ['pending', 'confirmed', 'canceled', 'completed'].includes(status)) {
      query.status = status;
    }

    // Add date filter if provided
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(query)
      .populate('property', 'name regularPrice address imageUrls type')
      .populate('client', 'username email avatar')
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get appointments for a client
export const getClientAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ client: req.user.id })
      .populate('property', 'name regularPrice address imageUrls type')
      .populate('agent', 'username email avatar')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      appointments
    });

  } catch (error) {
    next(error);
  }
};

// Update appointment status (agent only)
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'canceled', 'completed'].includes(status)) {
      return next(errorHandler(400, 'Invalid status'));
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(errorHandler(404, 'Appointment not found'));
    }

    // Check if user is the agent for this appointment or an admin
    if (appointment.agent.toString() !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, 'You can only update your own appointments'));
    }

    appointment.status = status;
    await appointment.save();

    const updatedAppointment = await Appointment.findById(id)
      .populate('property', 'name regularPrice address imageUrls type')
      .populate('client', 'username email avatar')
      .populate('agent', 'username email avatar');

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment: updatedAppointment
    });

  } catch (error) {
    next(error);
  }
};

// Cancel appointment (client or agent)
export const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(errorHandler(404, 'Appointment not found'));
    }

    // Check if user is the client, agent, or admin
    const isAuthorized = 
      appointment.client.toString() === req.user.id ||
      appointment.agent.toString() === req.user.id ||
      req.user.isAdmin;

    if (!isAuthorized) {
      return next(errorHandler(403, 'You can only cancel your own appointments'));
    }

    if (appointment.status === 'canceled') {
      return next(errorHandler(400, 'Appointment is already canceled'));
    }

    appointment.status = 'canceled';
    await appointment.save();

    const updatedAppointment = await Appointment.findById(id)
      .populate('property', 'name regularPrice address imageUrls type')
      .populate('client', 'username email avatar')
      .populate('agent', 'username email avatar');

    res.status(200).json({
      success: true,
      message: 'Appointment canceled successfully',
      appointment: updatedAppointment
    });

  } catch (error) {
    next(error);
  }
};

// Get appointment details
export const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findById(id)
      .populate('property', 'name regularPrice address imageUrls type')
      .populate('client', 'username email avatar')
      .populate('agent', 'username email avatar');

    if (!appointment) {
      return next(errorHandler(404, 'Appointment not found'));
    }

    // Check if user is involved in this appointment or is admin
    const isAuthorized = 
      appointment.client._id.toString() === req.user.id ||
      appointment.agent._id.toString() === req.user.id ||
      req.user.isAdmin;

    if (!isAuthorized) {
      return next(errorHandler(403, 'Access denied'));
    }

    res.status(200).json({
      success: true,
      appointment
    });

  } catch (error) {
    next(error);
  }
};

// Get all appointments (admin only)
export const getAllAppointments = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'Admin access required'));
    }

    const { status, page = 1, limit = 10 } = req.query;
    let query = {};

    if (status && ['pending', 'confirmed', 'canceled', 'completed'].includes(status)) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(query)
      .populate('property', 'name regularPrice address imageUrls type')
      .populate('client', 'username email avatar')
      .populate('agent', 'username email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
};