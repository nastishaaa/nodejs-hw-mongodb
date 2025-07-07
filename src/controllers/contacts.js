import { getAllContacts, getContactById, createContact, updateContact, deleteContactById } from "../services/contacts.js";
import createHttpError from "http-errors";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

export const getAllContactsController = async (req, res ) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortOrder, sortBy } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const userId = req.user._id;

    const contacts = await getAllContacts({ page, perPage, sortOrder, sortBy, filter, userId });

        res.json({
            status: 200,
            message: 'Successfully found contacts!',
            data: contacts,
        });
    
};

export const getContactByIdController = async (req, res) => {
    const userId = req.user._id;
    const { contactId } = req.params;
    
    const contact = await getContactById( contactId, userId );

    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.json({
        status: 200, 
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    })
};

export const createContactController = async (req, res) => {

    const userId = req.user._id;
    const photo = req.file;
    let photoUrl;

    if (photo) {
        if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToCloudinary(photo);
        }
    }

    const contact = await createContact({ ...req.body, photo: photoUrl }, userId );

    
    res.status(201).json({
        status: 201, 
        message: 'Successfully created a contact!',
        data: {
            userId, 
            ...contact.toObject(),
        }
    })
};

export const patchContactController = async (req, res, next) => {
    const userId = req.user._id;
    const { contactId } = req.params;
    const photo = req.file;
    let photoUrl;
        
    if (photo) {
        if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToCloudinary(photo);
        }
    }
    const contact = await updateContact(contactId, userId, {...req.body, photo: photoUrl,});

    if(!contact){
        return next(createHttpError(404, 'Contact not found'));
    }

    res.status(200).json({
        status: 200,
        message: `"Successfully patched a contact!"`,
        data: contact, 
    })  

};

export const deleteContactByIdController = async (req, res, next) => {
    const userId = req.user._id;
    const {contactId} = req.params;
    const contact = await deleteContactById(contactId, userId);

    if(!contact) {
        return next(createHttpError(404, 'Contact not found'));
    }

    res.status(204).send();
};