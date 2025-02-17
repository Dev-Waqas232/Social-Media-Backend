import bcrypt from "bcrypt";

import { User } from "../models/user.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, gender } = req.body;

    const user = await User.findOne({ email });
    if (user) return res.status(409).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      gender,
    });

    await newUser.save();
    return res.status(201).json({ message: "Registered!!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid Credentials" });

    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass)
      return res.status(404).json({ message: "Invalid Credentials" });

    const accessToken = generateAccessToken({
      id: user._id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      id: user._id,
      email: user.email,
    });

    user.refreshToken = refreshToken;
    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    await user.save();
    return res.status(200).json({ message: "Login!!!", data: accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { register, login };
