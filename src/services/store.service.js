const { Store } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const fs = require('fs');

const addItem = async (images, data) => {
    images.forEach((img, index) => {
        data.images[index] = img.filename
    })
    const store = await Store.create(data);
    return store;
};

const getItemsUser = async (filter, options) => {
    filter.status = 'active';
    const stores = await Store.paginate(filter, options);
    return stores;
};

const getItemUser = async (id) => {
    const store = await Store.findOne({ _id: id, status: 'active' });
    if (!store) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
    }
    return store;
};

const getItemsAdmin = async (filter, options) => {
    const stores = await Store.paginate(filter, options);
    return stores;
};

const getItemAdmin = async (id) => {
    const store = await Store.findOne({ _id: id });
    if (!store) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
    }
    return store;
};

const updateItem = async (images, data) => {
    const item = await Store.findOne({ _id: data._id });
    if (!item) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
    }
    item.images.forEach((img, index) => {
        if(!data.images.include(img)){
            const ind = 0;
            item.images.splice(index, 1); // remove image name (string) from db
            fs.unlinkSync(`./uploads/${img}`); //remove image file from uploads folder
            item.images[index] = images[ind].filename; // update the new image name (string) in db
            ind++;
        }
    });
    data.images.forEach((img, index) => {
        if(!item.images.include(img)){
            item.images.push(images[index].filename); // add new image name (string) in db
        }
    });
    await item.save();
    return item;
};

module.exports = {
    addItem,
    getItemsUser,
    getItemUser,
    getItemsAdmin,
    getItemAdmin,
    updateItem
}