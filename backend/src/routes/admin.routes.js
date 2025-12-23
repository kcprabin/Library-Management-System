import { Router } from "express";
import { registerBook} from "../controllers/admin.controller..js";
import { upload } from "../middleware/multer.middleware.js";
import { loginInCheck } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/registerbook").post(
  loginInCheck,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  registerBook
);
// router.route("/editbooks").post(loginInCheck, editbook);

export default router;
