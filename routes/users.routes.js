import { Router } from "express";
import { postUser } from "../controllers/users.controllers.js";

const router = Router();

router.post("/users", postUser);

export default router;