import { Router } from "express";
import { registerBook } from "../controllers/book.controller.js";

const router = Router();


router.route("/books").post(registerBook)




export default router