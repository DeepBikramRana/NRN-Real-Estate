import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    // Client who made the appointment
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Agent assigned to the appointment
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Property/Listing for the appointment
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    // Appointment details
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'canceled', 'completed'],
      default: 'pending',
    },
    // Additional client info (can be different from user profile)
    clientInfo: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    // Property address for quick reference
    propertyAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
appointmentSchema.index({ agent: 1, date: 1 });
appointmentSchema.index({ client: 1, date: 1 });
appointmentSchema.index({ status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;