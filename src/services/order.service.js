const { Store, Order } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const createOrder = async (items) => {
    for(const item of items) {
        const store = await Store.findById(item.id);
        if(!store) {
            throw new ApiError(httpStatus.NOT_FOUND, `Item ${item.name} not found or not available right now`);
        }
        if(store.quantity < item.quantity) {
            throw new ApiError(httpStatus.NOT_FOUND, `Item ${item.name} not available right now`);
        }
    }
    for(const item of items) {
        const store = await Store.findById(item.id);
        store.quantity -= item.quantity;
        await store.save();
        await Order.create(item)
    }
};

const getOrders = async () => {
    const orders = await Store.find();
    return orders;
};

const getOrder = async (id) => {
    const order = await Store.findById(id);
    if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    return order;
};

module.exports = {
    createOrder,
    getOrders,
    getOrder
}