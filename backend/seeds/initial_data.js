import { sequelize } from "../config/database.js";
import {
  User,
  Customer,
  Employer,
  Tour,
  Booking,
  TaskAssignment,
} from "../models/index.js";
import bcrypt from "bcryptjs";

async function seedInitialData() {
  try {
    console.log("🌱 Starting to seed initial data...");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await User.create({
      email: "admin@example.com",
      password_hash: adminPassword,
      role: "admin",
    });

    // Create employer user
    const employerPassword = await bcrypt.hash("employer123", 10);
    const employerUser = await User.create({
      email: "employer@example.com",
      password_hash: employerPassword,
      role: "employer",
    });

    // Create customer user
    const customerPassword = await bcrypt.hash("customer123", 10);
    const customerUser = await User.create({
      email: "customer@example.com",
      password_hash: customerPassword,
      role: "customer",
    });

    // Create employer profile
    const employer = await Employer.create({
      user_id: employerUser.id,
      full_name: "Nguyễn Văn A",
      position: "Tour Guide",
    });

    // Create customer profile
    const customer = await Customer.create({
      user_id: customerUser.id,
      full_name: "Trần Thị B",
      phone_number: "0123456789",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      verified_status: "verified",
    });

    // Create sample tours
    const tour1 = await Tour.create({
      name: "Tour Đà Nẵng - Hội An 3 ngày 2 đêm",
      description: "Khám phá vẻ đẹp của Đà Nẵng và phố cổ Hội An",
      price: 2500000,
      start_date: "2024-03-15",
      end_date: "2024-03-17",
      location: "Đà Nẵng, Hội An",
      created_by: adminUser.id,
    });

    const tour2 = await Tour.create({
      name: "Tour Sapa 2 ngày 1 đêm",
      description: "Trải nghiệm văn hóa dân tộc và cảnh đẹp núi rừng Tây Bắc",
      price: 1800000,
      start_date: "2024-03-20",
      end_date: "2024-03-21",
      location: "Sapa, Lào Cai",
      created_by: adminUser.id,
    });

    // Create sample booking
    const booking = await Booking.create({
      customer_id: customer.id,
      tour_id: tour1.id,
      booking_date: new Date(),
      status: "pending",
      assigned_to: employer.id,
      note: "Khách hàng yêu cầu hướng dẫn viên nói tiếng Anh",
    });

    // Create task assignment
    await TaskAssignment.create({
      employer_id: employer.id,
      booking_id: booking.id,
      assigned_at: new Date(),
      status: "new",
    });

    console.log("✅ Initial data seeded successfully!");
    console.log("📋 Created:");
    console.log("  - 3 users (admin, employer, customer)");
    console.log("  - 1 employer profile");
    console.log("  - 1 customer profile");
    console.log("  - 2 tours");
    console.log("  - 1 booking");
    console.log("  - 1 task assignment");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedInitialData();
}

export { seedInitialData };
