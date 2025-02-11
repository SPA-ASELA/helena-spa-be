const { storeService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { pick } = require('../utils/pick');

const addItem = catchAsync(async (req, res) => {
    const store = await storeService.addItem(req.files, req.body);
    res.status(httpStatus.CREATED).send(store);
});

const getItemsUser = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await storeService.getItemsUser(filter, options);
    res.send(result);
});

const getItemUser = catchAsync(async (req, res) => {
    const store = await storeService.getItemUser(req.params.id);
    res.send(store);
});

const getItemsAdmin = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await storeService.getItemsAdmin(filter, options);
    res.send(result);
});

const getItemAdmin = catchAsync(async (req, res) => {
    const store = await storeService.getItemAdmin(req.params.id);
    res.send(store);
});

const updateItem = catchAsync(async (req, res) => {
    const store = await storeService.updateItem(req.files, req.body);
    res.send(store);
});

module.exports = {
    addItem,
    getItemsUser,
    getItemUser,
    getItemsAdmin,
    getItemAdmin,
    updateItem
}