import {Contact} from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../index.js';
import { parseType, parseIsFavourite } from '../utils/parseFilterParams.js';

export const getAllContacts = async ({ page, perPage,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
    filter = {}}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = Contact.find();

    const contactType = parseType(filter?.contactType);
    if (contactType) {
        contactsQuery.where('contactType').equals(filter.contactType);
    }
    const isFavourite = parseIsFavourite(filter?.isFavourite);
    if (isFavourite) {
        contactsQuery.where('isFavourite').equals(filter.isFavourite);
    }
    const contactsCount = await Contact.find().merge(contactsQuery).countDocuments();

    const contacts = await contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();
    const paginationData = calculatePaginationData(contactsCount, page, perPage);
    
    if (page > paginationData.totalPages && contactsCount > 0) {
        const err = new Error(`Page ${page} does not exist. Only ${paginationData.totalPages} pages available.`);
        err.status = 404;
        throw err;
    }
    
    return {
        data: contacts,
        ...paginationData,
    };
};

export const getContactById = async (contactId) => {
    const contact = await Contact.findById(contactId);
    return contact;
}

export const createContact = async (payload) => {
    const contact = await Contact.create(payload);
    return contact;
}

export const updateContact = async (contactId, payload) => {
    const contact = await Contact.findByIdAndUpdate(contactId, payload);
    return contact;

}

export const deleteContactById = async (contactId) => {
    const contact = await Contact.findByIdAndDelete(contactId)
    return contact;
}