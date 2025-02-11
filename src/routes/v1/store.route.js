const express = require('express');
const auth = require('../../middlewares/auth');
const storeService = require('../../controllers/store.controller');

const router = express.Router();

router.post('/add-item', auth('manageStore'), storeService.addItem);
router.get('/get-items-user', storeService.getItemsUser);
router.get('/get-item-user/:id', storeService.getItemUser);
router.get('/get-items-admin', auth('manageStore'), storeService.getItemsAdmin);
router.get('/get-item-admin/:id', auth('manageStore'), storeService.getItemAdmin);
router.patch('/update-item', auth('manageStore'), storeService.updateItem);

module.exports = router