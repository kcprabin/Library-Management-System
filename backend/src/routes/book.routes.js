import { Router } from "express";
import { registerBook } from "../controllers/book.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/registerbook").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  registerBook
);

export default router;
