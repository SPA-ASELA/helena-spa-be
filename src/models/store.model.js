const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const storeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

storeSchema.plugin(toJSON);
storeSchema.plugin(paginate);

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;