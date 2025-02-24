const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const contactSchema = mongoose.Schema(
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
        comment: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['unread', 'read'],
            default: 'unread',
        }
    },
    {
        timestamps: true,
    }
);

contactSchema.plugin(toJSON);
contactSchema.plugin(paginate);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;