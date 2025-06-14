import { Router } from "express";
import registerRouter from "./auth.js";
import contactsRouter from "./contacts.js";

const router = Router();

router.use('/contacts', contactsRouter);
router.use('/auth', registerRouter);

export default router;