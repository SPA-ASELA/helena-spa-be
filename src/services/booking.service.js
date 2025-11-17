const { Booking } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { sendEmailNotification } = require('../utils/emailNotification');

/**
 * Create a booking
 * @param {Object} data
 * @returns {Promise<Booking>}
 */
const createBooking = async (data) => {
    const booking = await Booking.create(data);

    // Send email notification via Brevo
    try {
        await sendEmailNotification(booking);
        console.log('📧 Email notification sent immediately after booking creation.');
    } catch (error) {
        console.error('Failed to send email notification:', error);
    }

    return booking;
};

/**
 * Query for bookings
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllBookings = async (filter, options) => {
    if (filter.status === 'all') {
        delete filter.status;
    }
    const bookings = await Booking.paginate(filter, options);
    return bookings;
};

/**
 * Get booking by id
 * @param {ObjectId} id
 * @returns {Promise<Booking>}
 */
const getBooking = async (id) => {
    const booking = await Booking.findById(id);
    if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }
    return booking;
};

const changeBookingStatus = async (id, status) => {
    const booking = await Booking.findById(id);
    if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }
    booking.status = status;
    await booking.save();
    return booking;
};

module.exports = {
    createBooking,
    getAllBookings,
    getBooking,
    changeBookingStatus
}