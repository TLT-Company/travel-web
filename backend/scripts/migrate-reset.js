import { sequelize } from "../config/database.js";
import { readdir } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function resetAndMigrate() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Drop all tables in reverse order to avoid foreign key constraints
    const tablesToDrop = [
      "task_assignments",
      "bookings",
      "tours",
      "employers",
      "customers",
      "users",
      "document_customer",
      "document_export_histories",
    ];

    console.log("🗑️ Dropping existing tables...");
    for (const table of tablesToDrop) {
      try {
        await sequelize.getQueryInterface().dropTable(table, { force: true });
        console.log(`✅ Dropped table: ${table}`);
      } catch (error) {
        console.log(`ℹ️ Table ${table} doesn't exist or already dropped`);
      }
    }

    // Get all migration files
    const migrationsDir = join(__dirname, "..", "migrations");
    const files = await readdir(migrationsDir);
    const migrationFiles = files.filter((file) => file.endsWith(".js")).sort(); // This will sort them in the correct order (001_, 002_, etc.)

    console.log(`📁 Found ${migrationFiles.length} migration files.`);

    // Run each migration
    for (const file of migrationFiles) {
      console.log(`🔄 Running migration: ${file}`);
      const migration = await import(join(migrationsDir, file));

      try {
        await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
        console.log(`✅ Migration ${file} completed successfully.`);
      } catch (error) {
        console.error(`❌ Migration ${file} failed:`, error.message);
        throw error;
      }
    }

    console.log("🎉 All migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  resetAndMigrate();
}

export { resetAndMigrate };
