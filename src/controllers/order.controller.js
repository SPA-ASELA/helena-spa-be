const { orderService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const createOrder = catchAsync(async (req, res) => {
    const order = await orderService.createOrder(req.body);
    res.status(httpStatus.CREATED).send(order);
});

const getOrders = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const orders = await orderService.getOrders(filter, options);
    res.send(orders);
});

const getOrder = catchAsync(async (req, res) => {
    const order = await orderService.getOrder(req.params.id);
    res.send(order);
});

const orderAction = catchAsync(async (req, res) => {
    const order = await orderService.orderAction(req.body.id, req.body.status);
    res.send(order);
});

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    orderAction
}