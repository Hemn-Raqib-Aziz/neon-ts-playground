// src/routes/postRoutes.ts
import { Router } from "express";
import postController from "../controllers/postControllers";

const router = Router();

router.get("/", postController.getPosts);
router.post("/", postController.createPost); 

export default router;
