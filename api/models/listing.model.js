import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    regularPrice: {
      type: Number,
      required: true,
      min: 0
    },
    discountPrice: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function(value) {
          return value <= this.regularPrice;
        },
        message: 'Discount price must be less than or equal to regular price'
      }
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0,
      max: 20
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0,
      max: 20
    },
    furnished: {
      type: Boolean,
      required: true
    },
    parking: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['sale', 'rent']
    },
    offer: {
      type: Boolean,
      required: true
    },
    imageUrls: {
      type: [String],
      required: true,
      validate: {
        validator: function(array) {
          return array.length > 0 && array.length <= 10;
        },
        message: 'Must have between 1-10 images'
      }
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // New fields (optional)
    isFeatured: {
      type: Boolean,
      default: false
    },
    propertyType: {
      type: String,
      enum: ['residential', 'commercial', 'land', 'industrial'],
      default: 'residential'
    },
    yearBuilt: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear()
    },
    amenities: {
      type: [String],
      default: []
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add index for better search performance
listingSchema.index({ name: 'text', description: 'text', address: 'text' });
listingSchema.index({ regularPrice: 1 });
listingSchema.index({ userRef: 1 });

// Virtual for formatted price
listingSchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.regularPrice);
});

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;