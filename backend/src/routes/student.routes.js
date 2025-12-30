import { Router } from "express";
import { getBooks , bookBorrow,bookTaken} from "../controllers/student.controller.js";
import { loginInCheck } from "../middleware/auth.middleware.js";




const router = Router()

router.route("/student-dashboard/books").get(loginInCheck,getBooks)
router.route('/borrowbook').post(loginInCheck, bookBorrow)
router.route('/seebook').get(loginInCheck,bookTaken)


export default router