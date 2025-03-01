const { Store, Order } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const createOrder = async (items) => {
    const store = await Store.findById(items.item);
    if(!store) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
    }
    if(store.quantity < items.quantity) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${store.title}'s quantity is not enough for accept this order.`);
    }    
    await store.save();
    const order = await Order.create(items);
    return order;
};

const getOrders = async (filter, options) => {
    if (filter.status === 'all') {
        delete filter.status;
    }
    options.populate = [
        {
            path: 'item',
            select: 'title mainImage price quantity'
        }
    ];
    const orders = await Order.paginate(filter, options);
    return orders;
};

const getOrder = async (id) => {
    const order = await Store.findById(id);
    if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    return order;
};

const orderAction = async (id, status) => {
    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    const store = await Store.findById(order.item);
    if(store.quantity < order.quantity) {
        throw new ApiError(httpStatus.NOT_FOUND, `${store.title}'s quantity is not enough for accept this order.`);
    }
    store.quantity -= order.quantity;
    await store.save();
    order.status = status;
    await order.save();
    return order;
};

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    orderAction
}