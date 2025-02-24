const express = require('express');
const auth = require('../../middlewares/auth');
const storeService = require('../../controllers/store.controller');
const { setupMulter } = require('../../middlewares/multer');

const router = express.Router();
const imgUpload = setupMulter('uploads/store');

router.post('/add-item', auth('manageStore'), imgUpload.fields([{ name: 'mainImg', maxCount: 1 }, { name: 'subImgs', maxCount: 5 }]),  storeService.addItem);
router.get('/get-items-user', storeService.getItemsUser);
router.get('/get-item-user/:id', storeService.getItemUser);
router.get('/get-items-admin', auth('manageStore'), storeService.getItemsAdmin);
router.get('/get-item-admin/:id', auth('manageStore'), storeService.getItemAdmin);
router.patch('/change-item-status', auth('manageStore'), storeService.changeItemStatus);
router.patch('/update-item', auth('manageStore'), imgUpload.fields([{ name: 'mainImg', maxCount: 1 }, { name: 'subImgs', maxCount: 5 }]), storeService.updateItem);

module.exports = router