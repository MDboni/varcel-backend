import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import SendEmail from "../utils/emailUtility.js";
import { EncodeToken } from "../utils/tokenUtility.js";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { email, firstName, lastName, mobile, password, role } = req.body;

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ status: "fail", message: "Email already registered!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // user with role 
    const user = await UserModel.create({
      email,
      firstName,
      lastName,
      mobile,
      password: hashedPassword,
      otp,
      otpExpire: Date.now() + 10 * 60 * 1000,
      role: role || "student", 
    });

    // Send OTP email
    await SendEmail(email, `Your OTP is: ${otp}`, "Email Verification");

    return res.status(201).json({
      status: "success",
      message: "User Registered! OTP sent to email.",
      userId: user._id,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};


// VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpire < Date.now()) return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    const token = EncodeToken(user.email, user._id);

    return res.status(200).json({ status: "success", message: "OTP Verified!", token });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified) return res.status(401).json({ message: "Please verify OTP first!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password!" });

    const token = EncodeToken(user.email, user._id);

    return res.status(200).json({
      status: "success",
      token,
      role: user.role, 
      email: user.email,
      photo: user.photo || null
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};


// LOGOUT
export const UserLogOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ status: "success", message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};
