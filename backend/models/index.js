import User from "./User.js";
import Customer from "./Customer.js";
import Employer from "./Employer.js";
import Tour from "./Tour.js";
import Booking from "./Booking.js";
import TaskAssignment from "./TaskAssignment.js";
import DocumentExportHistory from "./DocumentExportHistory.js";

// User relationships
User.hasOne(Customer, { foreignKey: "user_id", as: "customer" });
Customer.belongsTo(User, { foreignKey: "user_id", as: "user" });

User.hasOne(Employer, { foreignKey: "user_id", as: "employer" });
Employer.belongsTo(User, { foreignKey: "user_id", as: "user" });

User.hasMany(Tour, { foreignKey: "created_by", as: "createdTours" });
Tour.belongsTo(User, { foreignKey: "created_by", as: "creator" });

// Customer relationships
Customer.hasMany(Booking, { foreignKey: "customer_id", as: "bookings" });
Booking.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });

// Tour relationships
Tour.hasMany(Booking, { foreignKey: "tour_id", as: "bookings" });
Booking.belongsTo(Tour, { foreignKey: "tour_id", as: "tour" });

// Employer relationships
Employer.hasMany(Booking, {
  foreignKey: "assigned_to",
  as: "assignedBookings",
});
Booking.belongsTo(Employer, {
  foreignKey: "assigned_to",
  as: "assignedEmployer",
});

Employer.hasMany(TaskAssignment, {
  foreignKey: "employer_id",
  as: "taskAssignments",
});
TaskAssignment.belongsTo(Employer, {
  foreignKey: "employer_id",
  as: "employer",
});

// Booking relationships
Booking.hasMany(TaskAssignment, {
  foreignKey: "booking_id",
  as: "taskAssignments",
});
TaskAssignment.belongsTo(Booking, { foreignKey: "booking_id", as: "booking" });

export {
  User,
  Customer,
  Employer,
  Tour,
  Booking,
  TaskAssignment,
  DocumentExportHistory,
};
