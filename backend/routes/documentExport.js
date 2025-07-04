import express from "express";
import {
  getAllDocumentExportHistories,
  getDocumentExportHistoryById,
  createDocumentExportHistory,
  updateDocumentExportHistory,
  deleteDocumentExportHistory,
  getDocumentExportHistoriesByStatus,
} from "../Controllers/documentExportController.js";

const router = express.Router();

// Get all document export histories
router.get("/", getAllDocumentExportHistories);

// Get document export histories by status
router.get("/status/:status", getDocumentExportHistoriesByStatus);

// Get document export history by ID
router.get("/:id", getDocumentExportHistoryById);

// Create new document export history
router.post("/", createDocumentExportHistory);

// Update document export history
router.put("/:id", updateDocumentExportHistory);

// Delete document export history
router.delete("/:id", deleteDocumentExportHistory);

export default router;
