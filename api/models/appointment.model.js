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
    // Payment information - Made optional
    payment: {
      method: {
        type: String,
        enum: ['cash', 'qr'],
        required: false,
        default: 'cash' // Default to cash
      },
      status: {
        type: String,
        enum: ['pending', 'verified', 'failed'],
        default: 'verified', // Default to verified for cash payments
      },
      amount: {
        type: Number,
        required: false,
        default: 100 // Default consultation fee
      },
      // For QR payments
      qrDetails: {
        customerEmail: {
          type: String,
          required: function() {
            return this.payment && this.payment.method === 'qr';
          }
        },
        transactionId: String,
        paymentDate: Date,
        verifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        verificationDate: Date,
      }
    },
    // Receipt information
    receipt: {
      receiptNumber: String,
      generatedDate: Date,
      downloadable: {
        type: Boolean,
        default: false
      }
    }
  },
  { timestamps: true }
);

// Index for efficient queries
appointmentSchema.index({ agent: 1, date: 1 });
appointmentSchema.index({ client: 1, date: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ 'payment.status': 1 });

// Pre-save middleware to generate receipt number
appointmentSchema.pre('save', function(next) {
  // Generate receipt for verified payments or cash payments
  if (this.payment && 
      (this.payment.status === 'verified' || this.payment.method === 'cash') && 
      !this.receipt.receiptNumber) {
    this.receipt.receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    this.receipt.generatedDate = new Date();
    this.receipt.downloadable = true;
  }
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;