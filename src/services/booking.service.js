const { Booking } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

/**
 * Create a booking
 * @param {Object} data
 * @returns {Promise<Booking>}
 */
const createBooking = async (data) => {
    const booking = await Booking.create(data);
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

module.exports = {
    createBooking,
    getAllBookings,
    getBooking,
}