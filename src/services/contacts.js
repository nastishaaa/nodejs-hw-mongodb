import {Contact} from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({ page, perPage }) => {
    const limit = perPage;
    const skip = (page - 1)* perPage;

    const contactsQuery = Contact.find();
    const contactsCount = await Contact.find().merge(contactsQuery).countDocuments();

    const contacts = await contactsQuery.skip(skip).limit(limit).exec();
    const paginationData = calculatePaginationData(contactsCount, page, perPage);
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