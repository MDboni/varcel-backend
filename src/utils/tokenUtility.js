// src/utility/tokenUtility.js
import jwt from "jsonwebtoken";

//  Encode Token
export const EncodeToken = (email, user_id) => {
  try {
    const payload = { email, user_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    });
    return token;
  } catch (error) {
    console.error("Token Encode Error:", error.message);
    return null;
  }
};

//  Decode Token
export const DecodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Token Decode Error:", error.message);
    return null;
  }
};
