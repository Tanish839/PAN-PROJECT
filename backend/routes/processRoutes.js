import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  addProcessNote,
  getAllProcessNotes,
  getProcessById,
  approveProcessNote,
  rejectProcessNote,
  updateProcessNote,
  getRoleCounts,
} from "../controllers/processController.js";

const router = express.Router();

router.post(
  "/add",
  upload.fields([
    { name: "businessAttachment", maxCount: 1 },
    { name: "attachment", maxCount: 1 },
  ]),
  addProcessNote
);

router.get("/all", getAllProcessNotes);

router.get("/role-counts", getRoleCounts); 

router.patch("/approve/:id", approveProcessNote);

router.put("/reject/:id", rejectProcessNote);

router.put("/update/:id", updateProcessNote);
router.get("/:id", getProcessById);

export default router;
