const { Contact } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

/**
 * Create a contact
 * @param {Object} data
 * @returns {Promise<Contact>}
 */
const submitContact = async (data) => {
    const contact = await Contact.create(data);
    return contact;
};

/**
 * Query for contacts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllContacts = async (filter, options) => {
    const contacts = await Contact.paginate(filter, options);
    return contacts;
};

/**
 * Get contact by id
 * @param {ObjectId} id
 * @returns {Promise<Contact>}
 */
const getContact = async (id) => {
    const contact = await Contact.findById(id);
    if (!contact) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
    }
    await contact.updateOne({ isRead: true });
    return contact;
};

module.exports = {
    submitContact,
    getAllContacts,
    getContact,
}