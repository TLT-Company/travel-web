import DocumentExportHistory from "../models/DocumentExportHistory.js";
import Customer from "../models/Customer.js";
import DocumentCustomer from "../models/DocumentCustomer.js";
import ExcelJS from "exceljs";
import fs from "fs";
import archiver from "archiver";
import moment from "moment";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Perform analysis file - Main function
export const performAnalysisFile = async (req, res) => {
  let documentExportTxt = null;
  let documentExportDeclaration = null;
  let documentExportGroupVN = null;
  let documentExportGroupCN = null;

  try {
    let errorsInfo = [];
    if (!req.body.file_name) {
      errorsInfo.push({ message: "Vui lòng nhập file name." });
    }
    if (errorsInfo.length !== 0) {
      throw { errors: errorsInfo, isValidateRequired: true };
    }

    const fileName = req.body.file_name;
    console.log("Name file", fileName);

    // Create document export history records
    documentExportTxt = await DocumentExportHistory.create({
      kind: "encryptedList",
      file_name: fileName,
      status: "processing",
    });
    documentExportDeclaration = await DocumentExportHistory.create({
      kind: "declarationList",
      file_name: fileName,
      status: "processing",
    });
    documentExportGroupVN = await DocumentExportHistory.create({
      kind: "groupListVN",
      file_name: fileName,
      status: "processing",
    });
    documentExportGroupCN = await DocumentExportHistory.create({
      kind: "groupListCN",
      file_name: fileName,
      status: "processing",
    });

    // Define file paths
    const txtFilePath = `./public/export/encrypted_list/${fileName}.txt`;
    const declarationListFilePath = `./public/export/declaration_list/${fileName}_form.zip`;
    const groupVNFilePath = `./public/export/group_list_vn/${fileName}_danh_sach_vn.xlsx`;
    const groupCNFilePath = `./public/export/group_list_cn/${fileName}_danh_sach_cn.xlsx`;

    // Update file paths in database
    documentExportTxt.file_path = txtFilePath;
    documentExportDeclaration.file_path = declarationListFilePath;
    documentExportGroupVN.file_path = groupVNFilePath;
    documentExportGroupCN.file_path = groupCNFilePath;

    // Get customer data through DocumentCustomer table
    const usersInfo2 = await Customer.findAll({
      include: [
        {
          model: DocumentCustomer,
          as: "documentCustomers",
          where: {
            document_number: fileName,
          },
          required: true,
        },
      ],
    }).then((results) => results.map((item) => item.dataValues));

    // Create ZIP file for declaration list
    const output = fs.createWriteStream(declarationListFilePath);
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    output.on("close", function () {
      for (const user of usersInfo2) {
        const filePath = `./public/export/declaration_list/${fileName}_${user.card_id}.xlsx`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    archive.on("error", function (err) {
      throw err;
    });

    archive.pipe(output);

    // Process each user
    for (let i = 0; i < usersInfo2.length; i++) {
      let userInfo = usersInfo2[i];

      // Create declaration file for each user
      const filePathDeclaration = await exportDeclarationFile(
        userInfo,
        fileName
      );
      archive.file(filePathDeclaration, {
        name: `${i + 1}.${userInfo.full_name.toUpperCase()}.${fileName}.${
          userInfo.card_id
        }.xlsx`,
      });
    }

    // Export group lists
    await exportGroupVN(usersInfo2, fileName);
    await exportGroupCN(usersInfo2, fileName);

    // Update status to success
    documentExportTxt.status = "success";
    await documentExportTxt.save();

    await archive.finalize();
    documentExportDeclaration.status = "success";
    await documentExportDeclaration.save();

    documentExportGroupVN.status = "success";
    await documentExportGroupVN.save();

    documentExportGroupCN.status = "success";
    await documentExportGroupCN.save();

    return res
      .status(200)
      .json({ success: true, message: "Trích xuất thông tin thành công!" });
  } catch (error) {
    // Update status to failed for all records
    if (documentExportTxt) {
      documentExportTxt.status = "failed";
      await documentExportTxt.save();
    }
    if (documentExportDeclaration) {
      documentExportDeclaration.status = "failed";
      await documentExportDeclaration.save();
    }
    if (documentExportGroupVN) {
      documentExportGroupVN.status = "failed";
      await documentExportGroupVN.save();
    }
    if (documentExportGroupCN) {
      documentExportGroupCN.status = "failed";
      await documentExportGroupCN.save();
    }

    console.error("Error during file upload:", error);

    return res.status(500).json({
      success: false,
      errors: error.errors,
      isValidateRequired: error.isValidateRequired,
    });
  }
};

// Helper function to export declaration file
async function exportDeclarationFile(user, fileName) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(
    path.join(
      __dirname,
      "../public/export/declaration_list/declaration_tmp.xlsx"
    )
  );
  const worksheet = workbook.getWorksheet(1);

  worksheet.pageSetup = {
    paperSize: 9, // A4 size
    orientation: "portrait",
    margins: {
      top: 1,
      bottom: 1,
      left: 0.5,
      right: 0.5,
      header: 0.5,
      footer: 0.5,
    },
    fitToPage: true,
    fitToHeight: 1,
    fitToWidth: 1,
  };

  const sourceCell = worksheet.getCell("A1");
  const targetCell = worksheet.getCell("B2");

  targetCell.value = sourceCell.value;
  targetCell.fill = sourceCell.fill;
  targetCell.font = sourceCell.font;
  targetCell.border = sourceCell.border;
  targetCell.alignment = sourceCell.alignment;
  targetCell.numberFormat = sourceCell.numberFormat;

  const dayOfBirths = moment(user.day_of_birth).format("DD-MM-YYYY").split("-");
  const createdAts = moment(user.card_created_at)
    .format("DD-MM-YYYY")
    .split("-");

  worksheet.getCell("H8").value = user.full_name.toUpperCase();
  worksheet.getCell("U8").value = user.gender === "Nữ" ? "X" : "";
  worksheet.getCell("S8").value = user.gender === "Nam" ? "X" : "";
  worksheet.getCell("E9").value = dayOfBirths[0];
  worksheet.getCell("I9").value = dayOfBirths[1];
  worksheet.getCell("L9").value = dayOfBirths[2];
  worksheet.getCell("R9").value = user.place_of_birth;
  worksheet.getCell("F11").value = createdAts[0];
  worksheet.getCell("H11").value = createdAts[1];
  worksheet.getCell("J11").value = createdAts[2];
  worksheet.getCell("S11").value = user.province;
  worksheet.getCell("E12").value = "Kinh";
  worksheet.getCell("K12").value = "Không";
  worksheet.getCell("S13").value = user.village;
  worksheet.getCell("F14").value = user.commune;
  worksheet.getCell("L14").value = user.district;
  worksheet.getCell("S14").value = user.province;
  worksheet.getCell("L28").value = user.full_name.toUpperCase();

  const digits = user.card_id.split("");
  let startRow = 10;
  let startCol = "G".charCodeAt(0);

  // Set font size 12 for data cells
  const cellsToFormat = [
    "H8",
    "U8",
    "S8",
    "E9",
    "I9",
    "L9",
    "R9",
    "F11",
    "H11",
    "J11",
    "S11",
    "E12",
    "K12",
    "S13",
    "F14",
    "L14",
    "S14",
    "L28",
  ];

  cellsToFormat.forEach((cellAddress) => {
    const cell = worksheet.getCell(cellAddress);
    cell.font = {
      ...cell.font,
      size: 12,
      name: "Times New Roman",
    };
  });

  digits.forEach((digit, index) => {
    const cellAddress = String.fromCharCode(startCol + index) + startRow;
    const cellcc = worksheet.getCell(cellAddress);
    cellcc.value = digit;
    cellcc.font = {
      bold: true,
      size: 12,
      name: "Times New Roman",
    };
    cellcc.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  const outputPath = `./public/export/declaration_list/${fileName}_${user.card_id}.xlsx`;
  await workbook.xlsx.writeFile(outputPath);
  return outputPath;
}

// Helper function to export group CN
async function exportGroupCN(users, fileName) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(
    path.join(
      __dirname,
      "../public/export/group_list_cn/group_list_cn_tmp.xlsx"
    )
  );
  const worksheet = workbook.getWorksheet(1);

  const sourceCell = worksheet.getCell("A1");
  const targetCell = worksheet.getCell("B2");

  targetCell.value = sourceCell.value;
  targetCell.fill = sourceCell.fill;
  targetCell.font = sourceCell.font;
  targetCell.border = sourceCell.border;
  targetCell.alignment = sourceCell.alignment;
  targetCell.numberFormat = sourceCell.numberFormat;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const numOrder = i + 7;
    const englishName = user.full_name
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const dayOfBirth = moment(user.day_of_birth).format("YYYYMMDD");

    const cells = [
      worksheet.getCell(`B${numOrder}`),
      worksheet.getCell(`C${numOrder}`),
      worksheet.getCell(`D${numOrder}`),
      worksheet.getCell(`E${numOrder}`),
      worksheet.getCell(`F${numOrder}`),
    ];
    const genderCode = user.gender === "Nữ" ? "F" : "M";
    cells[0].value = `${i + 1}`;
    cells[1].value = `${englishName}`;
    cells[2].value = `${genderCode}`;
    cells[3].value = `${dayOfBirth}`;
    cells[4].value = "";

    cells.forEach((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  }

  const outputPath = `./public/export/group_list_cn/${fileName}_danh_sach_cn.xlsx`;
  await workbook.xlsx.writeFile(outputPath);
}

// Helper function to export group VN
async function exportGroupVN(users, fileName) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(
    path.join(
      __dirname,
      "../public/export/group_list_vn/group_list_vn_tmp.xlsx"
    )
  );
  const worksheet = workbook.getWorksheet(1);

  const sourceCell = worksheet.getCell("A1");
  const targetCell = worksheet.getCell("B2");

  targetCell.value = sourceCell.value;
  targetCell.fill = sourceCell.fill;
  targetCell.font = sourceCell.font;
  targetCell.border = sourceCell.border;
  targetCell.alignment = sourceCell.alignment;
  targetCell.numberFormat = sourceCell.numberFormat;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const numOrder = i + 6;

    const cells = [
      worksheet.getCell(`B${numOrder}`),
      worksheet.getCell(`C${numOrder}`),
      worksheet.getCell(`D${numOrder}`),
      worksheet.getCell(`E${numOrder}`),
      worksheet.getCell(`F${numOrder}`),
      worksheet.getCell(`G${numOrder}`),
    ];
    const genderCode = user.gender === "Nữ" ? "F" : "M";
    const dayOfBirth = moment(user.day_of_birth).format("DD/MM/YYYY");
    cells[0].value = `${i + 1}`;
    cells[1].value = `${user.full_name.toUpperCase()}`;
    cells[2].value = `${genderCode}`;
    cells[3].value = `${dayOfBirth}`;
    cells[4].value = `${user.card_id}`;
    cells[5].value = `${user.province}`;

    cells.forEach((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  }

  const outputPath = `./public/export/group_list_vn/${fileName}_danh_sach_vn.xlsx`;
  await workbook.xlsx.writeFile(outputPath);
}
