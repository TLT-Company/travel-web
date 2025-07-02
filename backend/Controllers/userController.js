import User from "../models/User.js";

//Create new User
export const createUser = async (req, res) => {
  try {
    const savedUser = await User.create(req.body);
    res.status(200).json({
      success: true,
      message: "Successfully created",
      data: savedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create. Try again!" });
  }
};

//Update User
export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.update(req.body, {
      where: { id: id },
      returning: true,
    });

    if (updatedUser[0] === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedUser[1][0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

//Delete User
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedCount = await User.destroy({
      where: { id: id },
    });

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Successfully deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

//Get single User
export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Successfully", data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not Found" });
  }
};

//GetAll User
export const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();

    res
      .status(200)
      .json({ success: true, message: "Successfully", data: users });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not Found" });
  }
};
