import { Router } from "express";
import { getAllContactsController, getContactByIdController, createContactController, patchContactController, deleteContactByIdController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { isValidId } from "../middlewares/isValidId.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";

const contactsRouter = Router();

    contactsRouter.use(authenticate)

    contactsRouter.get('/contacts', ctrlWrapper(getAllContactsController));

    contactsRouter.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController));

    contactsRouter.post('/contacts', validateBody(createContactSchema), ctrlWrapper(createContactController));

    contactsRouter.patch('/contacts/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContactController));

    contactsRouter.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactByIdController));

export default contactsRouter;
    