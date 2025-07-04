import DocumentExportHistory from "../models/DocumentExportHistory.js";

// Get all document export histories
export const getAllDocumentExportHistories = async (req, res) => {
  try {
    const histories = await DocumentExportHistory.findAll({
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({
      success: true,
      message: "Successfully retrieved document export histories",
      data: histories,
    });
  } catch (error) {
    console.error("Get all document export histories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve document export histories",
    });
  }
};

// Get document export history by ID
export const getDocumentExportHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await DocumentExportHistory.findByPk(id);

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "Document export history not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully retrieved document export history",
      data: history,
    });
  } catch (error) {
    console.error("Get document export history by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve document export history",
    });
  }
};

// Create new document export history
export const createDocumentExportHistory = async (req, res) => {
  try {
    const { kind, file_path, file_name, status } = req.body;

    const newHistory = await DocumentExportHistory.create({
      kind,
      file_path,
      file_name,
      status: status || "pending",
    });

    res.status(201).json({
      success: true,
      message: "Successfully created document export history",
      data: newHistory,
    });
  } catch (error) {
    console.error("Create document export history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create document export history",
    });
  }
};

// Update document export history
export const updateDocumentExportHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { kind, file_path, file_name, status } = req.body;

    const history = await DocumentExportHistory.findByPk(id);

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "Document export history not found",
      });
    }

    await history.update({
      kind,
      file_path,
      file_name,
      status,
    });

    res.status(200).json({
      success: true,
      message: "Successfully updated document export history",
      data: history,
    });
  } catch (error) {
    console.error("Update document export history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update document export history",
    });
  }
};

// Delete document export history
export const deleteDocumentExportHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await DocumentExportHistory.findByPk(id);

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "Document export history not found",
      });
    }

    await history.destroy();

    res.status(200).json({
      success: true,
      message: "Successfully deleted document export history",
    });
  } catch (error) {
    console.error("Delete document export history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete document export history",
    });
  }
};

// Get document export histories by status
export const getDocumentExportHistoriesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const histories = await DocumentExportHistory.findAll({
      where: { status },
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: `Successfully retrieved document export histories with status: ${status}`,
      data: histories,
    });
  } catch (error) {
    console.error("Get document export histories by status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve document export histories by status",
    });
  }
};
