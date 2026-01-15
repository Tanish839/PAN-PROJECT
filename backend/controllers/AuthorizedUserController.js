import AuthorizedUser from "../models/AuthorizedUserModel.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
export const createUser = async (req, res) => {
  try {
    const { id, password, name, role, department, zone, state, reportingTo } = req.body;

    const existingUser = await User.findOne({ username: id });
    if (existingUser) {
      return res.status(400).json({ error: "User with this ID already exists for login" });
    }

    const newAuthorizedUser = new AuthorizedUser({
      id,
      password,
      name,
      role,
      department,
      zone,
      state,
      reportingTo,
    });
    await newAuthorizedUser.save();

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: id,
      password: hashedPassword,
      role: role, 
    });
    await newUser.save();

    res.status(201).json({ message: "User created and registered for login" });

  } catch (err) {
    console.error("Error in createUser:", err);
    res.status(400).json({ error: err.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await AuthorizedUser.find();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error in getAllUsers:", err);
    res.status(500).json({ error: err.message });
  }
};
