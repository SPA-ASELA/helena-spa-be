const { contactService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const pick = require('../utils/pick');

const submitContact = catchAsync(async (req, res) => {
    const contact = await contactService.submitContact(req.body);
    res.status(httpStatus.CREATED).send(contact);
});

const getAllContacts = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const contacts = await contactService.getAllContacts(filter, options);
    res.status(httpStatus.OK).send(contacts);
});

const getContactById = catchAsync(async (req, res) => {
    const contact = await contactService.getContact(req.params.id);
    res.status(httpStatus.OK).send(contact);
});

module.exports = {
    submitContact,
    getAllContacts,
    getContactById
}