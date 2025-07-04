import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// user register
export const register = async (req, res) => {
  try {
    //hashing password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    await User.create({
      email: req.body.email,
      password_hash: hash,
      role: req.body.role || "customer",
    });

    res.status(200).json({ success: true, message: "Successfully created!" });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create! Try again." });
  }
};

// user login
export const login = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const checkCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password_hash
    );

    if (!checkCorrectPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password!" });
    }

    const { password_hash, ...rest } = user.toJSON();

    // create jwt token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET_KEY || "your-secret-key",
      { expiresIn: "15d" }
    );

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      })
      .status(200)
      .json({ token, data: { ...rest }, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Failed to login" });
  }
};
