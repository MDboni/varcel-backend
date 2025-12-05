import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  firstName: String,
  lastName: String,
  mobile: String,
  password: String,
  otp: { type: String },
  otpExpire: { type: Date },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ["admin", "student"], default: "student" }, 
  createDate: { type: Date, default: Date.now }
});

const UserModel = mongoose.model("users", DataSchema);
export default UserModel;
