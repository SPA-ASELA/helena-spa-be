const express = require('express');
const auth = require('../../middlewares/auth');
const orderService = require('../../controllers/order.controller');

const router = express.Router();

router
    .route('/')
    .post(orderService.createOrder)
    .get(orderService.getOrders);
router.get('/:id', orderService.getOrder);

module.exports = router