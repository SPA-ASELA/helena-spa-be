const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const bookingSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    service: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'expired'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.plugin(toJSON);
bookingSchema.plugin(paginate);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;