import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { registerUserController, loginUserController, refreshUserController, logoutUserController } from "../controllers/auth.js";
import { registerUserSchema, loginSchema } from "../validation/user.js";
import { validateBody } from "../middlewares/validateBody.js";

const registerRouter = Router();

registerRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));
registerRouter.post('/login', validateBody(loginSchema), ctrlWrapper(loginUserController));
registerRouter.post('/refresh', ctrlWrapper(refreshUserController));
registerRouter.post('/logout', ctrlWrapper(logoutUserController));

export default registerRouter;
