const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const orderSchema = mongoose.Schema(
  {
    item: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Store',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;