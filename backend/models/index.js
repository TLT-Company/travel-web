import User from "./User.js";
import Tour from "./Tour.js";
import Review from "./Review.js";
import Booking from "./Booking.js";

// Define relationships
Tour.hasMany(Review, { foreignKey: "productId", as: "reviews" });
Review.belongsTo(Tour, { foreignKey: "productId", as: "tour" });

User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "userId", as: "user" });

export { User, Tour, Review, Booking };
