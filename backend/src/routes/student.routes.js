import { Router } from "express";
import { getBooks } from "../controllers/student.controller.js";
import { get } from "mongoose";



const router = Router()

router.route("/student-dashboard/books").get(loginInCheck,getBooks)