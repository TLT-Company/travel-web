import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const up = async () => {
  await sequelize.getQueryInterface().createTable("document_export_histories", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.INTEGER,
    },
    kind: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Loại tài liệu export",
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Đường dẫn file",
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Tên file",
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Trạng thái (success, failed, etc.)",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
};

export const down = async () => {
  await sequelize.getQueryInterface().dropTable("document_export_histories");
};
