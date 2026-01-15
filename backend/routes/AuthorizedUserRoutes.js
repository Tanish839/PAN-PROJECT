// backend/routes/AuthorizedUserRoutes.js
import express from "express";
import { createUser, getAllUsers } from "../controllers/AuthorizedUserController.js";

const router = express.Router();

// POST: Create new authorized user
router.post("/add", createUser);

// GET: Get all authorized users
router.get("/all", getAllUsers);

// ✅ This makes the import in server.js work!
export default router;
