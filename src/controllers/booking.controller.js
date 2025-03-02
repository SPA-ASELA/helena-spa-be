const { bookingService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const createBooking = catchAsync(async (req, res) => {
    const booking = await bookingService.createBooking(req.body);
    res.status(httpStatus.CREATED).send(booking);
});

const getAllBookings = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const bookings = await bookingService.getAllBookings(filter, options);
    res.status(httpStatus.OK).send(bookings);
});

const getBooking = catchAsync(async (req, res) => {
    const booking = await bookingService.getBooking(req.params.id);
    res.status(httpStatus.OK).send(booking);
});

const changeBookingStatus = catchAsync(async (req, res) => {
    const booking = await bookingService.changeBookingStatus(req.body.id, req.body.status);
    res.status(httpStatus.OK).send(booking);
});

module.exports = {
    createBooking,
    getAllBookings,
    getBooking,
    changeBookingStatus
}