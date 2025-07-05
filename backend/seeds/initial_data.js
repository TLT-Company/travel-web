import { sequelize } from "../config/database.js";
import {
  User,
  Customer,
  Employer,
  Tour,
  Booking,
  TaskAssignment,
  DocumentExportHistory,
  DocumentCustomer,
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
      card_id: "123456789012",
      card_created_at: "2020-01-15",
      full_name: "Trần Thị B",
      day_of_birth: "1990-05-15",
      gender: "Nữ",
      national: "Việt Nam",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      village: "Thôn ABC",
      province: "TP.HCM",
      district: "Quận 1",
      commune: "Phường Bến Nghé",
      place_of_birth: "TP.HCM",
      province_code: "79",
      district_code: "760",
      commune_code: "26734",
      phone_number: "0123456789",
      id_card_number: "123456789",
      id_card_front: "/uploads/id_cards/front_123456789.jpg",
      id_card_back: "/uploads/id_cards/back_123456789.jpg",
      picture: "/uploads/pictures/customer_1.jpg",
      verified_status: "verified",
    });

    // Create additional customers
    const customer2 = await Customer.create({
      user_id: customerUser.id,
      card_id: "987654321098",
      card_created_at: "2019-06-20",
      full_name: "Lê Văn C",
      day_of_birth: "1985-08-22",
      gender: "Nam",
      national: "Việt Nam",
      address: "456 Đường XYZ, Quận 3, TP.HCM",
      village: "Thôn XYZ",
      province: "TP.HCM",
      district: "Quận 3",
      commune: "Phường Võ Thị Sáu",
      place_of_birth: "TP.HCM",
      province_code: "79",
      district_code: "761",
      commune_code: "26737",
      phone_number: "0987654321",
      id_card_number: "987654321",
      id_card_front: "/uploads/id_cards/front_987654321.jpg",
      id_card_back: "/uploads/id_cards/back_987654321.jpg",
      picture: "/uploads/pictures/customer_2.jpg",
      verified_status: "verified",
    });

    // Create sample tours
    const tour1 = await Tour.create({
      name: "Tour Đà Nẵng - Hội An 3 ngày 2 đêm",
      description:
        "Khám phá vẻ đẹp của Đà Nẵng và phố cổ Hội An với các điểm đến nổi tiếng như Bãi biển Mỹ Khê, Bán đảo Sơn Trà, Phố cổ Hội An, Cầu Rồng...",
      price: 2500000,
      start_date: "2024-03-15",
      end_date: "2024-03-17",
      location: "Đà Nẵng, Hội An",
      created_by: adminUser.id,
    });

    const tour2 = await Tour.create({
      name: "Tour Sapa 2 ngày 1 đêm",
      description:
        "Trải nghiệm văn hóa dân tộc và cảnh đẹp núi rừng Tây Bắc với các hoạt động trekking, thăm bản làng dân tộc, chợ phiên Sapa...",
      price: 1800000,
      start_date: "2024-03-20",
      end_date: "2024-03-21",
      location: "Sapa, Lào Cai",
      created_by: adminUser.id,
    });

    const tour3 = await Tour.create({
      name: "Tour Nha Trang - Đà Lạt 4 ngày 3 đêm",
      description:
        "Kết hợp nghỉ dưỡng biển Nha Trang và khám phá thành phố ngàn hoa Đà Lạt với các điểm đến như Vinpearl, Thung lũng Tình Yêu, Hồ Xuân Hương...",
      price: 3200000,
      start_date: "2024-04-10",
      end_date: "2024-04-13",
      location: "Nha Trang, Đà Lạt",
      created_by: adminUser.id,
    });

    const tour4 = await Tour.create({
      name: "Tour Phú Quốc 3 ngày 2 đêm",
      description:
        "Khám phá đảo ngọc Phú Quốc với các bãi biển đẹp, VinWonders, Safari, và ẩm thực hải sản tươi ngon...",
      price: 2800000,
      start_date: "2024-04-25",
      end_date: "2024-04-27",
      location: "Phú Quốc, Kiên Giang",
      created_by: adminUser.id,
    });

    // Create sample bookings
    const booking1 = await Booking.create({
      customer_id: customer.id,
      tour_id: tour1.id,
      booking_date: new Date(),
      status: "confirmed",
      assigned_to: employer.id,
      note: "Khách hàng yêu cầu hướng dẫn viên nói tiếng Anh",
    });

    const booking2 = await Booking.create({
      customer_id: customer2.id,
      tour_id: tour2.id,
      booking_date: new Date(),
      status: "pending",
      assigned_to: employer.id,
      note: "Khách hàng có yêu cầu đặc biệt về ăn chay",
    });

    const booking3 = await Booking.create({
      customer_id: customer.id,
      tour_id: tour3.id,
      booking_date: new Date(),
      status: "cancelled",
      assigned_to: null,
      note: "Khách hàng hủy do lý do cá nhân",
    });

    // Create task assignments
    await TaskAssignment.create({
      employer_id: employer.id,
      booking_id: booking1.id,
      assigned_at: new Date(),
      status: "in_progress",
    });

    await TaskAssignment.create({
      employer_id: employer.id,
      booking_id: booking2.id,
      assigned_at: new Date(),
      status: "new",
    });

    // Create document customers
    await DocumentCustomer.create({
      document_number: "CV-2024-001",
      customer_id: customer.id,
    });

    await DocumentCustomer.create({
      document_number: "CV-2024-002",
      customer_id: customer2.id,
    });

    await DocumentCustomer.create({
      document_number: "CV-2024-003",
      customer_id: customer.id,
    });

    // Create document export histories
    await DocumentExportHistory.create({
      kind: "customer_report",
      file_path: "/exports/customer_report_2024_01.pdf",
      file_name: "customer_report_2024_01.pdf",
      status: "success",
    });

    await DocumentExportHistory.create({
      kind: "booking_summary",
      file_path: "/exports/booking_summary_2024_01.xlsx",
      file_name: "booking_summary_2024_01.xlsx",
      status: "success",
    });

    await DocumentExportHistory.create({
      kind: "tour_statistics",
      file_path: "/exports/tour_statistics_2024_01.pdf",
      file_name: "tour_statistics_2024_01.pdf",
      status: "failed",
    });

    console.log("✅ Initial data seeded successfully!");
    console.log("📋 Created:");
    console.log("  - 3 users (admin, employer, customer)");
    console.log("  - 1 employer profile");
    console.log("  - 2 customer profiles");
    console.log("  - 4 tours");
    console.log("  - 3 bookings");
    console.log("  - 2 task assignments");
    console.log("  - 3 document customers");
    console.log("  - 3 document export histories");
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
