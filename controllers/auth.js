import bcrypt from "bcrypt";

import { User } from "../models/user.js";
import {
  generateAccessToken,
  generateRefreshToken,
  resetPasswordToken,
} from "../utils/jwt.js";
import { transporter } from "../utils/mail.js";

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

const requestResetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = resetPasswordToken({ id: user._id });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = Date.now() + 3600000;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    });

    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
    });

    if (!user || user.resetPasswordExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { register, login, requestResetPassword, resetPassword };
