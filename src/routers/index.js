import { Router } from "express";
import registerRouter from "./auth.js";
import contactsRouter from "./contacts.js";

const router = Router();

router.use('/contscts', contactsRouter);
router.use('/auth', registerRouter);

export default router;