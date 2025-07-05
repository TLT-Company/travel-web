import Booking from "./../models/Booking.js";

// create new booking
export const createBooking = async (req, res) => {
  try {
    const savedBooking = await Booking.create(req.body);

    res.status(200).json({
      success: true,
      message: "Your tour is booked!",
      data: savedBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

// get single booking
export const getBooking = async (req, res) => {
  const id = req.params.id;

  try {
    const book = await Booking.findByPk(id);

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found!" });
    }

    res.status(200).json({ success: true, message: "Successful!", data: book });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not Found!" });
  }
};

// get all booking
export const getAllBooking = async (req, res) => {
  try {
    const books = await Booking.findAll();

    res
      .status(200)
      .json({ success: true, message: "Successful!", data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};
