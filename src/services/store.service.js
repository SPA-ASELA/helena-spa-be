const { Store } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const fs = require('fs');

const addItem = async (images, data) => {
    data.mainImage = `/uploads/store/${images.mainImg[0].filename}`;
    data.subImages = [];
    if (images.subImgs) {
        images.subImgs.forEach((img) => {
            data.subImages.push(`/uploads/store/${img.filename}`);
        });
    }
    const store = await Store.create(data);
    return store;
};

const getItemsUser = async (filter, options) => {
    filter.status = 'active';
    if(filter.category === 'All') {
        delete filter.category;
    };    
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

const getUserCart = async (ids) => {
    const store = await Store.find({ _id: { $in: ids }, status: 'active' });
    return store;
};

const getItemsAdmin = async (filter, options) => {
    filter.category = filter.category === 'all' ? { $ne: 'deleted' } : filter.category;
    filter.status = filter.status === 'all' ? { $ne: 'deleted' } : filter.status;
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

const changeItemStatus = async (id, status) => {
    const store = await Store.findOne({ _id: id });
    if (!store) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
    }
    store.status = status;
    await store.save();
    return store;
};

const updateItem = async (images, data) => {
    const item = await Store.findOne({ _id: data.id });
    if (!item) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
    }
    if (images?.mainImg) {        
        fs.unlinkSync(`.${item.mainImage}`);
        item.mainImage = `/uploads/store/${images.mainImg[0].filename}`;
    }
    if (data.subImages) {
        data.subImages = JSON.parse(data.subImages);
        item.subImages.forEach((img) => {
            if (!data.subImages.includes(img)) {
                fs.unlinkSync(`.${img}`);
            }
        });
        item.subImages = data.subImages;
    } else {
        if(item.subImages.length > 0) {
            item.subImages.forEach((img) => {
                fs.unlinkSync(`.${img}`);
            });
            item.subImages = [];
        }
    }
    if (images?.subImgs) {
        images.subImgs.forEach((img) => {
            item.subImages.push(`/uploads/store/${img.filename}`);
        });
    }

    Object.keys(data).forEach((key) => {
        if (key !== 'subImages' && key !== 'mainImage' && data[key] !== undefined) {
            item[key] = data[key];
        }
    });

    await item.save();
    return item;
};

module.exports = {
    addItem,
    getItemsUser,
    getItemUser,
    getUserCart,
    getItemsAdmin,
    getItemAdmin,
    changeItemStatus,
    updateItem
}