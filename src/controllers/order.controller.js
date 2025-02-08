const { orderService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const createOrder = catchAsync(async (req, res) => {
    const order = await orderService.createOrder(req.body);
    res.status(httpStatus.CREATED).send(order);
});

const getOrders = catchAsync(async (req, res) => {
    const orders = await orderService.getOrders();
    res.send(orders);
});

const getOrder = catchAsync(async (req, res) => {
    const order = await orderService.getOrder(req.params.id);
    res.send(order);
});

module.exports = {
    createOrder,
    getOrders,
    getOrder
}