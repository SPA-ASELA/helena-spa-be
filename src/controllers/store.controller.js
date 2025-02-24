const { storeService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const addItem = catchAsync(async (req, res) => {
    const store = await storeService.addItem(req.files, req.body);
    res.status(httpStatus.CREATED).send(store);
});

const getItemsUser = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await storeService.getItemsUser(filter, options);
    res.status(httpStatus.OK).send(result);
});

const getItemUser = catchAsync(async (req, res) => {
    const store = await storeService.getItemUser(req.params.id);
    res.status(httpStatus.OK).send(store);
});

const getItemsAdmin = catchAsync(async (req, res) => {    
    const filter = pick(req.query, ['status', 'category']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    // Check if the 'similar title' parameter is passed in the query
    if (req.query.searchKey) {
        filter.title = { $regex: req.query.searchKey, $options: 'i' };
    }
    const items = await storeService.getItemsAdmin(filter, options);
    res.status(httpStatus.OK).send(items);
});

const getItemAdmin = catchAsync(async (req, res) => {
    const store = await storeService.getItemAdmin(req.params.id);
    res.status(httpStatus.OK).send(store);
});

const changeItemStatus = catchAsync(async (req, res) => {
    const store = await storeService.changeItemStatus(req.body.id, req.body.status);
    res.status(httpStatus.OK).send(store);
});

const updateItem = catchAsync(async (req, res) => {
    const store = await storeService.updateItem(req.files, req.body);
    res.status(httpStatus.OK).send(store);
});

module.exports = {
    addItem,
    getItemsUser,
    getItemUser,
    getItemsAdmin,
    getItemAdmin,
    changeItemStatus,
    updateItem
}