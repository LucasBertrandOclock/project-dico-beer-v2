import { Router } from "express";

import authRouter from "./auth.router.js";
import beersRouter from "./beers.router.js";
import colorsRouter from "./colors.router.js";
import typesRouter from "./types.router.js";
import contactRouter from "./contact.router.js";
import usersRouter from "./users.router.js";
import listRouter from "./list.router.js";

const router = Router();

router.use(authRouter);
router.use(beersRouter);
router.use(colorsRouter);
router.use(typesRouter);
router.use(contactRouter);
router.use(usersRouter);
router.use(listRouter);

export { router };
